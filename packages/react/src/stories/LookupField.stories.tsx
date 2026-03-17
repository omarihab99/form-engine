import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { LookupField } from '../fields/LookupField';

const OPTIONS = [
  { label: 'Project Alpha', value: '1' },
  { label: 'Project Beta', value: '2' },
  { label: 'Project Gamma', value: '3' },
];

function LookupFieldStory(props: { placeholder?: string }) {
  const schema: FormSchema = {
    id: 'lookup-story',
    sections: [{
      id: 's1',
      fields: [{
        id: 'field1',
        type: 'lookup',
        label: 'Lookup',
        placeholder: props.placeholder,
        options: OPTIONS,
      }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 360, padding: 16 }}>
        <FormField fieldId="field1" label="Lookup">
          {() => <LookupField fieldId="field1" options={OPTIONS} placeholder={props.placeholder} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof LookupFieldStory> = {
  title: 'Fields/LookupField',
  component: LookupFieldStory,
};

export default meta;
type Story = StoryObj<typeof LookupFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Select a project...' },
};
