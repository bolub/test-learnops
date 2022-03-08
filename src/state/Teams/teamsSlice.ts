import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createAction,
} from '@reduxjs/toolkit';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { RootState } from 'state/store';
import { selectOrganizationId } from 'state/User/userSlice';
import { compare } from 'state/Requests/requestSlice';
import {
  BusinessTeam,
  LearningTeam,
  Owner,
  Status,
  filter,
  SortingType,
} from 'utils/customTypes';
import {
  SLICE_STATUS,
  TABLE_FILTERS_OPERATORS,
  MEMBER_VALUES,
} from 'utils/constants';
import requestAPI from '../Requests/requestAPI';
import teamsAPI from './teamsAPI';
import organizationAPI from 'state/Organization/organizationAPI';
import userAPI from 'state/User/userAPI';

interface Teams {
  businessTeams: BusinessTeam[];
  learningTeams: {
    teams: LearningTeam[];
    pagination: {
      limit: number;
      offset: number;
    };
    sorting: {
      orderBy: string;
      order: SortingType;
    };
    searcParam: string;
    filters?: filter[];
  };
  status: Status;
}
/* ============================= INITIAL STATE ============================== */
const initialState: Teams = {
  businessTeams: [],
  learningTeams: {
    teams: [],
    pagination: {
      limit: 15,
      offset: 0,
    },
    sorting: {
      order: 'asc',
      orderBy: '',
    },
    searcParam: '',
  },
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getOrganization = createAsyncThunk(
  'teams/GET_ORGANIZATION',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const organizationId = selectOrganizationId(state) || '';
    const { data } = await organizationAPI.fetchOrganization(organizationId);
    return data;
  }
);

export const getLDMembers = createAsyncThunk(
  'teams/GET_USERS_IN_LEARNING_TEAM',
  async () => {
    const { data } = await teamsAPI.fetchLDTeams();
    return data;
  }
);

export const updateUser = createAsyncThunk(
  'teams/UPDATE_USER',
  async ({ id, newUser }: { id: string; newUser: Owner }) => {
    const { data } = await userAPI.editUser(id, newUser);
    return { data, userId: id };
  }
);

/* ================================ ACTIONS ================================= */
export const updateLDTeamsPagination = createAction<{
  limit: number;
  offset: number;
}>('teams/UPDATE_LD_TEAMS_PAGINATION');

export const setLDTeamsFilters = createAction<filter[]>(
  'teams/SET_LD_TEAMS_FILTERS'
);

export const setSearchParam = createAction<string>('teams/SET_SEARCH_PARAM');

export const exportCsv = createAsyncThunk(
  'teams/EXPORT_CSV',
  async (exportData: { csvHeaders: any; csvData: any; fileName: string }) => {
    const { csvHeaders, csvData, fileName } = exportData;
    const response = await requestAPI.exportCsv(csvHeaders, csvData, fileName);
    return response.data.fileLocation;
  }
);

/* ================================= REDUCER ================================ */
const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganization.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getOrganization.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.businessTeams = [...get(action, 'payload.businessTeams', [])];
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getLDMembers.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getLDMembers.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getLDMembers.fulfilled, (state, action) => {
        state.learningTeams.teams = [...get(action, 'payload.learningTeams')];
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateLDTeamsPagination, (state, action) => {
        state.learningTeams.pagination.limit = action.payload.limit;
        state.learningTeams.pagination.offset = action.payload.offset;
      })
      .addCase(setLDTeamsFilters, (state, action) => {
        state.learningTeams.filters = action.payload;
      })
      .addCase(setSearchParam, (state, action) => {
        state.learningTeams.searcParam = action.payload
          .toLocaleLowerCase()
          .trim();
      })
      .addCase(updateUser.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.learningTeams.teams = state.learningTeams.teams.map((team) => {
          let newTeam = Object.assign({}, team);
          const userPlacement = team.ldTeamMembers.findIndex(
            (member) => member.id === action.payload.userId
          );
          if (userPlacement !== -1) {
            newTeam.ldTeamMembers[userPlacement] = action.payload.data.user;
          }
          return newTeam;
        });
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(exportCsv.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(exportCsv.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(exportCsv.fulfilled, (state, action) => {
        window.location.href = action.payload;
        state.status = SLICE_STATUS.IDLE;
      });
  },
});

/* =============================== SELECTORS ================================ */
const selectBusinessTeams = (state: RootState) => state.teams.businessTeams;

export const selectFormattedBusinessTeams = createSelector(
  [selectBusinessTeams],
  (businessTeam) =>
    businessTeam.map((team: BusinessTeam) => {
      return {
        value: get(team, 'id'),
        label: get(team, 'title'),
      };
    })
);

export const selectLearningTeams = (state: RootState) =>
  state.teams.learningTeams.teams;

const ldTeamsPagination = (state: RootState) =>
  state.teams.learningTeams.pagination;

const selectSearchParam = (state: RootState) =>
  state.teams.learningTeams.searcParam;

const selectFilters = (state: RootState) => state.teams.learningTeams.filters;

