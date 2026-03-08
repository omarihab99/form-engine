import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const textareaRenderer: FieldRenderer = (ctx) => {
  const textarea = createElement('textarea', {
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: `${getInputClasses(ctx)} fe-resize-y`,
    rows: String(ctx.field.rows || 3),
    'aria-describedby': `fe-error-${ctx.field.id}`,
    'aria-invalid': ctx.errors.length > 0 ? 'true' : 'false',
  });

  if (ctx.field.placeholder) textarea.setAttribute('placeholder', ctx.field.placeholder);
  if (ctx.disabled) textarea.setAttribute('disabled', '');
  if (ctx.field.readOnly) textarea.setAttribute('readonly', '');
  if (ctx.field.minLength) textarea.setAttribute('minlength', String(ctx.field.minLength));
  if (ctx.field.maxLength) textarea.setAttribute('maxlength', String(ctx.field.maxLength));

  textarea.value = ctx.value != null ? String(ctx.value) : '';

  textarea.addEventListener('input', () => ctx.onChange(textarea.value));
  textarea.addEventListener('blur', () => ctx.onBlur());

  return textarea;
};
