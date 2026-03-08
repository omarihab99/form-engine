import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement } from './helpers';

export const checkboxRenderer: FieldRenderer = (ctx) => {
  const label = createElement('label', {
    class: 'fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm',
  });

  const checkbox = createElement('input', {
    type: 'checkbox',
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: 'fe-rounded fe-border-gray-300 fe-text-primary-600 focus:fe-ring-primary-500',
  });

  if (ctx.value === true) checkbox.checked = true;
  if (ctx.disabled) checkbox.disabled = true;

  checkbox.addEventListener('change', () => {
    ctx.onChange(checkbox.checked);
    ctx.onBlur();
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(ctx.field.label));

  return label;
};
