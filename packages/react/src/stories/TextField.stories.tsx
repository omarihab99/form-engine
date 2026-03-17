import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { TextField } from '../fields/TextField';

function TextFieldStory(props: {
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  min?: number;
  max?: number;
}) {
  const schema: FormSchema = {
    id: 'text-story',
    sections: [{
      id: 's1',
      fields: [{
        id: 'field1',
        type: props.type === 'number' ? 'number' : props.type === 'date' ? 'date' : 'text',
        label: 'Text Field',
        required: props.required,
        disabled: props.disabled,
        placeholder: props.placeholder,
        min: props.min,
        max: props.max,
      }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Text Field" required={props.required} helpText={props.helpText}>
          {() => (
            <TextField
              fieldId="field1"
              type={props.type}
              placeholder={props.placeholder}
              min={props.min}
              max={props.max}
            />
          )}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof TextFieldStory> = {
  title: 'Fields/TextField',
  component: TextFieldStory,
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'date'] },
  },
};

export default meta;
type Story = StoryObj<typeof TextFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const Required: Story = {
  args: { placeholder: 'Required field', required: true },
};

export const WithHelpText: Story = {
  args: { placeholder: 'Enter value', helpText: 'This is a helpful description.' },
};

export const NumberInput: Story = {
  args: { type: 'number', placeholder: '0', min: 0, max: 100 },
};

export const DateInput: Story = {
  args: { type: 'date' },
};
