import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const peoplePickerRenderer: FieldRenderer = (ctx) => {
  const wrapper = createElement('div', { class: 'fe-relative' });

  const input = createElement('input', {
    type: 'text',
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: getInputClasses(ctx),
    placeholder: ctx.field.placeholder || ctx.i18n.t('field.peoplePicker'),
    'aria-describedby': `fe-error-${ctx.field.id}`,
    autocomplete: 'off',
  });

  if (ctx.disabled) input.setAttribute('disabled', '');

  // Selected people display
  const selectedContainer = createElement('div', {
    class: 'fe-flex fe-flex-wrap fe-gap-1 fe-mt-1',
  });

  const currentValue = Array.isArray(ctx.value) ? ctx.value : ctx.value ? [ctx.value] : [];
  for (const person of currentValue) {
    const tag = createPersonTag(person as Record<string, string>, () => {
      const updated = currentValue.filter((p) => p !== person);
      ctx.onChange(updated.length > 0 ? updated : null);
    });
    selectedContainer.appendChild(tag);
  }

  // Results dropdown (populated by adapter)
  const dropdown = createElement('div', {
    class: 'fe-absolute fe-z-10 fe-w-full fe-mt-1 fe-bg-white fe-border fe-border-gray-300 fe-rounded-md fe-shadow-lg fe-hidden fe-max-h-48 fe-overflow-y-auto',
    role: 'listbox',
  });

  input.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.add('fe-hidden'), 200);
    ctx.onBlur();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(dropdown);
  wrapper.appendChild(selectedContainer);

  return wrapper;
};

function createPersonTag(
  person: Record<string, string>,
  onRemove: () => void,
): HTMLElement {
  const tag = createElement('span', {
    class: 'fe-inline-flex fe-items-center fe-gap-1 fe-px-2 fe-py-0.5 fe-bg-primary-100 fe-text-primary-800 fe-text-xs fe-rounded-full',
  });

  tag.appendChild(document.createTextNode(person.displayName || person.name || 'User'));

  const removeBtn = createElement('button', {
    type: 'button',
    class: 'fe-text-primary-600 hover:fe-text-primary-800 fe-font-bold',
    'aria-label': 'Remove',
  }, ['×']);

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onRemove();
  });

  tag.appendChild(removeBtn);
  return tag;
}