const filterPositive = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any,
  searchedVal: string
) => {
  switch (filter.column) {
    case MEMBER_VALUES.JOB_TITLE:
      return compare(
        columnData
          .toLocaleLowerCase()
          .includes(searchedVal.toLocaleLowerCase()),
        isGood,
        filter.logic
      );
    case MEMBER_VALUES.EMPLOYMENT_TYPE:
      const employmentType = intl.get(`TEAMS.EMPLOYMENT_TYPE.${columnData}`);
      return compare(employmentType === searchedVal, isGood, filter.logic);
    case MEMBER_VALUES.COUNTRY:
      const country = intl.get(`COUNTRIES.${columnData}`);
      return compare(country === searchedVal, isGood, filter.logic);
    case MEMBER_VALUES.HOURLY_RATE:
      return compare(columnData === searchedVal, isGood, filter.logic);
    default:
      return compare(
        columnData
          .toLocaleLowerCase()
          .includes(searchedVal.toLocaleLowerCase()),
        isGood,
        filter.logic
      );
  }
};

const filterNegative = (
  filter: filter,
  isGood: boolean | undefined,
  columnData: any,
  searchedVal: string
) => {
  switch (filter.column) {
    case MEMBER_VALUES.JOB_TITLE:
      return compare(
        !columnData
          .toLocaleLowerCase()
          .includes(searchedVal.toLocaleLowerCase()),
        isGood,
        filter.logic
      );
    case MEMBER_VALUES.EMPLOYMENT_TYPE:
      const employmentType = intl.get(`TEAMS.EMPLOYMENT_TYPE.${columnData}`);
      return compare(employmentType !== searchedVal, isGood, filter.logic);
    case MEMBER_VALUES.COUNTRY:
      const country = intl.get(`COUNTRIES.${columnData}`);
      return compare(country !== searchedVal, isGood, filter.logic);
    case MEMBER_VALUES.HOURLY_RATE:
      return compare(columnData !== searchedVal, isGood, filter.logic);
    default:
      return compare(
        !columnData
          .toLocaleLowerCase()
          .includes(searchedVal.toLocaleLowerCase()),
        isGood,
        filter.logic
      );
  }
};

export const selectLearningTeamsForTable = createSelector(
  [selectLearningTeams, ldTeamsPagination, selectSearchParam, selectFilters],
  (learningTeams, pagination, searchParam, filters) => {
    const hasFilters = !isEmpty(filters);
    let filteredUsers: Owner[] = [];
    let formattedRows: (LearningTeam | Owner)[] = [];
    let total: number = 0;

    learningTeams.forEach((team) => {
      if (searchParam || hasFilters) {
        filteredUsers = team.ldTeamMembers.filter((member) => {
          let hasTitle = false;
          let isGood: boolean | undefined;

          if (searchParam) {
            const name = `${get(member, 'data.firstName')} ${get(
              member,
              'data.lastName'
            )}`;
            hasTitle =
              name.trim().toLocaleLowerCase().includes(searchParam) || hasTitle;
          }

          if (hasFilters) {
            filters?.forEach((filter) => {
              if (filter.column) {
                const columnData = get(member, filter.column, '');
                const searchedVal = filter.value as string;
                if (searchedVal) {
                  switch (filter.operator) {
                    case TABLE_FILTERS_OPERATORS.CONTAINS:
                    case TABLE_FILTERS_OPERATORS.EQUAL:
                      isGood = filterPositive(
                        filter,
                        isGood,
                        columnData,
                        searchedVal
                      );
                      break;
                    case TABLE_FILTERS_OPERATORS.DOESNT_CONTAIN:
                    case TABLE_FILTERS_OPERATORS.NOT_EQUAL:
                      isGood = filterNegative(
                        filter,
                        isGood,
                        columnData,
                        searchedVal
                      );
                      break;
                    case TABLE_FILTERS_OPERATORS.GREATER:
                      isGood = compare(
                        columnData > searchedVal,
                        isGood,
                        filter.logic
                      );
                      break;
                    case TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL:
                      isGood = compare(
                        columnData >= searchedVal,
                        isGood,
                        filter.logic
                      );
                      break;
                    case TABLE_FILTERS_OPERATORS.LESS:
                      isGood = compare(
                        columnData < searchedVal,
                        isGood,
                        filter.logic
                      );
                      break;
                    case TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL:
                      isGood = compare(
                        columnData <= searchedVal,
                        isGood,
                        filter.logic
                      );
                      break;
                    default:
                      isGood = compare(
                        columnData.includes(searchedVal),
                        isGood,
                        filter.logic
                      );
                      break;
                  }
                }
              }
            });
          }

          if (searchParam && hasFilters) {
            return hasTitle && isGood;
          } else if (searchParam && !hasFilters) {
            return hasTitle;
          } else if (!searchParam && hasFilters) {
            return isGood;
          } else {
            return false;
          }
        });

        if (!isEmpty(filteredUsers)) {
          total += filteredUsers.length;
          formattedRows = [...formattedRows, team, ...filteredUsers];
        }
      } else {
        total += team.ldTeamMembers.length;
        formattedRows = [...formattedRows, team, ...team.ldTeamMembers];
      }
    });

    return {
      data: formattedRows.slice(pagination.offset, pagination.limit),
      total: total,
    };
  }
);

export default teamsSlice.reducer;
