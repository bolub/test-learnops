import React, { useState, useMemo } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableOperationHeader,
  TableFilter,
  TableFilterProps,
  TextField,
  FormItem,
  Datepicker,
  Dropdown,
} from '@getsynapse/design-system';
import {
  COLUMN_OPTION_TYPES,
  TASKS_TABLE_FILTER,
  TASK_FIELDS,
  TASK_TYPES,
  TASK_STATUS,
  TASKS_TABLE_TABS,
} from 'utils/constants';
import {
  TaskAssignedUser,
  TasksTableTab,
  filter,
  rangeDate,
} from 'utils/customTypes';
import {
  setFilters,
  setSearchParam,
  setShowReorder,
  teamTasksTableFilters,
} from 'state/Tasks/taskSlice';
import { isEmpty } from 'lodash';

const TasksTableFilters: React.FC<{
  taskTable: TasksTableTab;
  assignees: TaskAssignedUser[];
  onExport: () => void;
  exportEnabled?: Boolean;
}> = ({ taskTable, assignees, onExport, exportEnabled = false }) => {
  const [shouldDisplayFilterComponent, setShouldDisplayFilterComponent] =
    useState(false);
  const dispatch = useDispatch();

  const handleSetFilters = (filters: filter[]) => {
    dispatch(setFilters(filters, taskTable));
  };

  const filterOptions: {
    name: string;
    value: string;
    operators: {
      value: string;
      name: string;
    }[];
    type: 'text' | 'date';
  }[] = useMemo(() => {
    return Object.keys(TASKS_TABLE_FILTER).map((key) => {
      const filter = { ...TASKS_TABLE_FILTER[key] };
      return {
        name: intl.get(`TASKS.TABLE.HEAD.${key}`),
        type: filter.type as 'text' | 'date',
        value: filter.value,
        operators: filter.operators.map((operator: string) => ({
          name: intl.get(`OPERATORS.${operator}`),
          value: operator,
        })),
      };
    });
  }, []);

  const options = useMemo(
    () => ({
      [TASK_FIELDS.TASK_TYPE]: TASK_TYPES.map((type) => ({
        value: type,
        label: type,
      })),
      [TASK_FIELDS.STATUS]: Object.keys(TASK_STATUS).map((key) => ({
        label: intl.get(`TASKS.TASK_DETAIL_PAGE.STATUS_OPTIONS.${key}`),
        value: TASK_STATUS[key],
      })),
      [TASK_FIELDS.DISABLED]: [
        { label: intl.get('TASKS.TABLE.HEAD.DISABLED'), value: true },
        { label: intl.get('TASKS.TABLE.HEAD.ENABLED'), value: false },
      ],
      [TASK_FIELDS.ASSIGNEE_UPDATE]: assignees.map(
        (user: TaskAssignedUser) => ({
          value: user.id,
          label: `${user.data.firstName} ${user.data.lastName}`,
        })
      ),
    }),
    [assignees]
  );

  const tableFilterInput: TableFilterProps['filterInputElement'] = (
    column,
    filterInput,
    setInput,
    operator
  ) => {
    return (
      <FormItem
        label={intl.get('FILTER_GENERAL.VALUE')}
        component='div'
        className='flex-grow'
      >
        {column.type === 'text' && (
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
        )}
        {column.type === COLUMN_OPTION_TYPES.OPTIONS && (
          <Dropdown
            options={options[column.value]}
            listProps={{ 'data-testid': 'filter__options-list' }}
            triggerProps={{
              'data-testid': 'filter__options-input',
              size: 'base',
            }}
            onChange={(value: any) => {
              setInput(value);
            }}
          />
        )}
        {column.type === COLUMN_OPTION_TYPES.DATE && (
          <div data-testid='filter__date-picker' className='flex-grow'>
            <Datepicker
              canSelectRange={operator ? operator.value === 'BETWEEN' : true}
              endDateLabel={intl.get('FILTER_GENERAL.TO')}
              onPickDate={(event: rangeDate) => {
                setInput({
                  startDate: event.startDate as Date,
                  endDate: event.endDate as Date,
                });
              }}
              placeholder={intl.get('FILTER_GENERAL.SELECT_DATE')}
              startDateLabel={intl.get('FILTER_GENERAL.FROM')}
            />
          </div>
        )}
      </FormItem>
    );
  };

  const [searchValue, setSearchValue] = useState('');

  const [showReorderButton, setShowReorderButton] = useState(false);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const searchParam = value.toLowerCase();
    dispatch(setSearchParam(searchParam, taskTable));
  };

  const handleReorderButtonClick = () => {
    setShowReorderButton(!showReorderButton);
    dispatch(setShowReorder(!showReorderButton, taskTable));
  };

  const appliedFilters = useSelector(teamTasksTableFilters);
  return (
    <TableOperationHeader
      className='border-0 rounded-b-none bg-neutral-white'
      onToggleFilter={() =>
        setShouldDisplayFilterComponent((prevState) => !prevState)
      }
      onExport={onExport}
      exportButtonProps={{
        disabled: !exportEnabled || showReorderButton,
      }}
      showFilterComponent={shouldDisplayFilterComponent}
      filterComponent={
        <div className='bg-neutral-white'>
          <TableFilter
            columnOptions={filterOptions}
            filterVisible={shouldDisplayFilterComponent}
            filterAction={handleSetFilters}
            filterInputElement={tableFilterInput}
          />
        </div>
      }
      inputValue={searchValue}
      setInputValue={handleSearch}
      showReorderButton={taskTable === TASKS_TABLE_TABS.TEAM_TASKS}
      onToggleReorderButton={handleReorderButtonClick}
      reorderButtonProps={{
        'aria-pressed': showReorderButton,
        disabled:
          shouldDisplayFilterComponent ||
          searchValue ||
          !isEmpty(appliedFilters),
      }}
      filterButtonProps={{
        disabled: showReorderButton,
      }}
      searchProps={{
        disabled: showReorderButton,
      }}
    />
  );
};

export default TasksTableFilters;
