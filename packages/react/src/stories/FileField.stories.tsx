import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { FileField } from '../fields/FileField';

function FileFieldStory(props: { accept?: string; multiple?: boolean; maxFileSize?: number }) {
  const schema: FormSchema = {
    id: 'file-story',
    sections: [{
      id: 's1',
      fields: [{
        id: 'field1',
        type: 'file',
        label: 'File Upload',
        accept: props.accept,
        multiple: props.multiple,
        maxFileSize: props.maxFileSize,
      }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 400, padding: 16 }}>
        <FormField fieldId="field1" label="File Upload">
          {() => (
            <FileField
              fieldId="field1"
              accept={props.accept}
              multiple={props.multiple}
              maxFileSize={props.maxFileSize}
            />
          )}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof FileFieldStory> = {
  title: 'Fields/FileField',
  component: FileFieldStory,
};

export default meta;
type Story = StoryObj<typeof FileFieldStory>;

export const Default: Story = {};

export const ImagesOnly: Story = {
  args: { accept: 'image/*', multiple: true, maxFileSize: 2097152 },
};

export const PDFOnly: Story = {
  args: { accept: '.pdf', maxFileSize: 5242880 },
};
