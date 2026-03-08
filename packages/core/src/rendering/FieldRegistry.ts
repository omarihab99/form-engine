import type { FieldSchema, FieldType } from '../types';
import type { I18nManager } from '../i18n/I18nManager';

export interface FieldRendererContext {
  field: FieldSchema;
  value: unknown;
  errors: string[];
  disabled: boolean;
  i18n: I18nManager;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

export type FieldRenderer = (ctx: FieldRendererContext) => HTMLElement;

export class FieldRegistry {
  private renderers = new Map<FieldType, FieldRenderer>();

  register(type: FieldType, renderer: FieldRenderer): void {
    this.renderers.set(type, renderer);
  }

  get(type: FieldType): FieldRenderer | undefined {
    return this.renderers.get(type);
  }

  has(type: FieldType): boolean {
    return this.renderers.has(type);
  }
}
