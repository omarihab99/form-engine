import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { ToggleField } from '../fields/ToggleField';

function ToggleFieldStory(props: { label?: string }) {
  const label = props.label || 'Enable notifications';
  const schema: FormSchema = {
    id: 'toggle-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'toggle', label }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1">
          {() => <ToggleField fieldId="field1" label={label} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof ToggleFieldStory> = {
  title: 'Fields/ToggleField',
  component: ToggleFieldStory,
};

export default meta;
type Story = StoryObj<typeof ToggleFieldStory>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: 'Dark mode' },
};
