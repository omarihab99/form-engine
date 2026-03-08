export type BuiltInValidationType =
  | 'required'
  | 'regex'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'email'
  | 'url'
  | 'pattern';

export interface ValidationRule {
  type: string;
  message?: string;
  value?: unknown;
  validate?: (value: unknown, formValues: Record<string, unknown>) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldValidationError[];
}

export interface FieldValidationError {
  fieldId: string;
  message: string;
  type: string;
}

export type CustomValidator = (
  value: unknown,
  formValues: Record<string, unknown>,
) => boolean | string | Promise<boolean | string>;
