import React from 'react';
import { useField } from '../hooks/useField';
import { INPUT_CLASSES, ERROR_CLASSES } from './fieldStyles';

export interface TextFieldProps {
  fieldId: string;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
}

export function TextField({
  fieldId,
  type = 'text',
  placeholder,
  min,
  max,
  step,
  minLength,
  maxLength,
}: TextFieldProps) {
  const { value, errors, isDisabled, onChange, onBlur } = useField(fieldId);
  const hasErrors = errors.length > 0;

  return (
    <input
      id={`fe-field-${fieldId}`}
      name={fieldId}
      type={type}
      value={value != null ? String(value) : ''}
      placeholder={placeholder}
      disabled={isDisabled}
      min={min}
      max={max}
      step={step}
      minLength={minLength}
      maxLength={maxLength}
      className={`${INPUT_CLASSES} ${hasErrors ? ERROR_CLASSES : ''}`}
      aria-invalid={hasErrors}
      aria-describedby={`fe-error-${fieldId}`}
      onChange={(e) => {
        const val = type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;
        onChange(val);
      }}
      onBlur={onBlur}
    />
  );
}
