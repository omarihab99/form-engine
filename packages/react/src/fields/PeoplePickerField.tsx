import React from 'react';
import { useField } from '../hooks/useField';

const INPUT_CLASSES =
  'fe-w-full fe-px-3 fe-py-2 fe-border fe-border-gray-300 fe-rounded-md fe-text-sm ' +
  'fe-bg-white fe-outline-none focus:fe-border-primary-500 focus:fe-ring-1 focus:fe-ring-primary-500';

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
              className="fe-inline-flex fe-items-center fe-gap-1 fe-px-2 fe-py-0.5 fe-bg-primary-100 fe-text-primary-800 fe-text-xs fe-rounded-full"
            >
              {person.displayName || person.name || 'User'}
              <button
                type="button"
                className="fe-text-primary-600 hover:fe-text-primary-800 fe-font-bold"
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
