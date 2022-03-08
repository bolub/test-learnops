import React, { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import {
  TextField,
  Dropdown,
  Button,
  TableFilter,
  TableFilterProps,
  FormItem,
  Datepicker,
} from '@getsynapse/design-system';
import {
  ProjectProcess,
  ProjectsBoardTabs,
  Option,
  filter,
} from 'utils/customTypes';
import {
  BOARD_SORTING_OPTIONS,
  PROJECTS_BOARD_FILTER_OPTIONS,
} from 'utils/constants';
import { selectProjectProcesses } from 'state/Processes/processesSlice';
import {
  setBoardProcess,
  setBoardSorting,
  setBoardSearchParam,
  setBoardFilters,
} from 'state/Projects/projectsSlice';

const BoardHeader: React.FC<{
  boardTab: ProjectsBoardTabs;
  selectedProcessId: string;
  searchParam: string;
}> = ({ selectedProcessId, boardTab, searchParam }) => {
  const dispatch = useDispatch();
  const [shouldDisplayFilter, setShouldDisplayFilter] = useState(false);
  const organizationProjectProcesses = useSelector(selectProjectProcesses);

  const filterOptions: {
    name: string;
    value: string;
    operators: {
      value: string;
      name: string;
    }[];
    type: 'text' | 'date';
  }[] = useMemo(() => {
    return Object.keys(PROJECTS_BOARD_FILTER_OPTIONS).map((key) => {
      const filter = { ...PROJECTS_BOARD_FILTER_OPTIONS[key] };
      return {
        name: intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${key}`),
        type: filter.type as 'text' | 'date',
        value: filter.value,
        operators: filter.operators.map((operator: string) => ({
          name: intl.get(`OPERATORS.${operator}`),
          value: operator,
        })),
      };
    });
  }, []);

  const processesOptions = useMemo(() => {
    return organizationProjectProcesses
      .map((process: ProjectProcess) => ({
        value: process.id,
        label: `${intl.get('PROJECTS_LIST_PAGE.BOARD.VIEW_BY')} ${
          process.processName
        }`,
      }))
      .reverse();
  }, [organizationProjectProcesses]);

  const selectedProcess = useMemo(() => {
    return processesOptions.filter(
      (option: Option) => option.value === selectedProcessId
    );
  }, [processesOptions, selectedProcessId]);

  const onChangeProcess = (option: Option) => {
    dispatch(setBoardProcess(option.value, boardTab));
  };

  const sortingOptions = useMemo(() => {
    return Object.keys(BOARD_SORTING_OPTIONS).map((key) => ({
      value: BOARD_SORTING_OPTIONS[key],
      label: intl.get(`PROJECTS_LIST_PAGE.BOARD.SORTING.${key}`),
    }));
  }, []);

  const handleChangeSorting = (option: Option) => {
    dispatch(setBoardSorting(option.value, boardTab));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBoardSearchParam(event.target.value, boardTab));
  };

  const handleSetFilters = (filters: filter[]) => {
    dispatch(setBoardFilters(filters, boardTab));
  };

  const toggleFilters = () => {
    setShouldDisplayFilter((prevState) => !prevState);
  };

  const tableFilterInput: TableFilterProps['filterInputElement'] = (
    column,
    filterInput,
    setInput,
    operator
  ) => {
    return (
      <React.Fragment>
        {column.type === 'text' && (
          <FormItem label='Value' component='div' className='flex-grow'>
            <TextField
              name='table-header__search-input'
              placeholder='Input Value'
              state='default'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
              }}
              value={filterInput as string}
              data-testid='filter__text-inputs'
            />
          </FormItem>
        )}
        {column.type === 'date' && (
          <div data-testid='date__picker' className='flex-grow'>
            <Datepicker
              canSelectRange={operator ? operator.value === 'BETWEEN' : true}
              endDateLabel='To'
              onPickDate={(event: any) => {
                setInput(event);
              }}
              placeholder='Select date'
              startDateLabel='From'
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className='flex absolute top-0 right-0 mt-4 mr-26'>
        <TextField
          placeholder={intl.get('PROJECTS_LIST_PAGE.BOARD.SEARCH')}
          variant='search'
          height='small'
          className='w-61'
          value={searchParam}
          onChange={handleSearchChange}
          data-cy='board-search-input'
        />
        <div className='ml-2'>
          <Dropdown
            options={processesOptions}
            values={selectedProcess}
            onChange={onChangeProcess}
            triggerProps={{
              placeholder: intl.get('PROJECTS_LIST_PAGE.BOARD.VIEW_BY'),
              className: 'w-47 py-1 min-h-8',
              'data-cy': 'board-process-picker',
            }}
          />
        </div>
        <div className='ml-2'>
          <Dropdown
            options={sortingOptions}
            onChange={handleChangeSorting}
            triggerProps={{
              placeholder: intl.get('PROJECTS_LIST_PAGE.BOARD.SORT_BY'),
              className: 'w-47 py-1 min-h-8',
              'data-cy': 'board-sorting-picker',
            }}
          />
        </div>
        <Button
          iconName='filter-circle'
          iconPosition='left'
          size='small'
          variant='tertiary'
          className={classnames('ml-2 py-0', {
            'bg-neutral-white': shouldDisplayFilter,
          })}
          onClick={toggleFilters}
          data-cy='board-filter-button'
        >
          {intl.get('PROJECTS_LIST_PAGE.BOARD.FILTER')}
        </Button>
      </div>
      <div className='bg-neutral-white' data-cy='board-filter-fields'>
        <TableFilter
          columnOptions={filterOptions}
          filterVisible={shouldDisplayFilter}
          filterAction={handleSetFilters}
          filterInputElement={tableFilterInput}
        />
      </div>
    </React.Fragment>
  );
};

export default BoardHeader;
