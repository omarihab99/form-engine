import type { FieldSchema, FieldType, FormSchema, SectionSchema } from '../types';

const VALID_FIELD_TYPES: FieldType[] = [
  'text', 'textarea', 'number', 'date', 'dropdown', 'multiselect',
  'radio', 'checkbox', 'toggle', 'file', 'people-picker', 'lookup',
  'taxonomy', 'rich-text',
];

export interface SchemaValidationError {
  path: string;
  message: string;
}

export class SchemaParser {
  validate(schema: unknown): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    if (!schema || typeof schema !== 'object') {
      errors.push({ path: '', message: 'Schema must be an object' });
      return errors;
    }

    const s = schema as Record<string, unknown>;

    if (!s.id || typeof s.id !== 'string') {
      errors.push({ path: 'id', message: 'Schema must have a string "id"' });
    }

    if (!Array.isArray(s.sections)) {
      errors.push({ path: 'sections', message: 'Schema must have a "sections" array' });
      return errors;
    }

    const fieldIds = new Set<string>();

    for (let si = 0; si < s.sections.length; si++) {
      const section = s.sections[si] as Record<string, unknown>;
      const sPath = `sections[${si}]`;

      if (!section.id || typeof section.id !== 'string') {
        errors.push({ path: `${sPath}.id`, message: 'Section must have a string "id"' });
      }

      if (!Array.isArray(section.fields)) {
        errors.push({ path: `${sPath}.fields`, message: 'Section must have a "fields" array' });
        continue;
      }

      for (let fi = 0; fi < section.fields.length; fi++) {
        const field = section.fields[fi] as Record<string, unknown>;
        const fPath = `${sPath}.fields[${fi}]`;

        if (!field.id || typeof field.id !== 'string') {
          errors.push({ path: `${fPath}.id`, message: 'Field must have a string "id"' });
        } else if (fieldIds.has(field.id as string)) {
          errors.push({ path: `${fPath}.id`, message: `Duplicate field id: "${field.id}"` });
        } else {
          fieldIds.add(field.id as string);
        }

        if (!field.type || !VALID_FIELD_TYPES.includes(field.type as FieldType)) {
          errors.push({
            path: `${fPath}.type`,
            message: `Invalid field type: "${field.type}". Valid types: ${VALID_FIELD_TYPES.join(', ')}`,
          });
        }

        if (!field.label || typeof field.label !== 'string') {
          errors.push({ path: `${fPath}.label`, message: 'Field must have a string "label"' });
        }

        const needsOptions: FieldType[] = ['dropdown', 'multiselect', 'radio'];
        if (needsOptions.includes(field.type as FieldType) && !Array.isArray(field.options)) {
          errors.push({
            path: `${fPath}.options`,
            message: `Field type "${field.type}" requires an "options" array`,
          });
        }
      }
    }

    return errors;
  }

  parse(schema: unknown): FormSchema {
    const errors = this.validate(schema);
    if (errors.length > 0) {
      throw new Error(
        `Invalid form schema:\n${errors.map((e) => `  - ${e.path}: ${e.message}`).join('\n')}`,
      );
    }

    const raw = schema as FormSchema;

    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      locale: raw.locale || 'en',
      sections: raw.sections.map((section) => this.normalizeSection(section)),
      submit: raw.submit,
      theme: raw.theme,
    };
  }

  private normalizeSection(section: SectionSchema): SectionSchema {
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      columns: section.columns || 1,
      collapsible: section.collapsible || false,
      collapsed: section.collapsed || false,
      repeatable: section.repeatable || false,
      minItems: section.minItems,
      maxItems: section.maxItems,
      fields: section.fields.map((field) => this.normalizeField(field)),
      conditions: section.conditions,
    };
  }

  private normalizeField(field: FieldSchema): FieldSchema {
    return {
      ...field,
      colSpan: field.colSpan || 1,
      required: field.required || false,
      disabled: field.disabled || false,
      readOnly: field.readOnly || false,
      hidden: field.hidden || false,
      validation: field.validation || [],
      conditions: field.conditions || [],
    };
  }
}
