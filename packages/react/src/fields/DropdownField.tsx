import React from 'react';
import { useField } from '../hooks/useField';
import { INPUT_CLASSES, ERROR_CLASSES } from './fieldStyles';

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
      className={`${INPUT_CLASSES} ${errors.length > 0 ? ERROR_CLASSES : ''}`}
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
