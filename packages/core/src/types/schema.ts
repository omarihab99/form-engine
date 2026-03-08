export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'file'
  | 'people-picker'
  | 'lookup'
  | 'taxonomy'
  | 'rich-text';

export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  className?: string;
  colSpan?: number;
  options?: FieldOption[];
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxFiles?: number;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  rows?: number;
  lookupListId?: string;
  lookupField?: string;
  taxonomyTermSetId?: string;
  validation?: ValidationRuleConfig[];
  conditions?: ConditionConfig[];
}

export interface ValidationRuleConfig {
  type: string;
  message?: string;
  value?: unknown;
}

export interface ConditionConfig {
  action: 'show' | 'hide' | 'require' | 'disable' | 'enable';
  operator?: 'and' | 'or';
  expressions: ConditionExpressionConfig[];
}

export interface ConditionExpressionConfig {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'empty' | 'notEmpty';
  value?: unknown;
}

export interface SectionSchema {
  id: string;
  title?: string;
  description?: string;
  columns?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  repeatable?: boolean;
  minItems?: number;
  maxItems?: number;
  fields: FieldSchema[];
  conditions?: ConditionConfig[];
}

export interface SubmitConfig {
  type: 'rest' | 'graph' | 'webhook' | 'custom';
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  listId?: string;
  contentType?: string;
}

export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  locale?: string;
  sections: SectionSchema[];
  submit?: SubmitConfig;
  theme?: Record<string, string>;
}
