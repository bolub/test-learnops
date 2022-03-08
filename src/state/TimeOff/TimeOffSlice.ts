import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TimeOffAPI from './timeOffApi';
import { RootState } from 'state/store';
import { Status, TimeOff, TimeOffData } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';

interface timeOffState {
  timeOffs: TimeOffData[];
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: timeOffState = {
  timeOffs: [],
  status: 'idle',
};

/* ============================== REDUX THUNK =============================== */

export const userCreateTimeOff = createAsyncThunk(
  'timeOff/CREATE_TIMEOFF',
  async (newTimeOff: TimeOff) => {
    const { data, code } = await TimeOffAPI.createTimeOff(newTimeOff);
    if (code !== 200) {
      throw new Error('Could not create time off');
    }
    return data;
  }
);

export const getUserTimeOffs = createAsyncThunk(
  'timeOff/GET_USER_TIME_OFFS',
  async (userId: string) => {
    const { data, code } = await TimeOffAPI.fetchUserTimeOffs(userId);
    if (code !== 200) {
      throw new Error('Could not fetch time off');
    }
    return data;
  }
);

export const deleteUserTimeOff = createAsyncThunk(
  'timeOff/DELETE_USER_TIME_OFF',
  async (timeOffId: string) => {
    const { code } = await TimeOffAPI.deleteTimeOff(timeOffId);
    if (code !== 200) {
      throw new Error('Could not delete time off data');
    }
    return timeOffId;
  }
);

/* ================================= REDUCER ================================ */
const timeOffSlice = createSlice({
  name: 'timeOff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userCreateTimeOff.pending, (state, action) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(userCreateTimeOff.rejected, (state, action) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(userCreateTimeOff.fulfilled, (state, action) => {
        state.timeOffs = [...state.timeOffs, action.payload];
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getUserTimeOffs.pending, (state, action) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getUserTimeOffs.rejected, (state, action) => {
        state.timeOffs = [];
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getUserTimeOffs.fulfilled, (state, action) => {
        state.timeOffs = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(deleteUserTimeOff.pending, (state, action) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(deleteUserTimeOff.rejected, (state, action) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(deleteUserTimeOff.fulfilled, (state, action) => {
        state.timeOffs = state.timeOffs.filter(
          (timeOff) => timeOff.id !== action.payload
        );
        state.status = SLICE_STATUS.IDLE;
      });
  },
});

/* =============================== SELECTORS ================================ */

export const selectTimeOffs = (state: RootState) => state.timeOff.timeOffs;

export const selectTimeOffDeletionStatus = (state: RootState) =>
  state.timeOff.status;
export default timeOffSlice.reducer;
