import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement, getInputClasses } from './helpers';

export const textRenderer: FieldRenderer = (ctx) => {
  const input = createElement('input', {
    type: ctx.field.type === 'number' ? 'number' : ctx.field.type === 'date' ? 'date' : 'text',
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: getInputClasses(ctx),
    'aria-describedby': `fe-error-${ctx.field.id}`,
    'aria-invalid': ctx.errors.length > 0 ? 'true' : 'false',
  });

  if (ctx.field.placeholder) input.setAttribute('placeholder', ctx.field.placeholder);
  if (ctx.disabled || ctx.field.readOnly) input.setAttribute('disabled', '');
  if (ctx.field.readOnly) input.setAttribute('readonly', '');
  if (ctx.field.minLength) input.setAttribute('minlength', String(ctx.field.minLength));
  if (ctx.field.maxLength) input.setAttribute('maxlength', String(ctx.field.maxLength));
  if (ctx.field.type === 'number') {
    if (ctx.field.min !== undefined) input.setAttribute('min', String(ctx.field.min));
    if (ctx.field.max !== undefined) input.setAttribute('max', String(ctx.field.max));
    if (ctx.field.step !== undefined) input.setAttribute('step', String(ctx.field.step));
  }

  input.value = ctx.value != null ? String(ctx.value) : '';

  input.addEventListener('input', () => {
    const val = ctx.field.type === 'number' ? (input.value ? Number(input.value) : '') : input.value;
    ctx.onChange(val);
  });
  input.addEventListener('blur', () => ctx.onBlur());

  return input;
};
