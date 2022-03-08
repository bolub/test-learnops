import {
  createAsyncThunk,
  createSlice,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import moment from 'moment';
import { filter, rangeDate, Request, SortingType } from 'utils/customTypes';
import { COLUMN_OPTION_TYPES } from 'utils/constants';
import { RootState } from 'state/store';
import RequestAPI from './requestAPI';

interface RequestsState {
  requests: Request[];
  userRequests: Request[];
  search: {
    title?: string;
  };
  sorting: {
    orderBy: string;
    order: SortingType;
  };
  teamRequests: {
    limit: number;
    offset: number;
    filters?: filter[];
  };
  myRequests: {
    limit: number;
    offset: number;
    filters?: filter[];
  };
}

/* ============================= INITIAL STATE ============================== */
const initialState: RequestsState = {
  requests: [],
  userRequests: [],
  search: {
    title: '',
  },
  sorting: {
    order: 'asc',
    orderBy: '',
  },
  teamRequests: {
    limit: 15,
    offset: 1,
  },
  myRequests: {
    limit: 15,
    offset: 1,
  },
};

const requestAPI = RequestAPI;

/* ============================== REDUX THUNK =============================== */
export const getAllRequests = createAsyncThunk(
  'requests/GET_REQUESTS',
  async (params?: { status?: string }) => {
    const response = await requestAPI.fetchAllRequests({
      status: 'submitted,approved,rejected,canceled,pending_cancellation',
      ...params,
    });
    return response.data;
  }
);

export const getUserRequests = createAsyncThunk(
  'requests/GET_USER_REQUESTS',
  async (params?: { status?: string }) => {
    const response = await requestAPI.fetchUserRequests({
      status: 'submitted,approved,rejected,canceled,pending_cancellation',
      ...params,
    });
    return response.data;
  }
);

export const deleteRequest = createAsyncThunk(
  'requests/DELETE_REQUEST',
  async (requestId: string) => {
    const response = await requestAPI.deleteRequest(requestId);
    return response.id;
  }
);

export const exportCsv = createAsyncThunk(
  'requests/EXPORT_CSV',
  async (exportData: { csvHeaders: any; csvData: any; fileName: string }) => {
    const { csvHeaders, csvData, fileName } = exportData;
    const response = await requestAPI.exportCsv(csvHeaders, csvData, fileName);
    return response.data.fileLocation;
  }
);

export const downloadRequest = createAsyncThunk(
  'requests/DOWNLOAD_REQUEST',
  async (exportData: { requestId: string; fileName: string }) => {
    const { requestId, fileName } = exportData;
    const response = await requestAPI.downloadRequest(requestId, fileName);
    return response.data.fileLocation;
  }
);

/* ================================ ACTIONS ================================= */
export const searchByTitle = createAction<string>('requests/SEARCH_BY_TITLE');

export const setOrder = createAction<{
  order: SortingType;
  orderBy: string;
}>('requests/SET_ORDER');

export const updateTeamRequestPagination = createAction<{
  limit: number;
  offset: number;
}>('requests/UPDATE_TEAM_PAGINATION');

export const updateMyRequestPagination = createAction<{
  limit: number;
  offset: number;
}>('requests/UPDATE_MY_PAGINATION');

export const setTeamRequestFilters = createAction(
  'requests/SET_TEAM_FILTERS',
  (filters: filter[]) => {
    const formatedFilters = filters.map((filter) => {
      const dateRange = filter.value as rangeDate;
      if (filter.type === COLUMN_OPTION_TYPES.DATE) {
        return {
          ...filter,
          value: {
            startDate: new Date(dateRange.startDate).toDateString(),
            endDate: new Date(dateRange.endDate).toDateString(),
          },
        };
      } else {
        return filter;
      }
    });
    return {
      payload: formatedFilters,
    };
  }
);

export const setUserRequestFilters = createAction(
  'requests/SET_USER_FILTERS',
  (filters: filter[]) => {
    const formatedFilters = filters.map((filter) => {
      const dateRange = filter.value as rangeDate;
      if (filter.type === COLUMN_OPTION_TYPES.DATE) {
        return {
          ...filter,
          value: {
            startDate: new Date(dateRange.startDate).toDateString(),
            endDate: new Date(dateRange.endDate).toDateString(),
          },
        };
      } else {
        return filter;
      }
    });
    return {
      payload: formatedFilters,
    };
  }
);

/* ================================= REDUCER ================================ */
const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(getUserRequests.fulfilled, (state, action) => {
        state.userRequests = action.payload;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (request) => request.id !== action.payload
        );
        state.userRequests = state.userRequests.filter(
          (request) => request.id !== action.payload
        );
      })
      .addCase(exportCsv.fulfilled, (state, action) => {
        window.location.href = action.payload;
      })
      .addCase(searchByTitle, (state, action) => {
        state.search.title = action.payload;
      })
      .addCase(setOrder, (state, action) => {
        state.sorting.order = action.payload.order;
        state.sorting.orderBy = action.payload.orderBy;
      })
      .addCase(downloadRequest.fulfilled, (state, action) => {
        window.location.href = action.payload;
      })
      .addCase(updateTeamRequestPagination, (state, action) => {
        state.teamRequests.limit = action.payload.limit;
        state.teamRequests.offset = action.payload.offset;
      })
      .addCase(updateMyRequestPagination, (state, action) => {
        state.myRequests.limit = action.payload.limit;
        state.myRequests.offset = action.payload.offset;
      })
      .addCase(setTeamRequestFilters, (state, action) => {
        state.teamRequests.filters = action.payload;
      })
      .addCase(setUserRequestFilters, (state, action) => {
        state.myRequests.filters = action.payload;
      });
  },
});

