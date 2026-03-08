import type { CustomValidator, FieldValidationError, ValidationResult, ValidationRule } from '../types';

type BuiltInValidator = (value: unknown, rule: ValidationRule) => string | null;

const builtInValidators: Record<string, BuiltInValidator> = {
  required: (value) => {
    if (value === undefined || value === null || value === '') return 'This field is required';
    if (Array.isArray(value) && value.length === 0) return 'This field is required';
    return null;
  },

  minLength: (value, rule) => {
    const min = rule.value as number;
    if (typeof value === 'string' && value.length < min) {
      return rule.message || `Minimum length is ${min}`;
    }
    return null;
  },

  maxLength: (value, rule) => {
    const max = rule.value as number;
    if (typeof value === 'string' && value.length > max) {
      return rule.message || `Maximum length is ${max}`;
    }
    return null;
  },

  min: (value, rule) => {
    const min = rule.value as number;
    if (typeof value === 'number' && value < min) {
      return rule.message || `Minimum value is ${min}`;
    }
    return null;
  },

  max: (value, rule) => {
    const max = rule.value as number;
    if (typeof value === 'number' && value > max) {
      return rule.message || `Maximum value is ${max}`;
    }
    return null;
  },

  regex: (value, rule) => {
    const pattern = rule.value as string;
    if (typeof value === 'string' && value && !new RegExp(pattern).test(value)) {
      return rule.message || `Value does not match pattern`;
    }
    return null;
  },

  pattern: (value, rule) => {
    return builtInValidators.regex(value, rule);
  },

  email: (value) => {
    if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  url: (value) => {
    if (typeof value === 'string' && value) {
      try {
        new URL(value);
      } catch {
        return 'Please enter a valid URL';
      }
    }
    return null;
  },
};

export class Validator {
  private customValidators = new Map<string, CustomValidator>();

  registerValidator(name: string, validator: CustomValidator): void {
    this.customValidators.set(name, validator);
  }

  async validateField(
    fieldId: string,
    value: unknown,
    rules: ValidationRule[],
    formValues: Record<string, unknown>,
  ): Promise<FieldValidationError[]> {
    const errors: FieldValidationError[] = [];

    for (const rule of rules) {
      const builtIn = builtInValidators[rule.type];
      if (builtIn) {
        const error = builtIn(value, rule);
        if (error) {
          errors.push({ fieldId, message: rule.message || error, type: rule.type });
        }
        continue;
      }

      if (rule.validate) {
        const result = await rule.validate(value, formValues);
        if (result !== true) {
          errors.push({
            fieldId,
            message: typeof result === 'string' ? result : rule.message || 'Validation failed',
            type: rule.type,
          });
        }
        continue;
      }

      const custom = this.customValidators.get(rule.type);
      if (custom) {
        const result = await custom(value, formValues);
        if (result !== true) {
          errors.push({
            fieldId,
            message: typeof result === 'string' ? result : rule.message || 'Validation failed',
            type: rule.type,
          });
        }
      }
    }

    return errors;
  }

  async validateAll(
    values: Record<string, unknown>,
    fieldRules: Map<string, ValidationRule[]>,
  ): Promise<ValidationResult> {
    const allErrors: FieldValidationError[] = [];

    for (const [fieldId, rules] of fieldRules) {
      const fieldErrors = await this.validateField(fieldId, values[fieldId], rules, values);
      allErrors.push(...fieldErrors);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
