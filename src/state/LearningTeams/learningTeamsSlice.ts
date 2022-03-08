import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createAction,
} from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { SLICE_STATUS } from 'utils/constants';
import {
  LearningTeam,
  Status,
  FormOption,
  LearningTeamBase,
  LDTeam,
} from 'utils/customTypes';
import learningTeamsAPI from './learningTeamsAPI';
import { get, isEmpty } from 'lodash';

interface LearningTeams {
  value: LearningTeam[];
  status: Status;
  currentLearningTeam: Partial<LearningTeam>;
}

/* ============================= INITIAL STATE ============================== */
const initialState: LearningTeams = {
  value: [],
  status: SLICE_STATUS.IDLE,
  currentLearningTeam: {},
};

/* ============================== REDUX THUNK =============================== */
export const getLearningTeams = createAsyncThunk(
  'learningTeams/GET_LEARNING_TEAMS',
  async () => {
    const { data } = await learningTeamsAPI.fetchLearningTeams();
    if (!data.learningTeams) {
      throw new Error('An error ocurred');
    }

    return data.learningTeams;
  }
);

export const addLDTeam = createAsyncThunk(
  'learningTeams/CREATE_LD_TEAM',
  async (ldTeam: LearningTeamBase) => {
    const { data } = await learningTeamsAPI.createLDTeam(ldTeam);
    return data;
  }
);

export const getCurrentLearningTeam = createAsyncThunk(
  'learningTeams/GET_CURRENT_LD_TEAM',
  async (id: string) => {
    const { data } = await learningTeamsAPI.getLearningTeam(id);
    if (!data.learningTeam) {
      throw new Error('An error ocurred');
    }

    return data.learningTeam;
  }
);

export const updateLearningTeam = createAsyncThunk(
  'learningTeams/UPDATE_TEAM',
  async ({
    teamId,
    updateFields,
  }: {
    teamId: string;
    updateFields: Partial<LDTeam>;
  }) => {
    const { data } = await learningTeamsAPI.updateTeam(teamId, updateFields);
    if (!data.learningTeam) {
      throw new Error('An error ocurred');
    }

    return data.learningTeam;
  }
);

export const deleteLearningTeam = createAsyncThunk(
  'learningTeams/DELETE_TEAM',
  async (teamId: string) => {
    const { code } = await learningTeamsAPI.deleteTeam(teamId);
    if (code !== 200) {
      throw new Error('An error ocurred');
    }

    return { teamId };
  }
);
/* ================================ ACTIONS ================================= */

export const resetCurrentLearningTeam = createAction(
  'learningTeams/RESET_CURRENT_TEAM'
);
/* ================================= REDUCER ================================ */
const slice = createSlice({
  name: 'learningTeams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLearningTeams.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getLearningTeams.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getLearningTeams.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(addLDTeam.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(addLDTeam.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(addLDTeam.fulfilled, (state, action) => {
        const newTeam = get(action, 'payload.learningTeam');
        if (!isEmpty(newTeam)) {
          state.value = [...state.value, newTeam];
        }
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getCurrentLearningTeam.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getCurrentLearningTeam.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getCurrentLearningTeam.fulfilled, (state, action) => {
        state.currentLearningTeam = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateLearningTeam.fulfilled, (state, action) => {
        state.currentLearningTeam = action.payload;
      })
      .addCase(resetCurrentLearningTeam, (state) => {
        state.currentLearningTeam = initialState.currentLearningTeam;
      })
      .addCase(deleteLearningTeam.fulfilled, (state, action) => {
        state.value = state.value.filter(
          (team) => team.id !== action.payload.teamId
        );
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectLearningTeams = (state: RootState) =>
  state.learningTeams.value;

export const selectLearningTeamsForDropdown = createSelector(
  [selectLearningTeams],
  (learningTeams) => {
    return learningTeams.map((team) => ({
      label: team.name,
      value: team.id,
    })) as FormOption[];
  }
);

export const selectLearningTeamStatus = (state: RootState) =>
  state.learningTeams.status;

export const selectCurrentLearningTeam = (state: RootState) =>
  state.learningTeams.currentLearningTeam;

/* ================================= EXPORT ================================= */
export default slice.reducer;
