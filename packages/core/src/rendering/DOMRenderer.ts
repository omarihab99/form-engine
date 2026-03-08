import type { FieldSchema, FormSchema, SectionSchema, ConditionRule, ValidationRule } from '../types';
import type { FieldRendererContext } from './FieldRegistry';
import { FieldRegistry } from './FieldRegistry';
import { StateManager } from '../state/StateManager';
import { EventBus } from '../events/EventBus';
import { ConditionalEngine } from '../conditions/ConditionalEngine';
import { Validator } from '../validation/Validator';
import { I18nManager } from '../i18n/I18nManager';

export class DOMRenderer {
  private container: HTMLElement | null = null;
  private root: HTMLElement | null = null;
  private fieldElements = new Map<string, HTMLElement>();
  private wrapperElements = new Map<string, HTMLElement>();
  private unsubscribe: (() => void) | null = null;

  constructor(
    private schema: FormSchema,
    private state: StateManager,
    private eventBus: EventBus,
    private fieldRegistry: FieldRegistry,
    private conditionalEngine: ConditionalEngine,
    private validator: Validator,
    private i18n: I18nManager,
  ) {}

  mount(container: HTMLElement): void {
    this.container = container;
    this.root = document.createElement('div');
    this.root.className = 'form-engine-root';
    this.root.setAttribute('dir', this.i18n.getDirection());

    const form = document.createElement('form');
    form.setAttribute('novalidate', '');
    form.className = 'fe-space-y-6';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.eventBus.emit({ type: 'submit', timestamp: Date.now() });
    });

    // Build sections
    for (const section of this.schema.sections) {
      const sectionEl = this.renderSection(section);
      form.appendChild(sectionEl);
    }

    // Submit button
    const submitWrapper = document.createElement('div');
    submitWrapper.className = 'fe-pt-4';
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className =
      'fe-px-6 fe-py-2 fe-bg-primary-600 fe-text-white fe-rounded-md fe-text-sm fe-font-medium ' +
      'hover:fe-bg-primary-700 focus:fe-outline-none focus:fe-ring-2 focus:fe-ring-primary-500 focus:fe-ring-offset-2 ' +
      'disabled:fe-opacity-50 disabled:fe-cursor-not-allowed fe-transition-colors';
    submitBtn.textContent = this.i18n.t('form.submit');
    submitWrapper.appendChild(submitBtn);
    form.appendChild(submitWrapper);

    this.root.appendChild(form);
    container.appendChild(this.root);

    // Initialize field states
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        this.state.initializeField(field.id, field.defaultValue ?? '', field.required || false);
      }
    }

    // Subscribe to state changes for targeted updates
    this.unsubscribe = this.state.subscribe(() => this.handleStateChange());

    // Initial condition evaluation
    this.handleStateChange();

    this.eventBus.emit({ type: 'mount', timestamp: Date.now() });
  }

  unmount(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    if (this.root && this.container) {
      this.container.removeChild(this.root);
    }
    this.root = null;
    this.container = null;
    this.fieldElements.clear();
    this.wrapperElements.clear();
    this.eventBus.emit({ type: 'unmount', timestamp: Date.now() });
  }

  private renderSection(section: SectionSchema): HTMLElement {
    const sectionEl = document.createElement('fieldset');
    sectionEl.className = 'fe-border-0 fe-p-0 fe-m-0';
    sectionEl.dataset.sectionId = section.id;

    if (section.title) {
      const legend = document.createElement('legend');
      legend.className = 'fe-text-lg fe-font-semibold fe-text-gray-900 fe-mb-1';
      legend.textContent = section.title;

      if (section.collapsible) {
        legend.className += ' fe-cursor-pointer fe-select-none';
        legend.addEventListener('click', () => {
          const grid = sectionEl.querySelector<HTMLElement>('.fe-grid');
          if (grid) {
            grid.classList.toggle('fe-hidden');
          }
        });
      }

      sectionEl.appendChild(legend);
    }

    if (section.description) {
      const desc = document.createElement('p');
      desc.className = 'fe-text-sm fe-text-gray-500 fe-mb-4';
      desc.textContent = section.description;
      sectionEl.appendChild(desc);
    }

    if (section.repeatable) {
      this.renderRepeatableSection(section, sectionEl);
    } else {
      const grid = this.createFieldGrid(section.columns || 1, section.fields);
      if (section.collapsed) grid.classList.add('fe-hidden');
      sectionEl.appendChild(grid);
    }

    return sectionEl;
  }

  private renderRepeatableSection(section: SectionSchema, container: HTMLElement): void {
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'fe-space-y-4';
    itemsContainer.dataset.repeatSection = section.id;

    const currentValues = (this.state.getValue(section.id) as unknown[]) || [{}];

    for (let i = 0; i < currentValues.length; i++) {
      const itemEl = this.renderRepeatableItem(section, i);
      itemsContainer.appendChild(itemEl);
    }

    container.appendChild(itemsContainer);

    // Add button
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className =
      'fe-mt-2 fe-px-3 fe-py-1 fe-text-sm fe-text-primary-600 fe-border fe-border-primary-300 ' +
      'fe-rounded-md hover:fe-bg-primary-50 fe-transition-colors';
    addBtn.textContent = `+ ${this.i18n.t('form.add')}`;

    addBtn.addEventListener('click', () => {
      const items = (this.state.getValue(section.id) as unknown[]) || [];
      if (section.maxItems && items.length >= section.maxItems) return;

      const newItems = [...items, {}];
      this.state.setValue(section.id, newItems);

      const itemEl = this.renderRepeatableItem(section, newItems.length - 1);
      itemsContainer.appendChild(itemEl);

      this.eventBus.emit({ type: 'sectionAdd', sectionId: section.id, timestamp: Date.now() });
    });

    container.appendChild(addBtn);
  }

  private renderRepeatableItem(section: SectionSchema, index: number): HTMLElement {
    const item = document.createElement('div');
    item.className = 'fe-relative fe-border fe-border-gray-200 fe-rounded-lg fe-p-4';
    item.dataset.repeatIndex = String(index);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className =
      'fe-absolute fe-top-2 fe-right-2 fe-text-gray-400 hover:fe-text-error-500 fe-text-sm';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', this.i18n.t('form.remove'));

    removeBtn.addEventListener('click', () => {
      const items = (this.state.getValue(section.id) as unknown[]) || [];
      if (section.minItems && items.length <= section.minItems) return;

      const newItems = items.filter((_, i) => i !== index);
      this.state.setValue(section.id, newItems);
      item.remove();

      this.eventBus.emit({ type: 'sectionRemove', sectionId: section.id, timestamp: Date.now() });
    });

    item.appendChild(removeBtn);

    // Render fields with scoped IDs
    const scopedFields = section.fields.map((f) => ({
      ...f,
      id: `${section.id}[${index}].${f.id}`,
    }));

    const grid = this.createFieldGrid(section.columns || 1, scopedFields);
    item.appendChild(grid);

    return item;
  }

  private createFieldGrid(columns: number, fields: FieldSchema[]): HTMLElement {
    const grid = document.createElement('div');
    grid.className = `fe-grid fe-gap-4`;
    grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    grid.style.display = 'grid';

    for (const field of fields) {
      const wrapper = this.renderFieldWrapper(field);
      if (field.colSpan && field.colSpan > 1) {
        wrapper.style.gridColumn = `span ${Math.min(field.colSpan, columns)}`;
      }
      grid.appendChild(wrapper);
    }

    return grid;
  }

  private renderFieldWrapper(field: FieldSchema): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = `fe-field-wrapper ${field.className || ''}`.trim();
    wrapper.dataset.fieldId = field.id;

    if (field.hidden) wrapper.classList.add('fe-hidden');

    // Label (not for checkbox/toggle which have inline labels)
    if (field.type !== 'checkbox' && field.type !== 'toggle') {
      const label = document.createElement('label');
      label.className = 'fe-block fe-text-sm fe-font-medium fe-text-gray-700 fe-mb-1';
      label.id = `fe-label-${field.id}`;
      label.setAttribute('for', `fe-field-${field.id}`);
      label.textContent = field.label;

      if (field.required) {
        const asterisk = document.createElement('span');
        asterisk.className = 'fe-text-error-500 fe-ml-0.5';
        asterisk.textContent = ' *';
        asterisk.setAttribute('aria-hidden', 'true');
        label.appendChild(asterisk);
      }

      wrapper.appendChild(label);
    }

    // Render the field input
    const fieldState = this.state.getFieldState(field.id);
    const ctx: FieldRendererContext = {
      field,
      value: fieldState?.value ?? field.defaultValue ?? '',
      errors: fieldState?.errors || [],
      disabled: field.disabled || fieldState?.isDisabled || false,
      i18n: this.i18n,
      onChange: (value: unknown) => {
        this.state.setValue(field.id, value);
        this.eventBus.emit({
          type: 'change',
          fieldId: field.id,
          value,
          timestamp: Date.now(),
        });
      },
      onBlur: () => {
        this.state.setFieldTouched(field.id, true);
        this.eventBus.emit({ type: 'fieldBlur', fieldId: field.id, timestamp: Date.now() });
      },
    };

    const renderer = this.fieldRegistry.get(field.type);
    if (renderer) {
      const fieldEl = renderer(ctx);
      this.fieldElements.set(field.id, fieldEl);
      wrapper.appendChild(fieldEl);
    }

    // Help text
    if (field.helpText) {
      const help = document.createElement('p');
      help.className = 'fe-text-xs fe-text-gray-400 fe-mt-1';
      help.textContent = field.helpText;
      wrapper.appendChild(help);
    }

    // Error container
    const errorContainer = document.createElement('div');
    errorContainer.id = `fe-error-${field.id}`;
    errorContainer.className = 'fe-text-xs fe-text-error-600 fe-mt-1';
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'polite');
    wrapper.appendChild(errorContainer);

    this.wrapperElements.set(field.id, wrapper);
    return wrapper;
  }

  private handleStateChange(): void {
    const state = this.state.getState();

    for (const section of this.schema.sections) {
      // Evaluate section conditions
      if (section.conditions && section.conditions.length > 0) {
        const sectionConditions: ConditionRule[] = section.conditions.map((c) => ({
          action: c.action,
          operator: c.operator || 'and',
          expressions: c.expressions,
        }));
        const result = this.conditionalEngine.evaluateConditions(sectionConditions, state.values);
        const sectionEl = this.root?.querySelector(`[data-section-id="${section.id}"]`) as HTMLElement;
        if (sectionEl) {
          sectionEl.style.display = result.visible ? '' : 'none';
        }
      }

      for (const field of section.fields) {
        this.updateField(field, state.values);
      }
    }

    // Update submit button state
    const submitBtn = this.root?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = state.isSubmitting;
      submitBtn.textContent = state.isSubmitting
        ? this.i18n.t('form.submitting')
        : this.i18n.t('form.submit');
    }
  }

  private updateField(field: FieldSchema, values: Record<string, unknown>): void {
    const wrapper = this.wrapperElements.get(field.id);
    if (!wrapper) return;

    const fieldState = this.state.getFieldState(field.id);
    if (!fieldState) return;

    // Evaluate conditions
    if (field.conditions && field.conditions.length > 0) {
      const conditions: ConditionRule[] = field.conditions.map((c) => ({
        action: c.action,
        operator: c.operator || 'and',
        expressions: c.expressions,
      }));

      const result = this.conditionalEngine.evaluateConditions(conditions, values);

      this.state.setFieldVisibility(field.id, result.visible);
      this.state.setFieldDisabled(field.id, result.disabled);
      if (result.required) {
        this.state.setFieldRequired(field.id, true);
      }

      wrapper.style.display = result.visible ? '' : 'none';

      const inputEl = this.fieldElements.get(field.id);
      if (inputEl && 'disabled' in inputEl) {
        (inputEl as HTMLInputElement).disabled = result.disabled;
      }
    }

    // Update errors display
    const errorContainer = wrapper.querySelector(`#fe-error-${CSS.escape(field.id)}`);
    if (errorContainer) {
      errorContainer.innerHTML = '';
      for (const error of fieldState.errors) {
        const errorEl = document.createElement('p');
        errorEl.textContent = error;
        errorContainer.appendChild(errorEl);
      }
    }
  }

  updateFieldValue(fieldId: string, value: unknown): void {
    const el = this.fieldElements.get(fieldId);
    if (!el) return;

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value != null ? String(value) : '';
    } else if (el instanceof HTMLSelectElement) {
      el.value = value != null ? String(value) : '';
    }
  }
}
