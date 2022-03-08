import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createAction,
} from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { SLICE_STATUS } from 'utils/constants';
import {
  BusinessTeam,
  NewBusinessTeamData,
  Status,
  FormOption,
} from 'utils/customTypes';
import businessTeamsAPI from './businessTeamsAPI';

interface BusinessTeams {
  value: BusinessTeam[];
  status: Status;
  currentBusinessTeam: Partial<BusinessTeam>;
}

/* ============================= INITIAL STATE ============================== */
const initialState: BusinessTeams = {
  value: [],
  status: SLICE_STATUS.IDLE,
  currentBusinessTeam: {},
};

/* ============================== REDUX THUNK =============================== */
export const getBusinessTeams = createAsyncThunk(
  'businessTeams/GET_BUSINESS_TEAMS',
  async () => {
    const { data } = await businessTeamsAPI.fetchBusinessTeams();

    if (!data.businessTeams) {
      throw new Error('An error ocurred');
    }

    return data.businessTeams;
  }
);

export const createBusinessTeam = createAsyncThunk(
  'businessTeams/CREATE_BUSINESS_TEAM',
  async (newBusinessTeamData: NewBusinessTeamData) => {
    const { data } = await businessTeamsAPI.postBusinessTeam(
      newBusinessTeamData
    );

    if (!data.businessTeam) {
      throw new Error('An error ocurred');
    }

    return data.businessTeam;
  }
);

export const getCurrentBusinessTeam = createAsyncThunk(
  'businessTeams/GET_CURRENT_BUSINESS_TEAM',
  async (id: string) => {
    const { data } = await businessTeamsAPI.getBusinessTeam(id);
    if (!data.businessTeam) {
      throw new Error('An error ocurred');
    }

    return data.businessTeam;
  }
);

export const updateBusinessTeam = createAsyncThunk(
  'businessTeams/UPDATE_TEAM',
  async ({
    teamId,
    updateFields,
  }: {
    teamId: string;
    updateFields: Partial<BusinessTeam>;
  }) => {
    const { data } = await businessTeamsAPI.updateTeam(teamId, updateFields);
    if (!data.businessTeam) {
      throw new Error('An error ocurred');
    }

    return data.businessTeam;
  }
);

export const deleteBusinessTeam = createAsyncThunk(
  'businessTeams/DELETE_TEAM',
  async (teamId: string) => {
    const { code } = await businessTeamsAPI.deleteTeam(teamId);
    if (code !== 200) {
      throw new Error('An error ocurred');
    }

    return { teamId };
  }
);
/* ================================ ACTIONS ================================= */

export const resetCurrentBusinessTeam = createAction(
  'businessTeams/RESET_CURRENT_TEAM'
);
/* ================================= REDUCER ================================ */
const slice = createSlice({
  name: 'businessTeams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessTeams.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getBusinessTeams.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getBusinessTeams.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(createBusinessTeam.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(createBusinessTeam.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(createBusinessTeam.fulfilled, (state, action) => {
        state.value = [action.payload].concat(state.value);
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getCurrentBusinessTeam.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getCurrentBusinessTeam.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getCurrentBusinessTeam.fulfilled, (state, action) => {
        state.currentBusinessTeam = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateBusinessTeam.fulfilled, (state, action) => {
        state.currentBusinessTeam = action.payload;
      })
      .addCase(resetCurrentBusinessTeam, (state) => {
        state.currentBusinessTeam = initialState.currentBusinessTeam;
      })
      .addCase(deleteBusinessTeam.fulfilled, (state, action) => {
        state.value = state.value.filter(
          (team) => team.id !== action.payload.teamId
        );
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectBussinessTeams = (state: RootState) =>
  state.businessTeams.value;

export const selectBusinessTeamsForDropdown = createSelector(
  [selectBussinessTeams],
  (businessTeams) => {
    return businessTeams.map((team) => ({
      label: team.title,
      value: team.id,
    })) as FormOption[];
  }
);
export const selectBussinessTeamStatus = (state: RootState) =>
  state.businessTeams.status;

export const selectCurrentBusinessTeam = (state: RootState) =>
  state.businessTeams.currentBusinessTeam;

/* ================================= EXPORT ================================= */
export default slice.reducer;
