import React from 'react';
import { DropdownField } from './DropdownField';
import type { DropdownFieldProps } from './DropdownField';

export type TaxonomyFieldProps = DropdownFieldProps;

export function TaxonomyField(props: TaxonomyFieldProps) {
  return <DropdownField {...props} />;
}
