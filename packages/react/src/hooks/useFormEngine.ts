import { useSyncExternalStore, useCallback } from 'react';
import type { FormState, SubmitResult, ValidationResult } from '@omarihab/form-engine-core';
import { useFormEngineContext } from '../context';

export interface UseFormEngineReturn {
  values: Record<string, unknown>;
  errors: Record<string, string[]>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
  submit: () => Promise<SubmitResult>;
  validate: () => Promise<ValidationResult>;
  reset: () => void;
  setValue: (fieldId: string, value: unknown) => void;
  setValues: (values: Record<string, unknown>) => void;
  getState: () => FormState;
}

export function useFormEngine(): UseFormEngineReturn {
  const { engine } = useFormEngineContext();
  const stateManager = engine.getStateManager();

  const state = useSyncExternalStore(
    useCallback((cb) => stateManager.subscribe(cb), [stateManager]),
    () => stateManager.getState(),
    () => stateManager.getState(),
  );

  const errors: Record<string, string[]> = {};
  for (const [id, fieldState] of Object.entries(state.fields)) {
    if (fieldState.errors.length > 0) {
      errors[id] = fieldState.errors;
    }
  }

  return {
    values: state.values,
    errors,
    isDirty: state.isDirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    submit: () => engine.submit(),
    validate: () => engine.validate(),
    reset: () => engine.reset(),
    setValue: (fieldId, value) => engine.setValue(fieldId, value),
    setValues: (values) => engine.setValues(values),
    getState: () => engine.getState(),
  };
}
