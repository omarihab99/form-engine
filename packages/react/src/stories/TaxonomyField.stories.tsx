import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { TaxonomyField } from '../fields/TaxonomyField';

const OPTIONS = [
  { label: 'Engineering', value: 'eng' },
  { label: 'Marketing', value: 'mkt' },
  { label: 'Sales', value: 'sales' },
  { label: 'HR', value: 'hr' },
];

function TaxonomyFieldStory(props: { placeholder?: string }) {
  const schema: FormSchema = {
    id: 'taxonomy-story',
    sections: [{
      id: 's1',
      fields: [{
        id: 'field1',
        type: 'taxonomy',
        label: 'Department',
        placeholder: props.placeholder,
        options: OPTIONS,
      }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Department">
          {() => <TaxonomyField fieldId="field1" options={OPTIONS} placeholder={props.placeholder} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof TaxonomyFieldStory> = {
  title: 'Fields/TaxonomyField',
  component: TaxonomyFieldStory,
};

export default meta;
type Story = StoryObj<typeof TaxonomyFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Select department...' },
};
