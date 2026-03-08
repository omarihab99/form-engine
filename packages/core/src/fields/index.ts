import type { FieldType } from '../types';
import type { FieldRegistry } from '../rendering/FieldRegistry';
import { textRenderer } from './text';
import { textareaRenderer } from './textarea';
import { dropdownRenderer } from './dropdown';
import { multiselectRenderer } from './multiselect';
import { radioRenderer } from './radio';
import { checkboxRenderer } from './checkbox';
import { toggleRenderer } from './toggle';
import { fileRenderer } from './file';
import { richTextRenderer } from './richtext';
import { peoplePickerRenderer } from './peoplepicker';
import { lookupRenderer } from './lookup';
import { taxonomyRenderer } from './taxonomy';

export function registerBuiltInFields(registry: FieldRegistry): void {
  const renderers: [FieldType, typeof textRenderer][] = [
    ['text', textRenderer],
    ['number', textRenderer],
    ['date', textRenderer],
    ['textarea', textareaRenderer],
    ['dropdown', dropdownRenderer],
    ['multiselect', multiselectRenderer],
    ['radio', radioRenderer],
    ['checkbox', checkboxRenderer],
    ['toggle', toggleRenderer],
    ['file', fileRenderer],
    ['rich-text', richTextRenderer],
    ['people-picker', peoplePickerRenderer],
    ['lookup', lookupRenderer],
    ['taxonomy', taxonomyRenderer],
  ];

  for (const [type, renderer] of renderers) {
    registry.register(type, renderer);
  }
}

export {
  textRenderer,
  textareaRenderer,
  dropdownRenderer,
  multiselectRenderer,
  radioRenderer,
  checkboxRenderer,
  toggleRenderer,
  fileRenderer,
  richTextRenderer,
  peoplePickerRenderer,
  lookupRenderer,
  taxonomyRenderer,
};
