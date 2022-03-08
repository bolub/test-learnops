import { ComponentProps } from 'react';
import { Dropdown, tailwindOverride } from '@getsynapse/design-system';
import classnames from 'classnames';
import { FormOption } from 'utils/customTypes';
import MultipleOptionListItem from 'Molecules/MultipleOptionsListItem/MultipleOptionsListItem';
import get from 'lodash/get';

type DropdownProps = ComponentProps<typeof Dropdown>;

const MultiSelectDropdown = ({ ...otherProps }: DropdownProps) => {
  const placeholderText = get(otherProps, 'otherProps.placeholder');
  return (
    <Dropdown
      {...otherProps}
      triggerProps={{
        'data-cy': 'dropdown',
        className: tailwindOverride(
          'w-full',
          get(otherProps, 'triggerProps.className')
        ),
        placeholder: placeholderText,
      }}
      renderOption={(
        option: FormOption,
        isSelected: boolean,
        selectOption,
        { className, ...otherProps }
      ) => (
        <li
          {...otherProps}
          key={option.value}
          className={classnames('group', className, {
            'hover:bg-primary focus-visible:bg-primary': isSelected,
          })}
        >
          <MultipleOptionListItem
            label={option.label}
            isSelected={isSelected}
            selectOption={selectOption}
          />
        </li>
      )}
      multiple
    />
  );
};

export default MultiSelectDropdown;
