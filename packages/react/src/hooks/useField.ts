import { useSyncExternalStore, useCallback } from 'react';
import type { FieldState } from '@omarihab/form-engine-core';
import { useFormEngineContext } from '../context';

export interface UseFieldReturn {
  value: unknown;
  errors: string[];
  isDirty: boolean;
  isTouched: boolean;
  isVisible: boolean;
  isDisabled: boolean;
  isRequired: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

const DEFAULT_FIELD_STATE: FieldState = {
  value: '',
  errors: [],
  isDirty: false,
  isTouched: false,
  isVisible: true,
  isDisabled: false,
  isRequired: false,
};

export function useField(fieldId: string): UseFieldReturn {
  const { engine } = useFormEngineContext();
  const stateManager = engine.getStateManager();

  const fieldState = useSyncExternalStore(
    useCallback((cb) => stateManager.subscribe(cb), [stateManager]),
    () => stateManager.getFieldState(fieldId) || DEFAULT_FIELD_STATE,
    () => stateManager.getFieldState(fieldId) || DEFAULT_FIELD_STATE,
  );

  return {
    value: fieldState.value,
    errors: fieldState.errors,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
    isVisible: fieldState.isVisible,
    isDisabled: fieldState.isDisabled,
    isRequired: fieldState.isRequired,
    onChange: (value: unknown) => {
      engine.setValue(fieldId, value);
    },
    onBlur: () => {
      stateManager.setFieldTouched(fieldId, true);
      engine.validateField(fieldId);
    },
  };
}
