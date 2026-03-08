import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement } from './helpers';

export const toggleRenderer: FieldRenderer = (ctx) => {
  const wrapper = createElement('label', {
    class: 'fe-flex fe-items-center fe-gap-3 fe-cursor-pointer',
  });

  const button = createElement('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': ctx.value === true ? 'true' : 'false',
    id: `fe-field-${ctx.field.id}`,
    class: `fe-relative fe-inline-flex fe-h-6 fe-w-11 fe-flex-shrink-0 fe-rounded-full fe-border-2 fe-border-transparent fe-transition-colors fe-cursor-pointer ${
      ctx.value === true ? 'fe-bg-primary-600' : 'fe-bg-gray-200'
    }`,
  });

  if (ctx.disabled) {
    button.setAttribute('disabled', '');
    button.classList.add('fe-opacity-50', 'fe-cursor-not-allowed');
  }

  const knob = createElement('span', {
    class: `fe-pointer-events-none fe-inline-block fe-h-5 fe-w-5 fe-rounded-full fe-bg-white fe-shadow fe-ring-0 fe-transition-transform ${
      ctx.value === true ? 'fe-translate-x-5 rtl:-fe-translate-x-5' : 'fe-translate-x-0'
    }`,
  });

  button.appendChild(knob);
  wrapper.appendChild(button);
  wrapper.appendChild(document.createTextNode(ctx.field.label));

  button.addEventListener('click', () => {
    if (ctx.disabled) return;
    ctx.onChange(!(ctx.value === true));
    ctx.onBlur();
  });

  return wrapper;
};
