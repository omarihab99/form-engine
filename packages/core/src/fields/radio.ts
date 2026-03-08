import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement } from './helpers';

export const radioRenderer: FieldRenderer = (ctx) => {
  const container = createElement('div', {
    class: 'fe-space-y-1',
    role: 'radiogroup',
    'aria-labelledby': `fe-label-${ctx.field.id}`,
  });

  for (const opt of ctx.field.options || []) {
    const label = createElement('label', {
      class: 'fe-flex fe-items-center fe-gap-2 fe-cursor-pointer fe-text-sm',
    });

    const radio = createElement('input', {
      type: 'radio',
      name: ctx.field.id,
      value: String(opt.value),
      class: 'fe-border-gray-300 fe-text-primary-600 focus:fe-ring-primary-500',
    });

    if (String(opt.value) === String(ctx.value)) radio.checked = true;
    if (ctx.disabled || opt.disabled) radio.disabled = true;

    radio.addEventListener('change', () => {
      ctx.onChange(opt.value);
      ctx.onBlur();
    });

    label.appendChild(radio);
    label.appendChild(document.createTextNode(opt.label));
    container.appendChild(label);
  }

  return container;
};
