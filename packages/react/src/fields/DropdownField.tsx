import React from 'react';
import { useField } from '../hooks/useField';

const SELECT_CLASSES =
  'fe-w-full fe-px-3 fe-py-2 fe-border fe-border-gray-300 fe-rounded-md fe-text-sm ' +
  'fe-bg-white fe-transition-colors fe-outline-none ' +
  'focus:fe-border-primary-500 focus:fe-ring-1 focus:fe-ring-primary-500 ' +
  'disabled:fe-bg-gray-100 disabled:fe-cursor-not-allowed';

export interface DropdownFieldProps {
  fieldId: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
  placeholder?: string;
}

export function DropdownField({ fieldId, options, placeholder }: DropdownFieldProps) {
  const { value, errors, isDisabled, onChange, onBlur } = useField(fieldId);

  return (
    <select
      id={`fe-field-${fieldId}`}
      name={fieldId}
      value={value != null ? String(value) : ''}
      disabled={isDisabled}
      className={`${SELECT_CLASSES} ${errors.length > 0 ? 'fe-border-error-500' : ''}`}
      aria-invalid={errors.length > 0}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      <option value="" disabled>
        {placeholder || 'Select an option'}
      </option>
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
