import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { CheckboxField } from '../fields/CheckboxField';

function CheckboxFieldStory(props: { label?: string }) {
  const label = props.label || 'I agree to the terms';
  const schema: FormSchema = {
    id: 'checkbox-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'checkbox', label }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1">
          {() => <CheckboxField fieldId="field1" label={label} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof CheckboxFieldStory> = {
  title: 'Fields/CheckboxField',
  component: CheckboxFieldStory,
};

export default meta;
type Story = StoryObj<typeof CheckboxFieldStory>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: 'Subscribe to newsletter updates' },
};
