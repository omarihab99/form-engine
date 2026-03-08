import { useCallback } from 'react';
import type { SubmitResult } from '@omarihab/form-engine-core';
import { useFormEngine } from './useFormEngine';

export interface UseFormSubmitReturn {
  submit: () => Promise<SubmitResult>;
  isSubmitting: boolean;
  submitCount: number;
}

export function useFormSubmit(): UseFormSubmitReturn {
  const { submit, isSubmitting, submitCount } = useFormEngine();

  return {
    submit: useCallback(() => submit(), [submit]),
    isSubmitting,
    submitCount,
  };
}
