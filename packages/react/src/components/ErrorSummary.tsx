import React from 'react';
import { useFormEngine } from '../hooks/useFormEngine';

export interface ErrorSummaryProps {
  className?: string;
}

export function ErrorSummary({ className }: ErrorSummaryProps) {
  const { errors } = useFormEngine();

  const allErrors = Object.entries(errors).flatMap(([fieldId, messages]) =>
    messages.map((msg) => ({ fieldId, message: msg })),
  );

  if (allErrors.length === 0) return null;

  return (
    <div
      className={
        className ||
        'fe-bg-error-50 fe-border fe-border-error-500 fe-rounded-sm fe-p-4'
      }
      role="alert"
    >
      <h3 className="fe-text-sm fe-font-medium fe-text-error-700 fe-mb-2">
        Please fix the following errors:
      </h3>
      <ul className="fe-list-disc fe-list-inside fe-space-y-1">
        {allErrors.map((err, i) => (
          <li key={i} className="fe-text-sm fe-text-error-600">
            <a
              href={`#fe-field-${err.fieldId}`}
              className="fe-underline hover:fe-no-underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`fe-field-${err.fieldId}`)?.focus();
              }}
            >
              {err.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
