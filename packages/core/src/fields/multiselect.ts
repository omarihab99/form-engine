import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const multiselectRenderer: FieldRenderer = (ctx) => {
  const container = createElement('div', { class: 'fe-space-y-1' });
  const currentValues = Array.isArray(ctx.value) ? (ctx.value as (string | number)[]) : [];

  for (const opt of ctx.field.options || []) {
    const label = createElement('label', {
      class: 'fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm',
    });

    const checkbox = createElement('input', {
      type: 'checkbox',
      name: ctx.field.id,
      value: String(opt.value),
      class: 'fe-rounded fe-border-gray-300 fe-text-primary-600 focus:fe-ring-primary-500',
    });

    if (currentValues.includes(opt.value)) {
      checkbox.checked = true;
    }
    if (ctx.disabled || opt.disabled) checkbox.disabled = true;

    checkbox.addEventListener('change', () => {
      const checked = container.querySelectorAll<HTMLInputElement>('input:checked');
      const values = Array.from(checked).map((c) => c.value);
      ctx.onChange(values);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(opt.label));
    container.appendChild(label);
  }

  return container;
};
