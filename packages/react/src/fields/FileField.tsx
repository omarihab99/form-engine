import React, { useRef, useState } from 'react';
import { useField } from '../hooks/useField';

export interface FileFieldProps {
  fieldId: string;
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function FileField({ fieldId, accept, multiple, maxFileSize }: FileFieldProps) {
  const { isDisabled, onChange } = useField(fieldId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    onChange(selected);
  };

  return (
    <div
      className="fe-border fe-border-dashed fe-border-gray-300 fe-rounded-sm fe-p-4 fe-text-center fe-cursor-pointer hover:fe-border-gray-400 fe-transition-colors"
      onClick={() => !isDisabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        id={`fe-field-${fieldId}`}
        accept={accept}
        multiple={multiple}
        disabled={isDisabled}
        className="fe-hidden"
        onChange={handleChange}
      />
      <p className="fe-text-sm fe-text-gray-500">Click to upload or drag and drop</p>
      {maxFileSize && (
        <p className="fe-text-xs fe-text-gray-400 fe-mt-1">
          Max file size: {formatSize(maxFileSize)}
        </p>
      )}
      {files.length > 0 && (
        <div className="fe-mt-2 fe-space-y-1">
          {files.map((f, i) => (
            <div key={i} className="fe-text-xs fe-text-gray-600">
              {f.name} ({formatSize(f.size)})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
