import React from 'react';
import { useField } from '../hooks/useField';
import { INPUT_CLASSES } from './fieldStyles';

export interface PeoplePickerFieldProps {
  fieldId: string;
  placeholder?: string;
}

export function PeoplePickerField({ fieldId, placeholder }: PeoplePickerFieldProps) {
  const { value, isDisabled, onChange, onBlur } = useField(fieldId);
  const people = Array.isArray(value) ? (value as Record<string, string>[]) : [];

  const removePerson = (index: number) => {
    const updated = people.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : null);
  };

  return (
    <div className="fe-relative">
      <input
        type="text"
        id={`fe-field-${fieldId}`}
        placeholder={placeholder || 'Search for people...'}
        disabled={isDisabled}
        className={INPUT_CLASSES}
        autoComplete="off"
        onBlur={onBlur}
      />
      {people.length > 0 && (
        <div className="fe-flex fe-flex-wrap fe-gap-1 fe-mt-1">
          {people.map((person, i) => (
            <span
              key={i}
              className="fe-inline-flex fe-items-center fe-gap-1 fe-px-2 fe-py-0.5 fe-bg-gray-100 fe-text-gray-800 fe-text-xs fe-rounded-sm"
            >
              {person.displayName || person.name || 'User'}
              <button
                type="button"
                className="fe-text-gray-600 hover:fe-text-gray-800 fe-font-bold"
                onClick={() => removePerson(i)}
                aria-label="Remove"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
