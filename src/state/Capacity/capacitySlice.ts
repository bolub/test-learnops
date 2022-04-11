import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { SLICE_STATUS } from 'utils/constants';
import { CapacityEntry, Status } from 'utils/customTypes';
import capacityAPI from './capcityAPI';

interface CapacitySlice {
  value: Record<string, CapacityEntry>;
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: CapacitySlice = {
  value: {},
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getCapacity = createAsyncThunk(
  'capacity/GET_CAPACITY',
  async () => {
    const { data } = await capacityAPI.fetchCapacity();
    return data;
  }
);

/* ================================= REDUCER ================================ */
const capacitySlice = createSlice({
  name: 'capacity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCapacity.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getCapacity.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getCapacity.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = SLICE_STATUS.IDLE;
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectCapacityStatus = (state: RootState) => state.capacity.status;

export const selectCapacity = (state: RootState) => state.capacity.value;

export default capacitySlice.reducer;
