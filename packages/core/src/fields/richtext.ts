import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement } from './helpers';

export const richTextRenderer: FieldRenderer = (ctx) => {
  const wrapper = createElement('div', { class: 'fe-border fe-border-gray-300 fe-rounded-md fe-overflow-hidden' });

  // Toolbar
  const toolbar = createElement('div', {
    class: 'fe-flex fe-gap-1 fe-p-1 fe-bg-gray-50 fe-border-b fe-border-gray-300',
  });

  const buttons: { cmd: string; label: string }[] = [
    { cmd: 'bold', label: 'B' },
    { cmd: 'italic', label: 'I' },
    { cmd: 'underline', label: 'U' },
    { cmd: 'insertUnorderedList', label: '•' },
    { cmd: 'insertOrderedList', label: '1.' },
  ];

  for (const btn of buttons) {
    const button = createElement('button', {
      type: 'button',
      class: 'fe-px-2 fe-py-1 fe-text-xs fe-font-medium fe-rounded hover:fe-bg-gray-200 fe-transition-colors',
      title: btn.cmd,
    }, [btn.label]);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      document.execCommand(btn.cmd);
      editor.focus();
    });

    toolbar.appendChild(button);
  }

  wrapper.appendChild(toolbar);

  // Editor
  const editor = createElement('div', {
    contenteditable: ctx.disabled ? 'false' : 'true',
    id: `fe-field-${ctx.field.id}`,
    class: 'fe-min-h-[100px] fe-p-3 fe-text-sm fe-outline-none',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-labelledby': `fe-label-${ctx.field.id}`,
  });

  editor.innerHTML = ctx.value != null ? String(ctx.value) : '';

  editor.addEventListener('input', () => ctx.onChange(editor.innerHTML));
  editor.addEventListener('blur', () => ctx.onBlur());

  wrapper.appendChild(editor);

  return wrapper;
};