/* =============================== SELECTORS ================================ */
const teamRequests = (state: RootState) => state.requestsState.requests;
const userRequests = (state: RootState) => state.requestsState.userRequests;
const searchParams = (state: RootState) => state.requestsState.search;
const sorting = (state: RootState) => state.requestsState.sorting;

const teamRequesPagination = (state: RootState) =>
  state.requestsState.teamRequests;
const myRequestsPagination = (state: RootState) =>
  state.requestsState.myRequests;

const teamRequestFilters = (state: RootState) =>
  state.requestsState.teamRequests.filters;

const userRequestFilters = (state: RootState) =>
  state.requestsState.myRequests.filters;

export const compare = (
  criteria: boolean,
  complies: boolean | undefined,
  logic?: string
) => {
  if (complies !== undefined) {
    return logic === 'AND' ? complies && criteria : complies || criteria;
  } else {
    return logic === 'AND' ? criteria : criteria;
  }
};

const checkRequestDateFilters = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any
) => {
  const requestDate = moment(
    new Date(columnData.replace(/-/g, '/').replace(/T.+/, ''))
  );
  const rangeDate = filter.value as rangeDate;
  const startDate = new Date(rangeDate.startDate);
  const endDate = new Date(rangeDate.endDate);

  switch (filter.operator) {
    case 'EQUAL':
      return compare(
        requestDate.isSame(startDate, 'days'),
        isGood,
        filter.logic
      );
    case 'GREATER':
      return compare(
        requestDate.isAfter(startDate, 'days'),
        isGood,
        filter.logic
      );
    case 'GREATER_OR_EQUAL':
      return compare(
        requestDate.isSameOrAfter(startDate, 'days'),
        isGood,
        filter.logic
      );
    case 'LESS':
      return compare(
        requestDate.isBefore(startDate, 'days'),
        isGood,
        filter.logic
      );
    case 'LESS_OR_EQUAL':
      return compare(
        requestDate.isSameOrBefore(startDate, 'days'),
        isGood,
        filter.logic
      );
    case 'BETWEEN':
      return compare(
        requestDate.isBetween(startDate, endDate, 'days', '[]'),
        isGood,
        filter.logic
      );
    default:
      return compare(false, isGood, filter.logic);
  }
};

const containEvaluation = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any,
  searchedVal: string
) => {
  switch (filter.column) {
    case 'status':
      switch (searchedVal) {
        case 'in review':
          return compare(
            columnData.includes('submitted'),
            isGood,
            filter.logic
          );
        case 'declined':
          return compare(columnData.includes('rejected'), isGood, filter.logic);
        default:
          return compare(
            columnData.includes(filter.value),
            isGood,
            filter.logic
          );
      }
    case 'owners':
      const hasOwner = columnData.find(
        (owner: { data: { firstName: string; lastName: string } }) => {
          const ownerName = `${get(owner, 'data.firstName', ' ')} ${get(
            owner,
            'data.lastName',
            ' '
          )}`.toLocaleLowerCase();
          return ownerName.includes(searchedVal);
        }
      );
      return compare(hasOwner, isGood, filter.logic);
    case 'requester':
      const requesterName = `${get(columnData, 'data.firstName', ' ')} ${get(
        columnData,
        'data.lastName',
        ' '
      )}`.toLocaleLowerCase();
      return compare(requesterName.includes(searchedVal), isGood, filter.logic);
    case 'title':
      const titleSearch: string = filter.value.toString().toLowerCase();
      return compare(
        columnData.toLowerCase().includes(titleSearch),
        isGood,
        filter.logic
      );
    default:
      return compare(columnData.includes(filter.value), isGood, filter.logic);
  }
};

