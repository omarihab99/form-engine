import React, { useRef, useCallback } from 'react';
import { useField } from '../hooks/useField';

export interface RichTextFieldProps {
  fieldId: string;
}

export function RichTextField({ fieldId }: RichTextFieldProps) {
  const { value, isDisabled, onChange, onBlur } = useField(fieldId);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((cmd: string) => {
    document.execCommand(cmd);
    editorRef.current?.focus();
  }, []);

  const buttons = [
    { cmd: 'bold', label: 'B' },
    { cmd: 'italic', label: 'I' },
    { cmd: 'underline', label: 'U' },
    { cmd: 'insertUnorderedList', label: '\u2022' },
    { cmd: 'insertOrderedList', label: '1.' },
  ];

  return (
    <div className="fe-border fe-border-gray-300 fe-rounded-sm fe-overflow-hidden">
      <div className="fe-flex fe-gap-1 fe-p-1 fe-bg-gray-50 fe-border-b fe-border-gray-300">
        {buttons.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            className="fe-px-2 fe-py-1 fe-text-xs fe-font-medium hover:fe-bg-gray-200 fe-transition-colors"
            title={btn.cmd}
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand(btn.cmd);
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable={!isDisabled}
        id={`fe-field-${fieldId}`}
        className="fe-min-h-[100px] fe-p-3 fe-text-sm fe-outline-none"
        role="textbox"
        aria-multiline="true"
        dangerouslySetInnerHTML={{ __html: value != null ? String(value) : '' }}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        onBlur={onBlur}
      />
    </div>
  );
}
