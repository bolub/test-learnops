import { useCallback, useEffect, useState, Fragment, useMemo } from 'react';
import {
  Button,
  Tabs,
  Modal,
  TableOperationHeader,
  TableFilter,
  TableFilterProps,
  FormItem,
  TextField,
  Datepicker,
  Typography,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import camelCase from 'lodash/camelCase';
import { Link } from 'react-router-dom';
import {
  selectTeamRequests,
  selectUserRequests,
  updateTeamRequestPagination,
  updateMyRequestPagination,
  exportCsv,
  searchByTitle,
  setOrder,
  getAllRequests,
  getUserRequests,
  setTeamRequestFilters,
  setUserRequestFilters,
} from 'state/Requests/requestSlice';
import {
  PATHS,
  USER_TYPES,
  REQUEST_COLUMNS,
  LD_USER_PERMISSIONS,
  BUSINESS_USER_PERMISSIONS,
  COLUMN_OPTION_TYPES,
} from 'utils/constants';
import { isNotEmptyArray } from '../helpers';
import searchNoReturns from 'assets/icons/search-no-returns.svg';
import RenderNoRecords from './components/NoRecords';
import csvExportHelpers from './csvExportHelpers';
import { selectUserType } from 'state/User/userSlice';
import Pagination from 'Organisms/Pagination';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import RequestsTable from './components/RequestsTable';
import { filter, Request } from 'utils/customTypes';
import NoRequestsSvg from 'assets/icons/empty-requests.svg';
import { selectOrganizationSettings } from 'state/Organization/organizationSlice';
import get from 'lodash/get';

type ColumnOption = {
  name: string;
  value: string;
  operators: {
    value: string;
    name: string;
  }[];
  type: string;
};

const MyRequests = ({
  columnOptions,
  fetchUserRequestWithPagination,
  handleSearch,
  handleSort,
  isSearch,
  onExportHandler,
  selectedRequests,
  setModalOpen,
  setModalProps,
  setSelectedRequests,
  setShowFilter,
  showFilter,
  tableFilterInput,
  userRequests,
  value,
}: {
  columnOptions: ColumnOption[];
  fetchUserRequestWithPagination: (params: any) => void;
  handleSearch: (value: string) => void;
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
  isSearch: boolean;
  onExportHandler: () => void;
  selectedRequests: string[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalProps: React.Dispatch<React.SetStateAction<{}>>;
  setSelectedRequests: React.Dispatch<React.SetStateAction<string[]>>;
  setShowFilter: (value: React.SetStateAction<boolean>) => void;
  showFilter: boolean;
  tableFilterInput: TableFilterProps['filterInputElement'];
  userRequests: {
    data: Request[];
    total: number;
  };
  value: string;
}) => {
  const dispatch = useDispatch();
  return (
    <>
      <TableOperationHeader
        inputValue={value}
        setInputValue={handleSearch}
        className='border-0 bg-neutral-white'
        onExport={onExportHandler}
        showFilterComponent={showFilter}
        onToggleFilter={() => setShowFilter((prevShow) => !prevShow)}
        filterComponent={
          <div className='bg-neutral-white'>
            <TableFilter
              columnOptions={columnOptions}
              filterVisible={showFilter}
              filterAction={(filters: filter[]) =>
                dispatch(setUserRequestFilters(filters))
              }
              filterInputElement={tableFilterInput}
            />
          </div>
        }
      />
      {userRequests.data.length <= 0 ? (
        <Fragment>
          {!isSearch ? (
            <RenderNoRecords
              imageSrc={NoRequestsSvg}
              caption={intl.get('REQUESTS_LIST_PAGE.CREATE_MANAGE_REQUESTS')}
            >
              <Link to={PATHS.REQUEST_PAGE}>
                <Button className='mt-2 mx-auto' size='small'>
                  {intl.get('REQUESTS_LIST_PAGE.GET_STARTED')}
                </Button>
              </Link>
            </RenderNoRecords>
          ) : (
            <RenderNoRecords
              dataCy='no-request-found'
              imageSrc={searchNoReturns}
              caption={intl.get('REQUESTS_LIST_PAGE.NO_RECORDS')}
            />
          )}
        </Fragment>
      ) : (
        <RequestsTable
          data={userRequests.data}
          setModalOpen={setModalOpen}
          setModalProps={setModalProps}
          setSelectedRequests={setSelectedRequests}
          selectedRequests={selectedRequests}
          handleSort={handleSort}
        />
      )}
      <Pagination
        total={userRequests.total}
        onChange={fetchUserRequestWithPagination}
      />
    </>
  );
};

const RequestsListPage = () => {
  const dispatch = useDispatch();
  const allRequests = useSelector(selectTeamRequests);
  const userRequests = useSelector(selectUserRequests);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const initValue: string[] = [];
  const [selectedRequests, setSelectedRequests] = useState(initValue);
  const [value, setValue] = useState('');
  const userType = useSelector(selectUserType);
  const isLDUser = useMemo(() => userType === USER_TYPES.L_D, [userType]);
  const isBusinessUser = useMemo(
    () => userType === USER_TYPES.BUSINESS,
    [userType]
  );
  const [isSearch, setIsSearch] = useState(false);
  const organizationSettings = useSelector(selectOrganizationSettings);
  const showTeamRequestsTab =
    (get(organizationSettings, 'teamRequestsTab', true) && isBusinessUser) ||
    !isBusinessUser;

  useEffect(() => {
    dispatch(getAllRequests());
    dispatch(getUserRequests());
  }, [dispatch]);

  useEffect(() => {
    setValue('');
    dispatch(searchByTitle(''));
    setIsSearch(false);
  }, [tabIndex, dispatch]);

  const fetchRequestWithPagination = useCallback(
    (params) => {
      dispatch(updateTeamRequestPagination(params));
    },
    [dispatch]
  );

  const fetchUserRequestWithPagination = useCallback(
    (params) => {
      dispatch(updateMyRequestPagination(params));
    },
    [dispatch]
  );

  const handleSearch = (value: string) => {
    setValue(value);
    const searchParam = value.toLowerCase();
    dispatch(searchByTitle(searchParam));
    setIsSearch(true);
  };

  const handleSort = (orderByParam: string, order: 'desc' | 'asc') => {
    dispatch(setOrder({ order, orderBy: orderByParam }));
  };

  const getSelectedRequests = () => {
    const hasSelections = isNotEmptyArray(selectedRequests);
    switch (tabIndex) {
      case 0:
        if (hasSelections) {
          return allRequests.data.filter(
            (request) => request.id && selectedRequests.includes(request.id)
          );
        } else {
          return allRequests.data;
        }
      case 1:
        if (hasSelections) {
          return userRequests.data.filter(
            (request) => request.id && selectedRequests.includes(request.id)
          );
        } else {
          return userRequests.data;
        }
      default:
        return [];
    }
  };

  const onExportHandler = () => {
    const requestsToExport = getSelectedRequests();

    const csvHeaders = csvExportHelpers.generateCsvHeaders(isLDUser);
    const csvData = csvExportHelpers.generateCsvData(
      requestsToExport,
      isLDUser
    );
    const fileName = csvExportHelpers.getFileName();
    dispatch(exportCsv({ csvHeaders, csvData, fileName }));
  };

  const columnOptions: ColumnOption[] = useMemo(() => {
    const visibleColumns = [
      ...REQUEST_COLUMNS,
      ...(isLDUser ? LD_USER_PERMISSIONS : []),
      ...(isBusinessUser ? BUSINESS_USER_PERMISSIONS : []),
    ];

    return visibleColumns.map((column) => {
      return {
        name: intl.get(
          `REQUESTS_LIST_PAGE.TABLE.FILTER.${camelCase(column.value)}`
        ),
        type: COLUMN_OPTION_TYPES.TEXT,
        ...column,
        operators: column.operators.map((operator) => ({
          name: intl.get(`OPERATORS.${operator}`),
          value: operator,
        })),
      };
    });
  }, [isLDUser, isBusinessUser]);

  const tableFilterInput: TableFilterProps['filterInputElement'] = (
    column,
    filterInput,
    setInput,
    operator
  ) => {
    return (
      <Fragment>
        {column.type === COLUMN_OPTION_TYPES.TEXT && (
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

  return (
    <div className='flex flex-col h-full'>
      <Modal
        isOpen={modalOpen}
        aria-label={intl.get('REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.TITLE')}
        {...modalProps}
      />
      <PageTitle
        titleComponent={intl.get('REQUESTS_LIST_PAGE.TITLE')}
        headerChildren={
          <Link to={PATHS.REQUEST_PAGE} data-cy='add-request-button'>
            <Button>{intl.get('REQUESTS_LIST_PAGE.ADD_REQUEST_BUTTON')}</Button>
          </Link>
        }
      />
      {showTeamRequestsTab ? (
        <Tabs
          className='mt-4 px-6 pb-20 overflow-y-auto flex-grow'
          data-cy='request-tabs'
          data={[
            {
              label: isBusinessUser
                ? intl.get('REQUESTS_LIST_PAGE.SUB_NAV.TEAM_REQUESTS')
                : intl.get('REQUESTS_LIST_PAGE.SUB_NAV.TEAM_BOARD'),
              content: (
                <Fragment>
                  <TableOperationHeader
                    inputValue={value}
                    setInputValue={handleSearch}
                    className='border-0 bg-neutral-white'
                    onExport={onExportHandler}
                    showFilterComponent={showFilter}
                    onToggleFilter={() =>
                      setShowFilter((prevShow) => !prevShow)
                    }
                    filterComponent={
                      <div className='bg-neutral-white'>
                        <TableFilter
                          columnOptions={columnOptions}
                          filterVisible={showFilter}
                          filterAction={(filters: filter[]) =>
                            dispatch(setTeamRequestFilters(filters))
                          }
                          filterInputElement={tableFilterInput}
                        />
                      </div>
                    }
                  />
                  {allRequests.data.length <= 0 ? (
                    <Fragment>
                      {!isSearch ? (
                        <RenderNoRecords
                          imageSrc={NoRequestsSvg}
                          caption={intl.get(
                            'REQUESTS_LIST_PAGE.CREATE_MANAGE_REQUESTS'
                          )}
                        >
                          <Link to={PATHS.REQUEST_PAGE}>
                            <Button className='mt-2 mx-auto' size='small'>
                              {intl.get('REQUESTS_LIST_PAGE.GET_STARTED')}
                            </Button>
                          </Link>
                        </RenderNoRecords>
                      ) : (
                        <RenderNoRecords
                          dataCy='no-request-found'
                          imageSrc={searchNoReturns}
                          caption={intl.get('REQUESTS_LIST_PAGE.NO_RECORDS')}
                        />
                      )}
                    </Fragment>
                  ) : (
                    <RequestsTable
                      data={allRequests.data}
                      setModalOpen={setModalOpen}
                      setModalProps={setModalProps}
                      setSelectedRequests={setSelectedRequests}
                      selectedRequests={selectedRequests}
                      handleSort={handleSort}
                    />
                  )}
                  <Pagination
                    total={allRequests.total}
                    onChange={fetchRequestWithPagination}
                  />
                </Fragment>
              ),
            },
            {
              label: isBusinessUser
                ? intl.get('REQUESTS_LIST_PAGE.SUB_NAV.MY_REQUESTS')
                : intl.get('REQUESTS_LIST_PAGE.SUB_NAV.MY_BOARD'),
              content: (
                <MyRequests
                  columnOptions={columnOptions}
                  fetchUserRequestWithPagination={
                    fetchUserRequestWithPagination
                  }
                  handleSearch={handleSearch}
                  handleSort={handleSort}
                  isSearch={isSearch}
                  onExportHandler={onExportHandler}
                  selectedRequests={selectedRequests}
                  setModalOpen={setModalOpen}
                  setModalProps={setModalProps}
                  setSelectedRequests={setSelectedRequests}
                  setShowFilter={setShowFilter}
                  showFilter={showFilter}
                  tableFilterInput={tableFilterInput}
                  userRequests={userRequests}
                  value={value}
                />
              ),
            },
          ]}
          defaultIndex={0}
          tabListProps={{ className: 'max-w-sm mb-4' }}
          type='tab'
          onChange={(index: number) => setTabIndex(index)}
        />
      ) : (
        <div className='mt-4 px-6 pb-20 overflow-y-auto flex-grow'>
          <Typography
            variant='h6'
            weight='medium'
            className='text-neutral-dark mb-5'
          >
            {intl.get('REQUESTS_LIST_PAGE.SUB_NAV.MY_REQUESTS')}
          </Typography>

          <MyRequests
            columnOptions={columnOptions}
            fetchUserRequestWithPagination={fetchUserRequestWithPagination}
            handleSearch={handleSearch}
            handleSort={handleSort}
            isSearch={isSearch}
            onExportHandler={onExportHandler}
            selectedRequests={selectedRequests}
            setModalOpen={setModalOpen}
            setModalProps={setModalProps}
            setSelectedRequests={setSelectedRequests}
            setShowFilter={setShowFilter}
            showFilter={showFilter}
            tableFilterInput={tableFilterInput}
            userRequests={userRequests}
            value={value}
          />
        </div>
      )}
    </div>
  );
};

export default RequestsListPage;
