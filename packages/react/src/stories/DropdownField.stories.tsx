import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { DropdownField } from '../fields/DropdownField';

const OPTIONS = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Disabled Option', value: 'd', disabled: true },
];

function DropdownFieldStory(props: { placeholder?: string; required?: boolean }) {
  const schema: FormSchema = {
    id: 'dropdown-story',
    sections: [{
      id: 's1',
      fields: [{
        id: 'field1',
        type: 'dropdown',
        label: 'Dropdown',
        required: props.required,
        placeholder: props.placeholder,
        options: OPTIONS,
      }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Dropdown" required={props.required}>
          {() => <DropdownField fieldId="field1" options={OPTIONS} placeholder={props.placeholder} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof DropdownFieldStory> = {
  title: 'Fields/DropdownField',
  component: DropdownFieldStory,
};

export default meta;
type Story = StoryObj<typeof DropdownFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Select an option...' },
};

export const Required: Story = {
  args: { placeholder: 'Pick one...', required: true },
};
