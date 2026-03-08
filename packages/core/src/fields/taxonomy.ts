import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const taxonomyRenderer: FieldRenderer = (ctx) => {
  const select = createElement('select', {
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: getInputClasses(ctx),
    'aria-describedby': `fe-error-${ctx.field.id}`,
  });

  if (ctx.disabled) select.setAttribute('disabled', '');

  const placeholder = createElement('option', { value: '' }, [
    ctx.field.placeholder || ctx.i18n.t('field.taxonomy'),
  ]);
  placeholder.disabled = true;
  select.appendChild(placeholder);

  // Options populated by adapter
  for (const opt of ctx.field.options || []) {
    const option = createElement('option', { value: String(opt.value) }, [opt.label]);
    if (String(opt.value) === String(ctx.value)) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', () => ctx.onChange(select.value));
  select.addEventListener('blur', () => ctx.onBlur());

  return select;
};
