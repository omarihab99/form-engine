import React from 'react';
import { useField } from '../hooks/useField';

export interface ToggleFieldProps {
  fieldId: string;
  label: string;
}

export function ToggleField({ fieldId, label }: ToggleFieldProps) {
  const { value, isDisabled, onChange, onBlur } = useField(fieldId);
  const isOn = value === true;

  return (
    <label className="fe-flex fe-items-center fe-gap-3 fe-cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        id={`fe-field-${fieldId}`}
        disabled={isDisabled}
        className={`fe-relative fe-inline-flex fe-h-6 fe-w-11 fe-flex-shrink-0 fe-rounded-full fe-border-2 fe-border-transparent fe-transition-colors fe-cursor-pointer ${
          isOn ? 'fe-bg-primary-600' : 'fe-bg-gray-200'
        } ${isDisabled ? 'fe-opacity-50 fe-cursor-not-allowed' : ''}`}
        onClick={() => {
          onChange(!isOn);
          onBlur();
        }}
      >
        <span
          className={`fe-pointer-events-none fe-inline-block fe-h-5 fe-w-5 fe-rounded-full fe-bg-white fe-shadow fe-ring-0 fe-transition-transform ${
            isOn ? 'fe-translate-x-5' : 'fe-translate-x-0'
          }`}
        />
      </button>
      <span className="fe-text-sm">{label}</span>
    </label>
  );
}
