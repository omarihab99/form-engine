import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { RadioField } from '../fields/RadioField';

const OPTIONS = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

function RadioFieldStory(props: { required?: boolean }) {
  const schema: FormSchema = {
    id: 'radio-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'radio', label: 'Size', required: props.required, options: OPTIONS }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Size" required={props.required}>
          {() => <RadioField fieldId="field1" options={OPTIONS} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof RadioFieldStory> = {
  title: 'Fields/RadioField',
  component: RadioFieldStory,
};

export default meta;
type Story = StoryObj<typeof RadioFieldStory>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};
