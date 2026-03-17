import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { MultiselectField } from '../fields/MultiselectField';

const OPTIONS = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
];

function MultiselectFieldStory() {
  const schema: FormSchema = {
    id: 'multiselect-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'multiselect', label: 'Colors', options: OPTIONS }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Colors">
          {() => <MultiselectField fieldId="field1" options={OPTIONS} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof MultiselectFieldStory> = {
  title: 'Fields/MultiselectField',
  component: MultiselectFieldStory,
};

export default meta;
type Story = StoryObj<typeof MultiselectFieldStory>;

export const Default: Story = {};
