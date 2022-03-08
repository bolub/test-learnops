import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, TextField, IconButton } from '@getsynapse/design-system';

const SearchInput: React.FC<{
  onToggleDropdown: () => void;
  onInputChange: (value: string) => void;
  selectedOptions?: any[];
  getOptionLabel?: (option: any) => string;
  clearSelectedOptions?: () => void;
  placeholder?: string;
  isDropdownExpanded?: boolean;
  props: {};
}> = ({
  onToggleDropdown,
  onInputChange,
  getOptionLabel,
  selectedOptions = [],
  clearSelectedOptions = () => {},
  placeholder,
  isDropdownExpanded,
  props,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (!isDropdownExpanded) {
      onToggleDropdown();
    }
    const value = event.target.value;
    if (value.length === 0) {
      clearInputHandle();
    } else {
      onInputChange(event.target.value);
      setFilterValue(event.target.value);
    }
  };
  const clearInputHandle = () => {
    if (selectedOptions.length > 0) {
      clearSelectedOptions();
    } else {
      setFilterValue('');
      onInputChange('');
      inputRef.current?.focus();
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (selectedOptions.length > 0 && getOptionLabel) {
      setFilterValue(getOptionLabel(selectedOptions[0]));
    }
    if (selectedOptions.length === 0) {
      setFilterValue('');
      onInputChange('');
      inputRef.current?.focus();
    }
  }, [selectedOptions, setFilterValue, getOptionLabel, onInputChange]);
  return (
    <div onClick={onToggleDropdown} {...props}>
      <TextField
        ref={inputRef}
        value={filterValue}
        variant='search'
        onChange={handleInputChange}
        placeholder={placeholder}
        tailingIcon={
          <IconButton
            name='close-circle'
            description='clear filter input'
            onClick={(event: React.KeyboardEvent<HTMLElement>) => {
              event.stopPropagation();
              clearInputHandle();
            }}
          />
        }
        data-cy='autocomplete-search-input'
      />
    </div>
  );
};

const Autocomplete: React.FC<{
  options: any[];
  onSelectOption?: (option: any) => void;
  getOptionLabel?: (option: any) => string;
  className?: string;
  filterOptions?: (options: any[], filterValue: string) => any[];
  controlled?: boolean;
  values?: any[];
  onClearSelectedOptions?: () => void;
  placeholder?: string;
}> = ({
  options,
  className = '',
  onSelectOption = () => {},
  getOptionLabel,
  filterOptions,
  controlled = false,
  values = [],
  onClearSelectedOptions = () => {},
  placeholder,
  ...otherProps
}) => {
  return (
    <Dropdown
      controlled={controlled}
      values={values}
      filterable
      options={options}
      onChange={onSelectOption}
      triggerProps={{ 'data-cy': 'autocomplete-trigger', className }}
      listProps={{ 'data-cy': 'autocomplete-options-list' }}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions}
      renderTrigger={({
        onToggleDropdown,
        onInputChange,
        selectedOptions,
        isDropdownExpanded,
        props,
      }) => (
        <SearchInput
          onToggleDropdown={onToggleDropdown}
          onInputChange={onInputChange!}
          props={props}
          selectedOptions={selectedOptions}
          getOptionLabel={getOptionLabel}
          placeholder={placeholder}
          clearSelectedOptions={onClearSelectedOptions}
          isDropdownExpanded={isDropdownExpanded}
        />
      )}
      {...otherProps}
    />
  );
};

export default Autocomplete;
