import type {
  Adapter,
  CustomValidator,
  EventHandler,
  FieldSchema,
  FormEventType,
  FormSchema,
  FormState,
  SubmitHandler,
  SubmitResult,
  ValidationResult,
  ValidationRule,
  FieldType,
} from './types';
import { SchemaParser } from './schema/SchemaParser';
import { StateManager } from './state/StateManager';
import { EventBus } from './events/EventBus';
import { Validator } from './validation/Validator';
import { ConditionalEngine } from './conditions/ConditionalEngine';
import { AdapterRegistry } from './adapters/AdapterRegistry';
import { I18nManager } from './i18n/I18nManager';
import { DOMRenderer } from './rendering/DOMRenderer';
import { FieldRegistry } from './rendering/FieldRegistry';
import type { FieldRenderer } from './rendering/FieldRegistry';
import { registerBuiltInFields } from './fields';

export interface FormEngineOptions {
  schema: FormSchema | Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  locale?: string;
  onSubmit?: SubmitHandler;
  onChange?: (values: Record<string, unknown>) => void;
}

export class FormEngine {
  private schema: FormSchema;
  private state: StateManager;
  private eventBus: EventBus;
  private validator: Validator;
  private conditionalEngine: ConditionalEngine;
  private adapterRegistry: AdapterRegistry;
  private i18n: I18nManager;
  private fieldRegistry: FieldRegistry;
  private renderer: DOMRenderer | null = null;
  private submitHandler: SubmitHandler | null = null;

  constructor(options: FormEngineOptions) {
    const parser = new SchemaParser();
    this.schema = parser.parse(options.schema);

    this.eventBus = new EventBus();
    this.validator = new Validator();
    this.conditionalEngine = new ConditionalEngine();
    this.adapterRegistry = new AdapterRegistry();
    this.i18n = new I18nManager(options.locale || this.schema.locale || 'en');
    this.fieldRegistry = new FieldRegistry();
    registerBuiltInFields(this.fieldRegistry);

    // Build default values from schema
    const defaults = { ...this.collectDefaults(), ...options.defaultValues };
    this.state = new StateManager(defaults);

    if (options.onSubmit) {
      this.submitHandler = options.onSubmit;
    }

    if (options.onChange) {
      this.eventBus.on('change', () => options.onChange!(this.getValues()));
    }

    // Listen for submit events
    this.eventBus.on('submit', async () => {
      await this.submit();
    });
  }

  // --- Lifecycle ---

  mount(container: HTMLElement): this {
    this.renderer = new DOMRenderer(
      this.schema,
      this.state,
      this.eventBus,
      this.fieldRegistry,
      this.conditionalEngine,
      this.validator,
      this.i18n,
    );
    this.renderer.mount(container);
    return this;
  }

  unmount(): void {
    this.renderer?.unmount();
    this.renderer = null;
  }

  destroy(): void {
    this.unmount();
    this.adapterRegistry.destroyAll();
    this.eventBus.removeAllListeners();
    this.eventBus.emit({ type: 'destroy', timestamp: Date.now() });
  }

  // --- State ---

  getValues(): Record<string, unknown> {
    return { ...this.state.getState().values };
  }

  getValue(fieldId: string): unknown {
    return this.state.getValue(fieldId);
  }

  setValue(fieldId: string, value: unknown): void {
    this.state.setValue(fieldId, value);
  }

  setValues(values: Record<string, unknown>): void {
    this.state.setValues(values);
  }

  getState(): FormState {
    return this.state.getState();
  }

  reset(): void {
    const defaults = this.collectDefaults();
    this.state.reset(defaults);
    this.eventBus.emit({ type: 'reset', timestamp: Date.now() });
  }

  // --- Validation ---

