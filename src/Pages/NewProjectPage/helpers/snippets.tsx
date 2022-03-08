import React from 'react';
import { Checkbox } from '@getsynapse/design-system';

export const MultipleOptionLI: React.FC<{
  label: string;
  isSelected: boolean;
  selectOption: (option: any) => void;
}> = ({ label, isSelected = false, selectOption }) => (
  <Checkbox
    checked={isSelected}
    onChange={selectOption}
    label={label}
    inputProps={{
      className: `${
        isSelected &&
        'group-hover:border-neutral-white group-focus-visible:border-neutral-white'
      }`,
    }}
    className={`${
      isSelected &&
      'group-hover:text-neutral-white group-focus-visible:text-neutral-white'
    }`}
  />
);
