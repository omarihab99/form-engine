import React from 'react';
import type { FieldSchema, SectionSchema } from '@omarihab/form-engine-core';
import { useFormEngineContext } from '../context';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import { SubmitButton } from './SubmitButton';
import { ErrorSummary } from './ErrorSummary';
import { TextField } from '../fields/TextField';
import { TextareaField } from '../fields/TextareaField';
import { DropdownField } from '../fields/DropdownField';
import { MultiselectField } from '../fields/MultiselectField';
import { RadioField } from '../fields/RadioField';
import { CheckboxField } from '../fields/CheckboxField';
import { ToggleField } from '../fields/ToggleField';
import { FileField } from '../fields/FileField';
import { RichTextField } from '../fields/RichTextField';
import { PeoplePickerField } from '../fields/PeoplePickerField';
import { LookupField } from '../fields/LookupField';
import { TaxonomyField } from '../fields/TaxonomyField';

export interface AutoFormProps {
  showErrorSummary?: boolean;
  className?: string;
}

export function AutoForm({ showErrorSummary = true, className }: AutoFormProps) {
  const { engine } = useFormEngineContext();
  const schema = engine.getSchema();
  const i18n = engine.getI18n();

  return (
    <div className={`form-engine-root ${className || ''}`} dir={i18n.getDirection()}>
      <form noValidate className="fe-space-y-8" onSubmit={(e) => e.preventDefault()}>
        {schema.title && (
          <h2 className="fe-text-2xl fe-font-semibold fe-text-primary-500">{schema.title}</h2>
        )}
        {schema.description && (
          <p className="fe-text-sm fe-text-gray-700">{schema.description}</p>
        )}

        {showErrorSummary && <ErrorSummary />}

        {schema.sections.map((section) => (
          <AutoFormSection key={section.id} section={section} />
        ))}

        <div className="fe-pt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function AutoFormSection({ section }: { section: SectionSchema }) {
  return (
    <FormSection
      title={section.title}
      description={section.description}
      collapsible={section.collapsible}
      defaultCollapsed={section.collapsed}
      columns={section.columns}
    >
      {section.fields.map((field) => (
        <AutoFormField key={field.id} field={field} />
      ))}
    </FormSection>
  );
}

function AutoFormField({ field }: { field: FieldSchema }) {
  const skipLabel = field.type === 'checkbox' || field.type === 'toggle';

  return (
    <FormField
      fieldId={field.id}
      label={skipLabel ? undefined : field.label}
      required={field.required}
      helpText={field.helpText}
    >
      {() => {
        switch (field.type) {
          case 'text':
            return (
              <TextField
                fieldId={field.id}
                placeholder={field.placeholder}
                minLength={field.minLength}
                maxLength={field.maxLength}
              />
            );
          case 'number':
            return (
              <TextField
                fieldId={field.id}
                type="number"
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            );
          case 'date':
            return <TextField fieldId={field.id} type="date" />;
          case 'textarea':
            return (
              <TextareaField
                fieldId={field.id}
                placeholder={field.placeholder}
                rows={field.rows}
              />
            );
          case 'dropdown':
            return (
              <DropdownField
                fieldId={field.id}
                options={field.options || []}
                placeholder={field.placeholder}
              />
            );
          case 'multiselect':
            return <MultiselectField fieldId={field.id} options={field.options || []} />;
          case 'radio':
            return <RadioField fieldId={field.id} options={field.options || []} />;
          case 'checkbox':
            return <CheckboxField fieldId={field.id} label={field.label} />;
          case 'toggle':
            return <ToggleField fieldId={field.id} label={field.label} />;
          case 'file':
            return (
              <FileField
                fieldId={field.id}
                accept={field.accept}
                multiple={field.multiple}
                maxFileSize={field.maxFileSize}
              />
            );
          case 'rich-text':
            return <RichTextField fieldId={field.id} />;
          case 'people-picker':
            return <PeoplePickerField fieldId={field.id} placeholder={field.placeholder} />;
          case 'lookup':
            return (
              <LookupField
                fieldId={field.id}
                options={field.options || []}
                placeholder={field.placeholder}
              />
            );
          case 'taxonomy':
            return (
              <TaxonomyField
                fieldId={field.id}
                options={field.options || []}
                placeholder={field.placeholder}
              />
            );
          default:
            return (
              <TextField fieldId={field.id} placeholder={field.placeholder} />
            );
        }
      }}
    </FormField>
  );
}
