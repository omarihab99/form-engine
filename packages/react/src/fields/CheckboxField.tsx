import React from 'react';
import { useField } from '../hooks/useField';

export interface CheckboxFieldProps {
  fieldId: string;
  label: string;
}

export function CheckboxField({ fieldId, label }: CheckboxFieldProps) {
  const { value, isDisabled, onChange, onBlur } = useField(fieldId);

  return (
    <label className="fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm">
      <input
        type="checkbox"
        id={`fe-field-${fieldId}`}
        name={fieldId}
        checked={value === true}
        disabled={isDisabled}
        className="fe-rounded fe-border-gray-300 fe-text-primary-600 focus:fe-ring-primary-500"
        onChange={(e) => {
          onChange(e.target.checked);
          onBlur();
        }}
      />
      {label}
    </label>
  );
}
