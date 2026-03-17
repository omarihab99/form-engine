import React, { useState } from 'react';

export interface FormSectionProps {
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: number;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  collapsible,
  defaultCollapsed = false,
  columns = 1,
  children,
}: FormSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <fieldset className="fe-border-0 fe-p-0 fe-m-0">
      {title && (
        <legend
          className={`fe-text-lg fe-font-semibold fe-text-gray-900 fe-mb-2 ${
            collapsible ? 'fe-cursor-pointer fe-select-none' : ''
          }`}
          onClick={collapsible ? () => setCollapsed(!collapsed) : undefined}
        >
          {title}
          {collapsible && (
            <span className="fe-ml-2 fe-text-sm fe-text-gray-400">
              {collapsed ? '▸' : '▾'}
            </span>
          )}
        </legend>
      )}

      {description && (
        <p className="fe-text-sm fe-text-gray-600 fe-mb-4">{description}</p>
      )}

      {!collapsed && (
        <div
          className="fe-grid fe-gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {children}
        </div>
      )}
    </fieldset>
  );
}
