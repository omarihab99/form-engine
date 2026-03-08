import React, { useRef, useMemo } from 'react';
import { FormEngine } from '@omarihab/form-engine-core';
import type { FormEngineOptions } from '@omarihab/form-engine-core';
import { FormEngineContext } from '../context';

export interface FormProviderProps extends FormEngineOptions {
  children: React.ReactNode;
  engine?: FormEngine;
}

export function FormProvider({ children, engine: externalEngine, ...options }: FormProviderProps) {
  const engineRef = useRef<FormEngine | null>(externalEngine || null);

  if (!engineRef.current) {
    engineRef.current = new FormEngine(options);
  }

  const contextValue = useMemo(
    () => ({ engine: engineRef.current! }),
    [engineRef.current],
  );

  return (
    <FormEngineContext.Provider value={contextValue}>
      {children}
    </FormEngineContext.Provider>
  );
}