const noContainEvaluation = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any,
  searchedVal: string
) => {
  switch (filter.column) {
    case 'status':
      switch (searchedVal) {
        case 'in review':
          return compare(
            !columnData.includes('submitted'),
            isGood,
            filter.logic
          );
        case 'declined':
          return compare(
            !columnData.includes('rejected'),
            isGood,
            filter.logic
          );
        default:
          return compare(
            !columnData.includes(filter.value),
            isGood,
            filter.logic
          );
      }
    case 'owners':
      const hasOwner = columnData.find(
        (owner: { data: { firstName: string; lastName: string } }) => {
          const ownerName = `${get(owner, 'data.firstName', ' ')} ${get(
            owner,
            'data.lastName',
            ' '
          )}`.toLocaleLowerCase();
          return ownerName.includes(searchedVal);
        }
      );
      return compare(!hasOwner, isGood, filter.logic);
    case 'requester':
      const requesterName = `${get(columnData, 'data.firstName', ' ')} ${get(
        columnData,
        'data.lastName',
        ' '
      )}`.toLocaleLowerCase();
      return compare(
        !requesterName.includes(searchedVal),
        isGood,
        filter.logic
      );
    default:
      return compare(!columnData.includes(filter.value), isGood, filter.logic);
  }
};

const checkRequestMatchFilter = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any
) => {
  let searchedVal = (filter.value as string).toLocaleLowerCase();
  switch (filter.operator) {
    case 'CONTAINS':
      return containEvaluation(filter, isGood, columnData, searchedVal);
    case 'DOESNT_CONTAIN':
      return noContainEvaluation(filter, isGood, columnData, searchedVal);
    case 'EQUAL':
      return compare(columnData === filter.value, isGood, filter.logic);
    case 'GREATER':
      return compare(columnData > +filter.value, isGood, filter.logic);
    case 'GREATER_OR_EQUAL':
      return compare(columnData >= +filter.value, isGood, filter.logic);
    case 'LESS':
      return compare(columnData < +filter.value, isGood, filter.logic);
    case 'LESS_OR_EQUAL':
      return compare(columnData <= +filter.value, isGood, filter.logic);
    case 'BETWEEN':
      return compare(false, isGood, filter.logic);
    default:
      return compare(false, isGood, filter.logic);
  }
};

export const selectTeamRequests = createSelector(
  [
    teamRequests,
    searchParams,
    sorting,
    teamRequesPagination,
    teamRequestFilters,
  ],
  (requests, search, sorting, pagination, filters) => {
    let teamRequests, total;
    const hasFilters = !isEmpty(filters);

    if (hasFilters || search.title) {
      teamRequests = requests.filter((request) => {
        let hasTitle = false;
        let isGood: boolean | undefined;

        if (search.title) {
          hasTitle =
            request.title?.toLocaleLowerCase().includes(search.title!) ||
            request.description?.toLocaleLowerCase().includes(search.title!) ||
            hasTitle;
        }

        if (hasFilters) {
          filters?.forEach((filter) => {
            if (filter.column) {
              const columnData = get(request, filter.column, '');
              if (columnData) {
                isGood =
                  filter.type === COLUMN_OPTION_TYPES.DATE
                    ? checkRequestDateFilters(filter, isGood, columnData)
                    : checkRequestMatchFilter(filter, isGood, columnData);
              }
            }
          });
        }

        if (search.title && hasFilters) {
          return hasTitle && isGood;
        } else if (search.title && !hasFilters) {
          return hasTitle;
        } else if (!search.title && hasFilters) {
          return isGood;
        } else {
          return false;
        }
      });

      total = teamRequests.length;
    } else {
      teamRequests = requests;
      total = requests.length;
    }

    return {
      data: orderBy(
        teamRequests.slice(pagination.offset, pagination.limit),
        [sorting.orderBy],
        [sorting.order]
      ),
      total,
    };
  }
);

export const selectUserRequests = createSelector(
  [
    userRequests,
    searchParams,
    sorting,
    myRequestsPagination,
    userRequestFilters,
  ],
  (requests, search, sorting, pagination, filters) => {
    let userRequests, total;
    const hasFilters = !isEmpty(filters);

    if (hasFilters || search.title) {
      userRequests = requests.filter((request) => {
        let hasTitle = false;
        let isGood: boolean | undefined;

        if (search.title) {
          hasTitle =
            request.title?.toLocaleLowerCase().includes(search.title!) ||
            request.description?.toLocaleLowerCase().includes(search.title!) ||
            hasTitle;
        }

        if (hasFilters) {
          filters?.forEach((filter) => {
            if (filter.column) {
              const columnData = get(request, filter.column, '');
              if (columnData) {
                isGood =
                  filter.type === COLUMN_OPTION_TYPES.DATE && columnData
                    ? checkRequestDateFilters(filter, isGood, columnData)
                    : checkRequestMatchFilter(filter, isGood, columnData);
              }
            }
          });
        }

        if (search.title && hasFilters) {
          return hasTitle && isGood;
        } else if (search.title && !hasFilters) {
          return hasTitle;
        } else if (!search.title && hasFilters) {
          return isGood;
        } else {
          return false;
        }
      });

      total = userRequests.length;
    } else {
      userRequests = requests;
      total = requests.length;
    }

    return {
      data: orderBy(
        userRequests.slice(pagination.offset, pagination.limit),
        [sorting.orderBy],
        [sorting.order]
      ),
      total,
    };
  }
);

export const selectRequestsByStatus = (status: string) => (state: RootState) =>
  state.requestsState.requests.filter((request) => request.status === status);

export default requestSlice.reducer;
