import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { RichTextField } from '../fields/RichTextField';

function RichTextFieldStory() {
  const schema: FormSchema = {
    id: 'richtext-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'rich-text', label: 'Rich Text Editor' }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 500, padding: 16 }}>
        <FormField fieldId="field1" label="Rich Text Editor">
          {() => <RichTextField fieldId="field1" />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof RichTextFieldStory> = {
  title: 'Fields/RichTextField',
  component: RichTextFieldStory,
};

export default meta;
type Story = StoryObj<typeof RichTextFieldStory>;

export const Default: Story = {};
