import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {
  Table,
  TableOperationHeader,
  Typography,
  OverflowMenu,
  OverflowMenuItem,
  TableFilter,
  tailwindOverride,
} from '@getsynapse/design-system';
import {
  updateUser,
  exportCsv,
  setLDTeamsFilters,
  setSearchParam,
} from 'state/Teams/teamsSlice';
import { LearningTeam, Owner, filter } from 'utils/customTypes';
import {
  UPDATE_MEMBER_OPTIONS,
  TEAM_MEMBER_COLUMNS,
  COLUMN_OPTION_TYPES,
} from 'utils/constants';
import TableCell from 'Atoms/TableCell';
import TableAvatar from 'Molecules/TableAvatar';
import tableSubHeader from '../helpers/teamSubHeader';
import teamHeader from '../helpers/teamHeader';
import csvExportHelpers from '../helpers/csvExportHelpers';
import EditMemberModal from './EditMemberModal';
import TimeOffModal from './TimeOffModal';
import filterInput from './filterInput';

type TeamsTableProps = {
  learningTeamsRows: (LearningTeam | Owner)[];
};

const TeamsTable = ({ learningTeamsRows }: TeamsTableProps) => {
  const dispatch = useDispatch();
  const [editMemberData, setEditMemberData] = useState<{
    user: Owner;
    isOpen?: boolean;
  }>({
    user: {},
    isOpen: false,
  });
  const [data, setData] = useState<{
    searchParam: string;
    user: Owner;
    isOpen?: boolean;
    showFilter: boolean;
  }>({
    searchParam: '',
    user: {},
    isOpen: false,
    showFilter: false,
  });
  const [timeOffData, setTimeOffData] = useState<{
    username: string;
    userId: string;
    isOpen?: boolean;
  }>({
    username: '',
    userId: '',
    isOpen: false,
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleUserUpdate = useCallback(
    (id: string, newUser: Owner) => {
      dispatch(updateUser({ id, newUser }));
    },
    [dispatch]
  );

  const handleSetFilters = useCallback(
    (filters: filter[]) => {
      dispatch(setLDTeamsFilters(filters));
    },
    [dispatch]
  );

  const handleSearch = (value: string) => {
    setData((prevData) => ({ ...prevData, searchParam: value }));
    dispatch(setSearchParam(value));
  };

  const handleMenuSelect = (
    option: typeof UPDATE_MEMBER_OPTIONS[number],
    user: Owner
  ) => {
    switch (option) {
      case UPDATE_MEMBER_OPTIONS[0]:
        setEditMemberData((prevData) => ({ ...prevData, user, isOpen: true }));
        break;
      case UPDATE_MEMBER_OPTIONS[1]:
        setTimeOffData((prevData) => ({
          ...prevData,
          username: `${get(user, 'data.firstName')} ${get(
            user,
            'data.lastName'
          )}`,
          userId: get(user, 'id', ''),
          isOpen: true,
        }));
        break;
      default:
        break;
    }
  };

  const columnOptions: {
    name: string;
    value: string;
    operators: {
      value: string;
      name: string;
    }[];
    type: string;
  }[] = useMemo(() => {
    const options = TEAM_MEMBER_COLUMNS.slice(1);
    return options.map(
      (column: { value: string; operators: string[]; labelKey: string }) => {
        return {
          name: intl.get(`TEAMS.TABLE.${column.labelKey}`),
          type: COLUMN_OPTION_TYPES.DATE,
          ...column,
          operators: column.operators.map((operator) => ({
            name: intl.get(`OPERATORS.${operator}`),
            value: operator,
          })),
        };
      }
    );
  }, []);

  const handleRowSelect = (selectedRows: string[]) => {
    setSelectedMembers(selectedRows);
  };

  const onExportHandler = () => {
    const csvHeaders = csvExportHelpers.generateCsvHeaders();
    const members = selectedMembers.map((memberId) => {
      const memberIndex = learningTeamsRows.findIndex(
        (element) => element.id === memberId
      );
      if (memberIndex !== -1) {
        return learningTeamsRows[memberIndex];
      } else {
        return memberId;
      }
    });
    const csvData = csvExportHelpers.generateCsvData(members);
    const fileName = csvExportHelpers.getFileName();
    dispatch(exportCsv({ csvHeaders, csvData, fileName }));
  };

  return (
    <div className='mt-4'>
      <EditMemberModal
        {...editMemberData}
        setIsOpen={(value) =>
          setEditMemberData((prevData) => ({ ...prevData, isOpen: value }))
        }
        onUserUpdate={handleUserUpdate}
      />
      <TimeOffModal
        {...timeOffData}
        setIsOpen={(value) =>
          setTimeOffData((prevData) => ({ ...prevData, isOpen: value }))
        }
      />
      <TableOperationHeader
        className='border-0 rounded-b-none bg-neutral-white'
        exportButtonProps={{
          disabled: isEmpty(selectedMembers),
        }}
        onExport={onExportHandler}
        inputValue={data.searchParam}
        setInputValue={handleSearch}
        showFilterComponent={data.showFilter}
        onToggleFilter={() =>
          setData((prevData) => ({
            ...prevData,
            showFilter: !prevData.showFilter,
          }))
        }
        filterComponent={
          <div className='bg-neutral-white'>
            <TableFilter
              columnOptions={columnOptions}
              filterVisible={data.showFilter}
              filterAction={handleSetFilters}
              filterInputElement={filterInput}
            />
          </div>
        }
      />
      <Table
        className='w-full mb-5'
        canSelectRows
        onSelectRows={handleRowSelect}
        data={{
          ...teamHeader(),
          rows: learningTeamsRows.map((element) => {
            if (!get(element, 'name')) {
              return {
                id: get(element, 'id'),
                cells: [
                  {
                    content: (
                      <TableCell
                        className={tailwindOverride(
                          'py-1 flex-1 flex',
                          'text-neutral-black text-sm font-semibold',
                          'items-start justify-between'
                        )}
                      >
                        <TableAvatar
                          user={{
                            ...element,
                            data: {
                              firstName: get(element, 'data.firstName'),
                              lastName: get(element, 'data.lastName'),
                              email: get(element, 'data.email'),
                            },
                          }}
                        />
                      </TableCell>
                    ),
                  },
                  {
                    content: (
                      <Typography className='py-1 text-neutral-black text-sm flex-1'>
                        {get(element, 'data.jobTitle')}
                      </Typography>
                    ),
                  },
                  {
                    content: (
                      <Typography className='py-1 text-neutral-black text-sm flex-1'>
                        {intl.get(
                          `TEAMS.EMPLOYMENT_TYPE.${get(
                            element,
                            'data.employmentType',
                            'UNDEFINED'
                          )}`
                        )}
                      </Typography>
                    ),
                  },
                  {
                    content: (
                      <Typography className='py-1 text-neutral-black text-sm flex-1'>
                        {intl.get(
                          `COUNTRIES.${get(
                            element,
                            'country_iso_3166_1_alpha_2_code',
                            'UNDEFINED'
                          )}`
                        )}
                      </Typography>
                    ),
                  },
                  {
                    content: (
                      <Typography className='py-1 text-neutral-black text-sm flex-1'>
                        {get(element, 'data.rateHour') &&
                          `${get(element, 'data.rateHour')} ${intl.get(
                            'TEAMS.CURRENCY'
                          )}`}
                      </Typography>
                    ),
                  },
                  {
                    content: (
                      <OverflowMenu
                        menuButtonProps={{
                          children: null,
                          'data-testid': 'my-menu-button',
                          className: tailwindOverride(
                            'py-1',
                            'text-neutral-black text-sm font-semibold'
                          ),
                        }}
                        menuListProps={{
                          className: 'shadow-raised',
                        }}
                      >
                        {UPDATE_MEMBER_OPTIONS.map((option) => (
                          <OverflowMenuItem
                            key={option}
                            onSelect={() => handleMenuSelect(option, element)}
                          >
                            {intl.get(`TEAMS.UPDATE_MENU.${option}`)}
                          </OverflowMenuItem>
                        ))}
                      </OverflowMenu>
                    ),
                  },
                ],
              };
            } else {
              return tableSubHeader(get(element, 'name'));
            }
          }),
        }}
      />
    </div>
  );
};

export default TeamsTable;
