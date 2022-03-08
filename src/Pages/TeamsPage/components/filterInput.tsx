import intl from 'react-intl-universal';
import {
  TableFilterProps,
  Typography,
  NumericInput,
  Dropdown,
  Input,
} from '@getsynapse/design-system';
import { FormOption } from 'utils/customTypes';
import {
  EMPLOYMENT_TYPE,
  COUNTRIES,
  MEMBER_VALUES,
  COLUMN_OPTION_TYPES,
} from 'utils/constants';

const filterInput: TableFilterProps['filterInputElement'] = (
  column,
  filterInput,
  setInput
) => {
  const options: { [key: string]: FormOption[] } = {
    [MEMBER_VALUES.EMPLOYMENT_TYPE]: EMPLOYMENT_TYPE.map((type) => ({
      value: intl.get(`TEAMS.EMPLOYMENT_TYPE.${type}`),
      label: intl.get(`TEAMS.EMPLOYMENT_TYPE.${type}`),
    })),
    [MEMBER_VALUES.COUNTRY]: COUNTRIES.map((country) => ({
      value: intl.get(`COUNTRIES.${country.toLocaleUpperCase()}`),
      label: intl.get(`COUNTRIES.${country.toLocaleUpperCase()}`),
    })),
  };

  return (
    <div className='flex-grow self-baseline'>
      <Typography
        variant='label'
        weight='medium'
        className='inline-block mb-2 leading-4 tracking-px02'
      >
        {intl.get('FILTER_GENERAL.VALUE')}
      </Typography>
      {column.type === COLUMN_OPTION_TYPES.NUMBER && (
        <NumericInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInput(event.target.value);
          }}
          data-testid='filter__number-input'
        />
      )}
      {column.type === COLUMN_OPTION_TYPES.TEXT && (
        <Input
          className='h-auto py-2'
          name='table-header__search-input'
          placeholder={intl.get('FILTER_GENERAL.INPUT_VALUE')}
          state='default'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInput(event.target.value);
          }}
          value={filterInput as string}
          data-testid='filter__text-inputs'
        />
      )}
      {column.type === COLUMN_OPTION_TYPES.OPTIONS && (
        <Dropdown
          options={options[column.value]}
          filterable={false}
          listProps={{ 'data-testid': 'dropdow-list' }}
          triggerProps={{
            'data-testid': 'dropdown-option-values',
            size: 'base',
          }}
          onChange={(value: FormOption) => {
            setInput(value.value);
          }}
        />
      )}
    </div>
  );
};

export default filterInput;
