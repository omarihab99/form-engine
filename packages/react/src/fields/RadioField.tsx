import React from 'react';
import { useField } from '../hooks/useField';

export interface RadioFieldProps {
  fieldId: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
}

export function RadioField({ fieldId, options }: RadioFieldProps) {
  const { value, isDisabled, onChange, onBlur } = useField(fieldId);

  return (
    <div className="fe-space-y-2" role="radiogroup" aria-labelledby={`fe-label-${fieldId}`}>
      {options.map((opt) => (
        <label
          key={String(opt.value)}
          className="fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm"
        >
          <input
            type="radio"
            name={fieldId}
            value={String(opt.value)}
            checked={String(opt.value) === String(value)}
            disabled={isDisabled || opt.disabled}
            className="fe-border-gray-300 fe-text-primary-600 focus:fe-ring-0"
            onChange={() => {
              onChange(opt.value);
              onBlur();
            }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
