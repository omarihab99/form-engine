import React from 'react';
import { useField } from '../hooks/useField';

const INPUT_CLASSES =
  'fe-w-full fe-px-3 fe-py-2 fe-border fe-border-gray-300 fe-rounded-md fe-text-sm ' +
  'fe-bg-white fe-transition-colors fe-outline-none ' +
  'focus:fe-border-primary-500 focus:fe-ring-1 focus:fe-ring-primary-500 ' +
  'disabled:fe-bg-gray-100 disabled:fe-cursor-not-allowed';

const ERROR_CLASSES = 'fe-border-error-500 focus:fe-border-error-500 focus:fe-ring-error-500';

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
