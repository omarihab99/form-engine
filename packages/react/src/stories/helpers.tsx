import React from 'react';
import type { FormSchema } from '@omarihab/form-engine-core';
import { FormProvider } from '../components/FormProvider';

export function withFormProvider(
  schema: FormSchema,
  options?: { defaultValues?: Record<string, unknown> },
) {
  return function Decorator(Story: React.ComponentType) {
    return (
      <FormProvider schema={schema} defaultValues={options?.defaultValues}>
        <div style={{ maxWidth: 480, padding: 16 }}>
          <Story />
        </div>
      </FormProvider>
    );
  };
}

export const simpleSchema: FormSchema = {
  id: 'simple-form',
  title: 'Simple Form',
  sections: [
    {
      id: 'main',
      fields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your name' },
        { id: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com' },
      ],
    },
  ],
};

export const allFieldsSchema: FormSchema = {
  id: 'all-fields-form',
  title: 'All Field Types',
  description: 'A form showcasing every field type available in the form engine.',
  sections: [
    {
      id: 'text-inputs',
      title: 'Text Inputs',
      fields: [
        { id: 'text', type: 'text', label: 'Text Field', placeholder: 'Enter text...', required: true },
        { id: 'number', type: 'number', label: 'Number Field', placeholder: '0', min: 0, max: 100 },
        { id: 'date', type: 'date', label: 'Date Field' },
        { id: 'textarea', type: 'textarea', label: 'Textarea', placeholder: 'Write something...', rows: 4 },
        { id: 'richtext', type: 'rich-text', label: 'Rich Text Editor' },
      ],
    },
    {
      id: 'selection',
      title: 'Selection Inputs',
      fields: [
        {
          id: 'dropdown',
          type: 'dropdown',
          label: 'Dropdown',
          placeholder: 'Pick one...',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' },
          ],
        },
        {
          id: 'multiselect',
          type: 'multiselect',
          label: 'Multi-select',
          options: [
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
          ],
        },
        {
          id: 'radio',
          type: 'radio',
          label: 'Radio Group',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      ],
    },
    {
      id: 'toggles',
      title: 'Toggles & Checks',
      fields: [
        { id: 'checkbox', type: 'checkbox', label: 'I agree to the terms' },
        { id: 'toggle', type: 'toggle', label: 'Enable notifications' },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Fields',
      fields: [
        { id: 'file', type: 'file', label: 'File Upload', accept: '.pdf,.docx', multiple: true, maxFileSize: 5242880 },
        { id: 'people', type: 'people-picker', label: 'People Picker', placeholder: 'Search people...' },
        {
          id: 'lookup',
          type: 'lookup',
          label: 'Lookup Field',
          options: [
            { label: 'Item 1', value: '1' },
            { label: 'Item 2', value: '2' },
          ],
        },
        {
          id: 'taxonomy',
          type: 'taxonomy',
          label: 'Taxonomy Field',
          options: [
            { label: 'Category A', value: 'cat-a' },
            { label: 'Category B', value: 'cat-b' },
          ],
        },
      ],
    },
  ],
};

export const multiColumnSchema: FormSchema = {
  id: 'multi-column-form',
  title: 'Multi-Column Layout',
  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      columns: 2,
      fields: [
        { id: 'firstName', type: 'text', label: 'First Name', required: true },
        { id: 'lastName', type: 'text', label: 'Last Name', required: true },
        { id: 'email', type: 'text', label: 'Email', required: true },
        { id: 'phone', type: 'text', label: 'Phone' },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      collapsible: true,
      fields: [
        {
          id: 'role',
          type: 'dropdown',
          label: 'Role',
          options: [
            { label: 'Developer', value: 'dev' },
            { label: 'Designer', value: 'design' },
            { label: 'Manager', value: 'mgr' },
          ],
        },
        { id: 'newsletter', type: 'toggle', label: 'Subscribe to newsletter' },
      ],
    },
  ],
};

export const validationSchema: FormSchema = {
  id: 'validation-form',
  title: 'Validation Example',
  sections: [
    {
      id: 'main',
      fields: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          required: true,
          minLength: 3,
          maxLength: 20,
          validation: [
            { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
          ],
        },
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          required: true,
          min: 18,
          max: 120,
        },
        {
          id: 'bio',
          type: 'textarea',
          label: 'Bio',
          placeholder: 'Tell us about yourself...',
          rows: 3,
        },
        {
          id: 'agree',
          type: 'checkbox',
          label: 'I agree to the terms and conditions',
          required: true,
        },
      ],
    },
  ],
};
