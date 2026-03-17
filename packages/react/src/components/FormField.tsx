import React from 'react';
import { useField } from '../hooks/useField';

export interface FormFieldProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  children: (fieldProps: ReturnType<typeof useField>) => React.ReactNode;
}

export function FormField({
  fieldId,
  label,
  required,
  helpText,
  className,
  children,
}: FormFieldProps) {
  const field = useField(fieldId);

  if (!field.isVisible) return null;

  return (
    <div className={`fe-field-wrapper fe-mb-6 ${className || ''}`.trim()}>
      {label && (
        <label
          htmlFor={`fe-field-${fieldId}`}
          className="fe-block fe-text-sm fe-font-normal fe-text-gray-900 fe-mb-1"
        >
          {label}
          {(required || field.isRequired) && (
            <span className="fe-text-error-500 fe-ml-0.5" aria-hidden="true"> *</span>
          )}
        </label>
      )}

      {children(field)}

      {helpText && (
        <p className="fe-text-xs fe-text-gray-500 fe-mt-1">{helpText}</p>
      )}

      {field.isTouched && field.errors.length > 0 && (
        <div
          id={`fe-error-${fieldId}`}
          className="fe-text-xs fe-text-error-600 fe-mt-1"
          role="alert"
          aria-live="polite"
        >
          {field.errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
