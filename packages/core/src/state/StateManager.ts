import type { FieldState, FormState, StateManagerInterface } from '../types';

function createDefaultFieldState(value: unknown = '', required = false): FieldState {
  return {
    value,
    errors: [],
    isDirty: false,
    isTouched: false,
    isVisible: true,
    isDisabled: false,
    isRequired: required,
  };
}

export class StateManager implements StateManagerInterface {
  private state: FormState;
  private subscribers = new Set<() => void>();

  constructor(defaultValues: Record<string, unknown> = {}) {
    const fields: Record<string, FieldState> = {};
    for (const [id, value] of Object.entries(defaultValues)) {
      fields[id] = createDefaultFieldState(value);
    }

    this.state = {
      values: { ...defaultValues },
      fields,
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
    };
  }

  getState(): FormState {
    return this.state;
  }

  getValue(fieldId: string): unknown {
    return this.state.values[fieldId];
  }

  getFieldState(fieldId: string): FieldState | undefined {
    return this.state.fields[fieldId];
  }

  setValue(fieldId: string, value: unknown): void {
    const prevValue = this.state.values[fieldId];
    if (prevValue === value) return;

    this.state = {
      ...this.state,
      values: { ...this.state.values, [fieldId]: value },
      fields: {
        ...this.state.fields,
        [fieldId]: {
          ...(this.state.fields[fieldId] || createDefaultFieldState(value)),
          value,
          isDirty: true,
        },
      },
      isDirty: true,
    };
    this.notify();
  }

  setValues(values: Record<string, unknown>): void {
    const newValues = { ...this.state.values, ...values };
    const newFields = { ...this.state.fields };

    for (const [id, value] of Object.entries(values)) {
      newFields[id] = {
        ...(newFields[id] || createDefaultFieldState(value)),
        value,
        isDirty: true,
      };
    }

    this.state = {
      ...this.state,
      values: newValues,
      fields: newFields,
      isDirty: true,
    };
    this.notify();
  }

  setFieldErrors(fieldId: string, errors: string[]): void {
    this.ensureField(fieldId);
    const newFields = {
      ...this.state.fields,
      [fieldId]: { ...this.state.fields[fieldId], errors },
    };
    const isValid = Object.values(newFields).every((f) => f.errors.length === 0);
    this.state = { ...this.state, fields: newFields, isValid };
    this.notify();
  }

  setFieldTouched(fieldId: string, touched: boolean): void {
    this.ensureField(fieldId);
    this.state = {
      ...this.state,
      fields: {
        ...this.state.fields,
        [fieldId]: { ...this.state.fields[fieldId], isTouched: touched },
      },
    };
    this.notify();
  }

  setFieldVisibility(fieldId: string, visible: boolean): void {
    this.ensureField(fieldId);
    this.state = {
      ...this.state,
      fields: {
        ...this.state.fields,
        [fieldId]: { ...this.state.fields[fieldId], isVisible: visible },
      },
    };
    this.notify();
  }

  setFieldDisabled(fieldId: string, disabled: boolean): void {
    this.ensureField(fieldId);
    this.state = {
      ...this.state,
      fields: {
        ...this.state.fields,
        [fieldId]: { ...this.state.fields[fieldId], isDisabled: disabled },
      },
    };
    this.notify();
  }

  setFieldRequired(fieldId: string, required: boolean): void {
    this.ensureField(fieldId);
    this.state = {
      ...this.state,
      fields: {
        ...this.state.fields,
        [fieldId]: { ...this.state.fields[fieldId], isRequired: required },
      },
    };
    this.notify();
  }

  setSubmitting(submitting: boolean): void {
    this.state = { ...this.state, isSubmitting: submitting };
    this.notify();
  }

  incrementSubmitCount(): void {
    this.state = { ...this.state, submitCount: this.state.submitCount + 1 };
    this.notify();
  }

  reset(defaultValues?: Record<string, unknown>): void {
    const values = defaultValues || {};
    const fields: Record<string, FieldState> = {};
    for (const [id, value] of Object.entries(values)) {
      fields[id] = createDefaultFieldState(value);
    }
    // Preserve field state keys that exist but aren't in defaults
    for (const id of Object.keys(this.state.fields)) {
      if (!fields[id]) {
        fields[id] = createDefaultFieldState();
      }
    }
    this.state = {
      values,
      fields,
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
    };
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  initializeField(fieldId: string, value: unknown, required: boolean): void {
    if (!this.state.fields[fieldId]) {
      this.state = {
        ...this.state,
        values: { ...this.state.values, [fieldId]: value },
        fields: {
          ...this.state.fields,
          [fieldId]: createDefaultFieldState(value, required),
        },
      };
    }
  }

  private ensureField(fieldId: string): void {
    if (!this.state.fields[fieldId]) {
      this.state = {
        ...this.state,
        fields: {
          ...this.state.fields,
          [fieldId]: createDefaultFieldState(this.state.values[fieldId]),
        },
      };
    }
  }

  private notify(): void {
    for (const listener of this.subscribers) {
      listener();
    }
  }
}
