import React from 'react';
import { useField } from '../hooks/useField';
import { INPUT_CLASSES, ERROR_CLASSES } from './fieldStyles';

export interface TextareaFieldProps {
  fieldId: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({ fieldId, placeholder, rows = 3 }: TextareaFieldProps) {
  const { value, errors, isDisabled, onChange, onBlur } = useField(fieldId);

  return (
    <textarea
      id={`fe-field-${fieldId}`}
      name={fieldId}
      value={value != null ? String(value) : ''}
      placeholder={placeholder}
      disabled={isDisabled}
      rows={rows}
      className={`${INPUT_CLASSES} fe-resize-y ${errors.length > 0 ? ERROR_CLASSES : ''}`}
      aria-invalid={errors.length > 0}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}
