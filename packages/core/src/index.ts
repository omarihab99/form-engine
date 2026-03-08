// Main entry point for @omarihab/form-engine-core
export { FormEngine } from './FormEngine';
export type { FormEngineOptions } from './FormEngine';

// Types
export * from './types';

// Core modules
export { EventBus } from './events';
export { StateManager } from './state';
export { SchemaParser } from './schema';
export type { SchemaValidationError } from './schema';
export { Validator } from './validation';
export { ConditionalEngine } from './conditions';
export { AdapterRegistry } from './adapters';
export { I18nManager } from './i18n';

// Rendering
export { DOMRenderer, FieldRegistry } from './rendering';
export type { FieldRenderer, FieldRendererContext } from './rendering';

// Field renderers
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
  registerBuiltInFields,
} from './fields';
