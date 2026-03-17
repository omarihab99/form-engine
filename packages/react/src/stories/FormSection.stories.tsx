import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';
import { FormSection } from '../components/FormSection';
import { FormField } from '../components/FormField';
import { TextField } from '../fields/TextField';

const schema: FormSchema = {
  id: 'section-story',
  sections: [{
    id: 's1',
    fields: [
      { id: 'first', type: 'text', label: 'First Name' },
      { id: 'last', type: 'text', label: 'Last Name' },
      { id: 'email', type: 'text', label: 'Email' },
    ],
  }],
};

function FormSectionStory(props: {
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: number;
}) {
  return (
    <FormProvider schema={schema}>
      <div style={{ maxWidth: 600, padding: 16 }}>
        <FormSection
          title={props.title}
          description={props.description}
          collapsible={props.collapsible}
          defaultCollapsed={props.defaultCollapsed}
          columns={props.columns}
        >
          <FormField fieldId="first" label="First Name">
            {() => <TextField fieldId="first" placeholder="First name" />}
          </FormField>
          <FormField fieldId="last" label="Last Name">
            {() => <TextField fieldId="last" placeholder="Last name" />}
          </FormField>
          <FormField fieldId="email" label="Email">
            {() => <TextField fieldId="email" placeholder="you@example.com" />}
          </FormField>
        </FormSection>
      </div>
    </FormProvider>
  );
}

const meta: Meta<typeof FormSectionStory> = {
  title: 'Components/FormSection',
  component: FormSectionStory,
};

export default meta;
type Story = StoryObj<typeof FormSectionStory>;

export const Default: Story = {
  args: { title: 'Personal Information', description: 'Please fill in your details.' },
};

export const TwoColumns: Story = {
  args: { title: 'Two Column Layout', columns: 2 },
};

export const ThreeColumns: Story = {
  args: { title: 'Three Column Layout', columns: 3 },
};

export const Collapsible: Story = {
  args: { title: 'Collapsible Section', collapsible: true },
};

export const CollapsedByDefault: Story = {
  args: { title: 'Collapsed Section', collapsible: true, defaultCollapsed: true },
};
