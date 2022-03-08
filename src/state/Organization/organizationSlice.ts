import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import OrganizationAPI from './organizationAPI';
import {
  BusinessTeam,
  LearningTeam,
  ProjectCategory,
  User,
  Status,
  ProjectVendor,
} from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';
interface Organization {
  organizationData: {
    businessTeams: BusinessTeam[];
    learningTeams: LearningTeam[];
    projectCategories: ProjectCategory[];
    projectVendors: ProjectVendor[];
    users: User[];
  };
  status: Status;
}
/* ============================= INITIAL STATE ============================== */
const initialState: Organization = {
  organizationData: {
    businessTeams: [],
    learningTeams: [],
    projectCategories: [],
    projectVendors: [],
    users: [],
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

/* ================================= REDUCER ================================ */
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrganization.fulfilled, (state, action) => {
      state.organizationData = {
        ...state.organizationData,
        ...action.payload,
      };
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

export default organizationSlice.reducer;
