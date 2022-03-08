import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userAPI from './userAPI';
import { RootState } from 'state/store';
import { Status, CurrentUser } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';

interface UserState {
  value: CurrentUser;
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: UserState = {
  value: {},
  status: 'idle',
};

/* ============================== REDUX THUNK =============================== */
export const getUser = createAsyncThunk(
  'user/GET_USER',
  async (email: string) => {
    const response = await userAPI.getUser(email);
    if (isEmpty(response.data.user)) {
      throw new Error('User not in DB');
    }
    const data = {
      id: get(response, 'data.user.id'),
      email: get(response, 'data.user.data.email'),
      full_name: `${get(response, 'data.user.data.firstName')} ${get(
        response,
        'data.user.data.lastName'
      )}`,
      type: get(response, 'data.user.type'),
      organization_id: get(response, 'data.user.organization_id'),
      role: get(response, 'data.user.role'),
      avatar_url: get(response, 'data.user.avatar_url'),
      firstName: get(response, 'data.user.data.firstName'),
      lastName: get(response, 'data.user.data.lastName'),
    };
    return data;
  }
);

/* ================================= REDUCER ================================ */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    RESET_USER: (state) => {
      state.value = initialState.value;
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.value = {};
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = SLICE_STATUS.IDLE;
      });
  },
});

/* ================================ ACTIONS ================================= */
export const { RESET_USER: resetUser } = userSlice.actions;

/* =============================== SELECTORS ================================ */
export const selectUserSliceStatus = (state: RootState) =>
  state.currentUser.status;

export const selectUser = (state: RootState) => state.currentUser.value;

export const selectUserId = (state: RootState) => state.currentUser.value.id;

export const selectUserEmail = (state: RootState) =>
  state.currentUser.value.email;

export const selectOrganizationId = (state: RootState) =>
  state.currentUser.value.organization_id;

export const selectUserType = (state: RootState) =>
  state.currentUser.value.type;

export const selectUserName = (state: RootState) =>
  state.currentUser.value.full_name;

export const selectUserRole = (state: RootState) =>
  state.currentUser.value.role;

export default userSlice.reducer;
