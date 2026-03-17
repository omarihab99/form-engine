import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { TextareaField } from '../fields/TextareaField';

function TextareaFieldStory(props: { placeholder?: string; rows?: number; required?: boolean }) {
  const schema: FormSchema = {
    id: 'textarea-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'textarea', label: 'Textarea', required: props.required, placeholder: props.placeholder, rows: props.rows }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 400, padding: 16 }}>
        <FormField fieldId="field1" label="Textarea" required={props.required}>
          {() => <TextareaField fieldId="field1" placeholder={props.placeholder} rows={props.rows} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof TextareaFieldStory> = {
  title: 'Fields/TextareaField',
  component: TextareaFieldStory,
};

export default meta;
type Story = StoryObj<typeof TextareaFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Write something...', rows: 3 },
};

export const TallTextarea: Story = {
  args: { placeholder: 'Lots of space...', rows: 8 },
};
