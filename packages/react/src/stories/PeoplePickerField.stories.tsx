import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormField } from '../components/FormField';
import { PeoplePickerField } from '../fields/PeoplePickerField';

function PeoplePickerFieldStory(props: { placeholder?: string }) {
  const schema: FormSchema = {
    id: 'people-story',
    sections: [{
      id: 's1',
      fields: [{ id: 'field1', type: 'people-picker', label: 'People Picker', placeholder: props.placeholder }],
    }],
  };

  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 400, padding: 16 }}>
        <FormField fieldId="field1" label="People Picker">
          {() => <PeoplePickerField fieldId="field1" placeholder={props.placeholder} />}
        </FormField>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof PeoplePickerFieldStory> = {
  title: 'Fields/PeoplePickerField',
  component: PeoplePickerFieldStory,
};

export default meta;
type Story = StoryObj<typeof PeoplePickerFieldStory>;

export const Default: Story = {
  args: { placeholder: 'Search for people...' },
};