  async validate(): Promise<ValidationResult> {
    const fieldRules = this.collectValidationRules();
    const result = await this.validator.validateAll(this.state.getState().values, fieldRules);

    // Update field errors in state
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        const fieldErrors = result.errors
          .filter((e) => e.fieldId === field.id)
          .map((e) => e.message);
        this.state.setFieldErrors(field.id, fieldErrors);
      }
    }

    this.eventBus.emit({
      type: result.valid ? 'validate' : 'validationError',
      errors: result.errors.map((e) => ({ fieldId: e.fieldId, message: e.message })),
      timestamp: Date.now(),
    });

    return result;
  }

  async validateField(fieldId: string): Promise<string[]> {
    const rules = this.getFieldRules(fieldId);
    const errors = await this.validator.validateField(
      fieldId,
      this.state.getValue(fieldId),
      rules,
      this.state.getState().values,
    );
    const messages = errors.map((e) => e.message);
    this.state.setFieldErrors(fieldId, messages);
    return messages;
  }

  registerValidator(name: string, validator: CustomValidator): void {
    this.validator.registerValidator(name, validator);
  }

  // --- Submission ---

  async submit(): Promise<SubmitResult> {
    const validation = await this.validate();
    if (!validation.valid) {
      this.eventBus.emit({
        type: 'submitError',
        errors: validation.errors.map((e) => ({ fieldId: e.fieldId, message: e.message })),
        timestamp: Date.now(),
      });
      return { success: false, error: 'Validation failed' };
    }

    this.state.setSubmitting(true);
    this.state.incrementSubmitCount();

    try {
      let result: SubmitResult;

      if (this.submitHandler) {
        result = await this.submitHandler(this.getValues(), this.schema.submit as never);
      } else {
        result = { success: true, data: this.getValues() };
      }

      this.eventBus.emit({
        type: 'submitSuccess',
        value: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      this.eventBus.emit({
        type: 'submitError',
        value: error,
        timestamp: Date.now(),
      });
      return { success: false, error };
    } finally {
      this.state.setSubmitting(false);
    }
  }

  registerSubmitHandler(handler: SubmitHandler): void {
    this.submitHandler = handler;
  }

  // --- Events ---

  on(event: FormEventType, handler: EventHandler): () => void {
    return this.eventBus.on(event, handler);
  }

  // --- Extensibility ---

  registerFieldType(type: FieldType, renderer: FieldRenderer): void {
    this.fieldRegistry.register(type, renderer);
  }

  registerAdapter(adapter: Adapter): void {
    this.adapterRegistry.register(adapter);
  }

  // --- I18n ---

  setLocale(locale: string): void {
    this.i18n.setLocale(locale);
  }

  registerTranslations(locale: string, translations: Record<string, string>): void {
    this.i18n.registerTranslations(locale, translations);
  }

  // --- Internals exposed for React package ---

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getStateManager(): StateManager {
    return this.state;
  }

  getSchema(): FormSchema {
    return this.schema;
  }

  getI18n(): I18nManager {
    return this.i18n;
  }

  getConditionalEngine(): ConditionalEngine {
    return this.conditionalEngine;
  }

  getValidator(): Validator {
    return this.validator;
  }

  // --- Private helpers ---

  private collectDefaults(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        } else {
          defaults[field.id] = field.type === 'checkbox' || field.type === 'toggle' ? false : '';
        }
      }
    }
    return defaults;
  }

  private collectValidationRules(): Map<string, ValidationRule[]> {
    const rules = new Map<string, ValidationRule[]>();

    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        const fieldState = this.state.getFieldState(field.id);
        if (fieldState && !fieldState.isVisible) continue;

        const fieldRules: ValidationRule[] = [];

        if (field.required || fieldState?.isRequired) {
          fieldRules.push({ type: 'required' });
        }

        for (const rule of field.validation || []) {
          fieldRules.push({ type: rule.type, value: rule.value, message: rule.message });
        }

        if (fieldRules.length > 0) {
          rules.set(field.id, fieldRules);
        }
      }
    }

    return rules;
  }

  private getFieldRules(fieldId: string): ValidationRule[] {
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        if (field.id === fieldId) {
          const rules: ValidationRule[] = [];
          const fieldState = this.state.getFieldState(fieldId);
          if (field.required || fieldState?.isRequired) {
            rules.push({ type: 'required' });
          }
          for (const rule of field.validation || []) {
            rules.push({ type: rule.type, value: rule.value, message: rule.message });
          }
          return rules;
        }
      }
    }
    return [];
  }
}
