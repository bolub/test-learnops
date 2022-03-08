import React, { useState, useMemo, Fragment } from 'react';
import intl from 'react-intl-universal';
import {
  TableOperationHeader,
  TableFilter,
  TableFilterProps,
  FormItem,
  TextField,
  Datepicker,
} from '@getsynapse/design-system';
import { searchByTitle } from 'state/Projects/projectsSlice';
import { useDispatch } from 'react-redux';
import { filter, ProjectsTableTab } from 'utils/customTypes';
import {
  PROJECTS_TABLE_FILTER_OPTIONS,
  COLUMN_OPTION_TYPES,
} from 'utils/constants';

type column_keys = keyof typeof PROJECTS_TABLE_FILTER_OPTIONS;

const TableHeaderFilters: React.FC<{
  headerColumns: string[];
  onUpdateFilters: (filters: filter[]) => void;
  table: ProjectsTableTab;
  onExport: () => void;
  exportEnabled?: Boolean;
}> = ({
  headerColumns,
  onUpdateFilters,
  table,
  onExport,
  exportEnabled = false,
}) => {
  const [shouldDisplayFilterComponent, setShouldDisplayFilterComponent] =
    useState(false);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const columnOptions: {
    name: string;
    value: string;
    operators: {
      value: string;
      name: string;
    }[];
    type: string;
  }[] = useMemo(() => {
    return headerColumns.map((column) => {
      const key = column as column_keys;
      const filter = { ...PROJECTS_TABLE_FILTER_OPTIONS[key] };
      return {
        name: intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${column}`),
        type: filter.type,
        value: filter.value,
        operators: filter.operators.map((operator) => ({
          name: intl.get(`OPERATORS.${operator}`),
          value: operator,
        })),
      };
    });
  }, [headerColumns]);

  const tableFilterInput: TableFilterProps['filterInputElement'] = (
    column,
    filterInput,
    setInput,
    operator
  ) => {
    return (
      <Fragment>
        {column.type === 'text' && (
          <FormItem
            label={intl.get('FILTER_GENERAL.VALUE')}
            component='div'
            className='flex-grow'
          >
            <TextField
              name='table-header__search-input'
              placeholder={intl.get('FILTER_GENERAL.INPUT_VALUE')}
              state='default'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
              }}
              value={filterInput as string}
              data-testid='filter__text-inputs'
            />
          </FormItem>
        )}
        {column.type === COLUMN_OPTION_TYPES.DATE && (
          <div data-testid='date__picker' className='flex-grow'>
            <Datepicker
              canSelectRange={operator ? operator.value === 'BETWEEN' : true}
              endDateLabel={intl.get('FILTER_GENERAL.TO')}
              onPickDate={(event: any) => {
                setInput(event);
              }}
              placeholder={intl.get('FILTER_GENERAL.SELECT_DATE')}
              startDateLabel={intl.get('FILTER_GENERAL.FROM')}
            />
          </div>
        )}
      </Fragment>
    );
  };

  const handleSearch = (value: string) => {
    setValue(value);
    const searchParam = value.toLowerCase();
    dispatch(searchByTitle(searchParam, table));
  };

  return (
    <TableOperationHeader
      className='border-0 rounded-b-none bg-neutral-white'
      showFilterComponent={shouldDisplayFilterComponent}
      inputValue={value}
      setInputValue={handleSearch}
      onExport={onExport}
      onToggleFilter={() =>
        setShouldDisplayFilterComponent((prevState) => !prevState)
      }
      exportButtonProps={{
        disabled: !exportEnabled,
      }}
      filterComponent={
        <div className='bg-neutral-white'>
          <TableFilter
            columnOptions={columnOptions}
            filterVisible={shouldDisplayFilterComponent}
            filterAction={onUpdateFilters}
            filterInputElement={tableFilterInput}
          />
        </div>
      }
    />
  );
};

export default TableHeaderFilters;
