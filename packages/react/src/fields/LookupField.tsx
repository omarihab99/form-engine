import React from 'react';
import { DropdownField } from './DropdownField';
import type { DropdownFieldProps } from './DropdownField';

export type LookupFieldProps = DropdownFieldProps;

export function LookupField(props: LookupFieldProps) {
  return <DropdownField {...props} />;
}
