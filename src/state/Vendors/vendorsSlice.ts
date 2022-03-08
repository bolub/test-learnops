import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import VendorsAPI from './vendorsAPI';
import { ProjectVendor, Status } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';

interface Vendors {
  vendors: ProjectVendor[];
  vendor?: ProjectVendor;
  status: Status;
}
/* ============================= INITIAL STATE ============================== */
const initialState: Vendors = {
  vendors: [],
  vendor: undefined,
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getVendors = createAsyncThunk('vendors/GET_VENDORS', async () => {
  const response = await VendorsAPI.fetchVendors();
  return response.data.vendors;
});

export const addVendor = createAsyncThunk(
  'vendors/ADD_VENDOR',
  async (vendorData: Partial<ProjectVendor>) => {
    const response = await VendorsAPI.createVendor(vendorData);
    return response.data.vendor;
  }
);

export const getVendor = createAsyncThunk(
  'vendors/GET_VENDOR',
  async (vendorId: string) => {
    const { data } = await VendorsAPI.fetchVendor(vendorId);
    return data.vendor;
  }
);

export const changeVendor = createAsyncThunk(
  'vendors/EDIT_VENDOR',
  async (updateData: { vendorId: string; newData: Partial<ProjectVendor> }) => {
    const { data } = await VendorsAPI.editVendor(
      updateData.vendorId,
      updateData.newData
    );
    return data.vendor;
  }
);

/* ================================= REDUCER ================================ */
const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVendors.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.vendors = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getVendors.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(addVendor.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors = [...state.vendors, action.payload];
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(addVendor.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getVendor.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getVendor.fulfilled, (state, action) => {
        state.vendor = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getVendor.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(changeVendor.fulfilled, (state, action) => {
        state.vendor = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(changeVendor.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      });
  },
});

/* ================================ ACTIONS ================================= */

/* =============================== SELECTORS ================================ */

export const selectVendors = (state: RootState) => state.vendors.vendors;
export const selectVendor = (state: RootState) => state.vendors.vendor;
export const selectStatus = (state: RootState) => state.vendors.status;

export default vendorsSlice.reducer;
