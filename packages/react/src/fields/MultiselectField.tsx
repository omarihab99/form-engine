import React from 'react';
import { useField } from '../hooks/useField';

export interface MultiselectFieldProps {
  fieldId: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
}

export function MultiselectField({ fieldId, options }: MultiselectFieldProps) {
  const { value, isDisabled, onChange } = useField(fieldId);
  const currentValues = Array.isArray(value) ? (value as (string | number)[]) : [];

  const handleChange = (optValue: string | number, checked: boolean) => {
    const newValues = checked
      ? [...currentValues, optValue]
      : currentValues.filter((v) => v !== optValue);
    onChange(newValues);
  };

  return (
    <div className="fe-space-y-1">
      {options.map((opt) => (
        <label
          key={String(opt.value)}
          className="fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm"
        >
          <input
            type="checkbox"
            value={String(opt.value)}
            checked={currentValues.includes(opt.value)}
            disabled={isDisabled || opt.disabled}
            className="fe-rounded-sm fe-border-gray-300 fe-text-primary-600 focus:fe-ring-0"
            onChange={(e) => handleChange(opt.value, e.target.checked)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
