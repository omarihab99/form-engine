import { createContext, useContext } from 'react';
import type { FormEngine } from '@omarihab/form-engine-core';

export interface FormEngineContextValue {
  engine: FormEngine;
}

export const FormEngineContext = createContext<FormEngineContextValue | null>(null);

export function useFormEngineContext(): FormEngineContextValue {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error('useFormEngineContext must be used within a FormProvider');
  }
  return ctx;
}
