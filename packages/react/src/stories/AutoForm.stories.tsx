import type { Meta, StoryObj } from '@storybook/react';
import { AutoForm } from '../components/AutoForm';
import { withFormProvider, allFieldsSchema, multiColumnSchema, validationSchema, simpleSchema } from './helpers';

const meta: Meta<typeof AutoForm> = {
  title: 'Components/AutoForm',
  component: AutoForm,
};

export default meta;
type Story = StoryObj<typeof AutoForm>;

export const Default: Story = {
  decorators: [withFormProvider(simpleSchema)],
};

export const AllFieldTypes: Story = {
  decorators: [withFormProvider(allFieldsSchema)],
};

export const MultiColumnLayout: Story = {
  decorators: [withFormProvider(multiColumnSchema)],
};

export const WithValidation: Story = {
  decorators: [withFormProvider(validationSchema)],
};

export const WithDefaultValues: Story = {
  decorators: [
    withFormProvider(simpleSchema, {
      defaultValues: { name: 'John Doe', email: 'john@example.com' },
    }),
  ],
};

export const WithoutErrorSummary: Story = {
  args: { showErrorSummary: false },
  decorators: [withFormProvider(validationSchema)],
};
