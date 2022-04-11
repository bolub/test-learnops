import {
  createAsyncThunk,
  createSlice,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import usersManagementAPI from './usersManagementAPI';
import get from 'lodash/get';
import {
  LDUser,
  AllUsersType,
  SortingType,
  Status,
  UserAvatars,
  LDTeam,
} from 'utils/customTypes';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import { SLICE_STATUS, USER_STATUS, USER_TYPES } from 'utils/constants';
import { selectOrganizationLicense } from 'state/Organization/organizationSlice';
import { selectCurrentLearningTeam } from 'state/LearningTeams/learningTeamsSlice';
import { SelectComapnyName } from 'state/Organization/organizationSlice';
import { selectUserId } from 'state/User/userSlice';

interface Users {
  ldUsers: LDUser[];
  allUsers: AllUsersType[];
  usersSorting: {
    orderBy: string[];
    order: SortingType;
  };
  allUsersPagination: {
    limit: number;
    offset: number;
  };
  selectedUser: AllUsersType;
  selectedUserStatus: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: Users = {
  ldUsers: [],
  allUsers: [],
  usersSorting: {
    order: 'asc',
    orderBy: ['data.firstName', 'data.lastName'],
  },
  allUsersPagination: {
    limit: 15,
    offset: 0,
  },
  selectedUser: {
    data: {
      firstName: '',
      lastName: '',
      email: '',
    },
    registeredLearningTeams: [],
    id: '',
    country_iso_3166_1_alpha_2_code: '',
    type: 'ld',
    default_capacity: 0,
    status: '',
    role: 'user',
    disabled_at: '',
    avatar_url: '',
  },
  selectedUserStatus: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getLDUsers = createAsyncThunk(
  'usersManagement/GET_LD_USERS',
  async () => {
    const response = await usersManagementAPI.fetchUsers({ type: 'ld' });
    const data = response.data.map((user: LDUser) => {
      return {
        businessTeam_id: get(user, 'businessTeam_id'),
        avatar_url: get(user, 'avatar_url'),
        data: {
          email: get(user, 'data.email'),
          lastName: get(user, 'data.lastName'),
          firstName: get(user, 'data.firstName'),
          avatar_url: get(user, 'avatar_url'),
        },
        id: get(user, 'id'),
        ldTeam_id: get(user, 'ldTeam_id'),
        status: get(user, 'status'),
      };
    });
    return data;
  }
);

export const getAllUsers = createAsyncThunk(
  'usersManagement/GET_ALL_USERS',
  async () => {
    const { data } = await usersManagementAPI.fetchUsers();
    return data;
  }
);

export const getSelectedUser = createAsyncThunk(
  'usersManagement/GET_USER',
  async (userId: string) => {
    const { data } = await usersManagementAPI.fetchUser(userId);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'usersManagement/UPDATE_USER',
  async ({
    userId,
    updateFields,
  }: {
    userId: string;
    updateFields: Partial<AllUsersType>;
  }) => {
    const { data } = await usersManagementAPI.updateUser(userId, updateFields);
    return data.user;
  }
);

export const assignUserToLearningTeam = createAsyncThunk(
  'usersManagement/ASSIGN_USER_TO_LEARNING_TEAM',
  async ({ userId, teamId }: { userId: string; teamId: string }) => {
    const { data } = await usersManagementAPI.assignUserToLearningTeam(
      userId,
      teamId
    );
    return data.user;
  }
);

export const addUser = createAsyncThunk(
  'usersManagement/ADD_USER',
  async (userData: Partial<AllUsersType>) => {
    const { data } = await usersManagementAPI.createUser(userData);
    return data.user;
  }
);

export const inviteUser = createAsyncThunk(
  'usersManagement/INVITE_USER',
  async (
    {
      userId,
      email,
      firstName,
    }: {
      userId: string;
      email: string;
      firstName: string;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const companyName = SelectComapnyName(state);
    const { data } = await usersManagementAPI.inviteUser(
      userId,
      email,
      firstName,
      companyName
    );
    return data;
  }
);

/* ================================ ACTIONS ================================= */
export const updateUsersPagination = createAction<{
  limit: number;
  offset: number;
}>('usersManagement/UPDATE_USERS_PAGINATION');

export const setUsersOrder = createAction<{
  order: SortingType;
  orderBy: string[];
}>('usersManagement/SET_USERS_ORDER');

export const resetSelectedUser = createAction(
  'usersManagement/RESET_SELECTED_USER'
);
/* ================================= REDUCER ================================ */
const usersManagementSlice = createSlice({
  name: 'usersManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLDUsers.fulfilled, (state, action) => {
        state.ldUsers = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.allUsers = [];
      })
      .addCase(updateUsersPagination, (state, action) => {
        state.allUsersPagination.limit = action.payload.limit;
        state.allUsersPagination.offset = action.payload.offset;
      })
      .addCase(setUsersOrder, (state, action) => {
        state.usersSorting.order = action.payload.order;
        state.usersSorting.orderBy = action.payload.orderBy;
      })
      .addCase(getSelectedUser.fulfilled, (state, action) => {
        state.selectedUserStatus = SLICE_STATUS.IDLE;
        state.selectedUser = action.payload;
      })
      .addCase(getSelectedUser.pending, (state) => {
        state.selectedUserStatus = SLICE_STATUS.LOADING;
      })
      .addCase(getSelectedUser.rejected, (state) => {
        state.selectedUserStatus = SLICE_STATUS.FAILED;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(resetSelectedUser, (state) => {
        state.selectedUser = initialState.selectedUser;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.allUsers = [action.payload].concat(state.allUsers);
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectLDUsers = (state: RootState) => state.users.ldUsers;

export const allUsers = (state: RootState) => state.users.allUsers;

const usersSorting = (state: RootState) => state.users.usersSorting;

const allUsersPagination = (state: RootState) => state.users.allUsersPagination;

export const selectAllUsers = createSelector(
  [allUsers, usersSorting, allUsersPagination],
  (users, sorting, pagination) => {
    let formattedUsers: AllUsersType[] = users.slice(
      pagination.offset,
      pagination.limit
    );
    formattedUsers = formattedUsers.map((user: AllUsersType) => {
      if (user.type === USER_TYPES.BUSINESS) {
        return { ...user, team: get(user, 'businessTeams.title') };
      } else if (user.type === USER_TYPES.L_D) {
        const registeredTeams = get(user, 'registeredLearningTeams');
        const teamsArray = registeredTeams.map((team: LDTeam) => team.name);
        return { ...user, team: teamsArray.join(', ') };
      } else {
        return { ...user, team: '-' };
      }
    });

    const total = users.length;
    return {
      data: orderBy(formattedUsers, sorting.orderBy, [
        sorting.order,
        sorting.order,
      ]),
      total,
    };
  }
);

export const selectSelectedUser = (state: RootState) =>
  state.users.selectedUser;

export const selectUserStatus = (state: RootState) =>
  state.users.selectedUserStatus;

export const selectLDUsersForDropdown = createSelector(
  [selectLDUsers, selectCurrentLearningTeam],
  (users, team) => {
    if (!isEmpty(team)) {
      return users.reduce<UserAvatars[]>((ldUsers, user) => {
        if (!team.ldTeamMembers?.find((member) => member.id === user.id)) {
          return ldUsers.concat({
            label: `${user.data.firstName} ${user.data.lastName}`,
            avatar: {
              imageSrc: user.avatar_url,
              initial: `${user.data.firstName.charAt(
                0
              )}${user.data.lastName.charAt(0)}`,
            },
            value: user.id,
          });
        }
        return ldUsers;
      }, []);
    } else {
      return users.map((user) => {
        return {
          label: `${user.data.firstName} ${user.data.lastName}`,
          avatar: {
            imageSrc: user.avatar_url,
            initial: `${user.data.firstName.charAt(
              0
            )}${user.data.lastName.charAt(0)}`,
          },
          value: user.id,
        };
      }) as UserAvatars[];
    }
  }
);

export const selectDisabledDate = (state: RootState) =>
  state.users?.selectedUser?.disabled_at;

export const selectActiveLDUsers = (state: RootState) =>
  state.users.ldUsers.filter(
    (user) =>
      user.status === USER_STATUS.INVITED ||
      user.status === USER_STATUS.REGISTERED
  );

export const selectAvailableLicenses = createSelector(
  [selectActiveLDUsers, selectOrganizationLicense],
  (users, licenses) => {
    const licencesLeft = licenses.license_number - users.length;
    return licencesLeft > 0 ? licencesLeft : 0;
  }
);

export const selectUserById = createSelector(
  [allUsers, selectUserId],
  (users: AllUsersType[], userId: string | undefined) => {
    if (userId) {
      return users.find((user: AllUsersType) => user.id === userId);
    }
    return undefined;
  }
);

export default usersManagementSlice.reducer;
