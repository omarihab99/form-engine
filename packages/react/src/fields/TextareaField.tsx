import React from 'react';
import { useField } from '../hooks/useField';

const INPUT_CLASSES =
  'fe-w-full fe-px-3 fe-py-2 fe-border fe-border-gray-300 fe-rounded-md fe-text-sm ' +
  'fe-bg-white fe-transition-colors fe-outline-none fe-resize-y ' +
  'focus:fe-border-primary-500 focus:fe-ring-1 focus:fe-ring-primary-500 ' +
  'disabled:fe-bg-gray-100 disabled:fe-cursor-not-allowed';

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
      className={`${INPUT_CLASSES} ${errors.length > 0 ? 'fe-border-error-500' : ''}`}
      aria-invalid={errors.length > 0}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}
