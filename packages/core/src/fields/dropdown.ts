import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const dropdownRenderer: FieldRenderer = (ctx) => {
  const select = createElement('select', {
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: getInputClasses(ctx),
    'aria-describedby': `fe-error-${ctx.field.id}`,
    'aria-invalid': ctx.errors.length > 0 ? 'true' : 'false',
  });

  if (ctx.disabled) select.setAttribute('disabled', '');

  // placeholder option
  const placeholder = createElement('option', { value: '' }, [
    ctx.field.placeholder || ctx.i18n.t('field.select'),
  ]);
  placeholder.disabled = true;
  select.appendChild(placeholder);

  for (const opt of ctx.field.options || []) {
    const option = createElement('option', { value: String(opt.value) }, [opt.label]);
    if (opt.disabled) option.disabled = true;
    if (String(opt.value) === String(ctx.value)) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', () => ctx.onChange(select.value));
  select.addEventListener('blur', () => ctx.onBlur());

  return select;
};
