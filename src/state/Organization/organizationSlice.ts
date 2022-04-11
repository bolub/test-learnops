import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import OrganizationAPI from './organizationAPI';
import { Organization, OrganizationSettings } from 'utils/customTypes';
import { LICENSE_TIER, SLICE_STATUS } from 'utils/constants';
/* ============================= INITIAL STATE ============================== */
const initialState: Organization = {
  organizationData: {
    businessTeams: [],
    learningTeams: [],
    projectCategories: [],
    projectVendors: [],
    users: [],
    license_tier: LICENSE_TIER.TRIAL,
    license_number: 0,
    id: '',
    settings: {},
    company_name: '',
  },
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getOrganization = createAsyncThunk(
  'organization/GET_ORGANIZATION',
  async (organizationId: string) => {
    const response = await OrganizationAPI.fetchOrganization(organizationId);
    return response;
  }
);

export const updateOrganizationSettings = createAsyncThunk(
  'organization/UPDATE_ORGANIZATION',
  async (settings: OrganizationSettings, { getState }) => {
    const state = getState() as RootState;
    const organizationId = state.organization.organizationData.id;
    const response = await OrganizationAPI.updateOrganization(organizationId, {
      settings,
    });
    return response;
  }
);

/* ================================= REDUCER ================================ */
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.organizationData = {
          ...state.organizationData,
          ...action.payload,
        };
      })
      .addCase(updateOrganizationSettings.pending, (state) => {
        state.status = SLICE_STATUS.UPDATING;
      })
      .addCase(updateOrganizationSettings.fulfilled, (state, action) => {
        state.organizationData.settings = action.payload.organization.settings;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateOrganizationSettings.rejected, (state) => {
        state.status = SLICE_STATUS.IDLE;
      });
  },
});

/* ================================ ACTIONS ================================= */

/* =============================== SELECTORS ================================ */
export const selectBussinessTeams = (state: RootState) =>
  state.organization.organizationData.businessTeams;
export const selectLearningTeams = (state: RootState) =>
  state.organization.organizationData.learningTeams;
export const selectProjectCategories = (state: RootState) =>
  state.organization.organizationData.projectCategories;
export const selectOrganizationLicense = (state: RootState) => ({
  license_tier: state.organization.organizationData.license_tier,
  license_number: state.organization.organizationData.license_number,
});

export const SelectOrganisationId = (state: RootState) =>
  state.organization.organizationData.id;

export const selectOrganizationSettings = (state: RootState) =>
  state.organization.organizationData.settings;

export const SelectComapnyName = (state: RootState) =>
  state.organization.organizationData.company_name;

export const selectOrganizationSliceStatus = (state: RootState) =>
  state.organization.status;

export default organizationSlice.reducer;
