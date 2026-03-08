export interface FieldState {
  value: unknown;
  errors: string[];
  isDirty: boolean;
  isTouched: boolean;
  isVisible: boolean;
  isDisabled: boolean;
  isRequired: boolean;
}

export interface FormState {
  values: Record<string, unknown>;
  fields: Record<string, FieldState>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export interface StateManagerInterface {
  getState(): FormState;
  getValue(fieldId: string): unknown;
  getFieldState(fieldId: string): FieldState | undefined;
  setValue(fieldId: string, value: unknown): void;
  setValues(values: Record<string, unknown>): void;
  setFieldErrors(fieldId: string, errors: string[]): void;
  setFieldTouched(fieldId: string, touched: boolean): void;
  setFieldVisibility(fieldId: string, visible: boolean): void;
  setFieldDisabled(fieldId: string, disabled: boolean): void;
  setFieldRequired(fieldId: string, required: boolean): void;
  setSubmitting(submitting: boolean): void;
  incrementSubmitCount(): void;
  reset(defaultValues?: Record<string, unknown>): void;
  subscribe(listener: () => void): () => void;
}
