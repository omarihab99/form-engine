import type { FieldRenderer } from '../rendering/FieldRegistry';
import { createElement } from './helpers';

export const fileRenderer: FieldRenderer = (ctx) => {
  const wrapper = createElement('div', {
    class: 'fe-border-2 fe-border-dashed fe-border-gray-300 fe-rounded-lg fe-p-4 fe-text-center fe-cursor-pointer hover:fe-border-primary-400 fe-transition-colors',
  });

  const input = createElement('input', {
    type: 'file',
    id: `fe-field-${ctx.field.id}`,
    name: ctx.field.id,
    class: 'fe-hidden',
  });

  if (ctx.field.accept) input.setAttribute('accept', ctx.field.accept);
  if (ctx.field.multiple || (ctx.field.maxFiles && ctx.field.maxFiles > 1)) {
    input.setAttribute('multiple', '');
  }
  if (ctx.disabled) input.setAttribute('disabled', '');

  const label = createElement('p', { class: 'fe-text-sm fe-text-gray-500' }, [
    ctx.i18n.t('field.fileUpload'),
  ]);

  wrapper.appendChild(input);
  wrapper.appendChild(label);

  if (ctx.field.maxFileSize) {
    const sizeHint = createElement('p', { class: 'fe-text-xs fe-text-gray-400 fe-mt-1' }, [
      ctx.i18n.t('field.fileSize', { value: formatSize(ctx.field.maxFileSize) }),
    ]);
    wrapper.appendChild(sizeHint);
  }

  // File list display
  const fileList = createElement('div', { class: 'fe-mt-2 fe-space-y-1' });
  wrapper.appendChild(fileList);

  wrapper.addEventListener('click', () => {
    if (!ctx.disabled) input.click();
  });

  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    ctx.onChange(files);

    fileList.innerHTML = '';
    for (const file of files) {
      const item = createElement('div', { class: 'fe-text-xs fe-text-gray-600' }, [
        `${file.name} (${formatSize(file.size)})`,
      ]);
      fileList.appendChild(item);
    }
  });

  return wrapper;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
