import {
  createAsyncThunk,
  createSlice,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { RootState } from 'state/store';
import {
  NewProject,
  Status,
  ProjectOwner,
  Request,
  LearningTeam,
} from 'utils/customTypes';
import { defaultNewProjectData } from '../../Pages/NewProjectPage/helpers/types';
import ProjectAPI from './projectAPI';
import { SLICE_STATUS, NEW_PROJECT_FORM_FIELDS } from 'utils/constants';

interface ProjectState {
  value: NewProject;
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: ProjectState = {
  value: defaultNewProjectData,
  status: SLICE_STATUS.IDLE,
};

const projectAPI = ProjectAPI;

/* ================================ ACTIONS ================================= */
export const resetProject = createAction('project/RESET_PROJECT');

/* ============================== REDUX THUNK =============================== */
export const fetchProject = createAsyncThunk(
  'project/FETCH_PROJECT',
  async (projectId: string) => {
    const response = await projectAPI.fetchProject(projectId);
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  'project/UPDATE_PROJECT',
  async (updateData: { projectId: string; data: NewProject | any }) => {
    let fieldsToUpdate = { ...updateData.data };
    let updatedStatus = null;
    let updatedOwners = null;
    let updatedProjectRequests = null;
    if (has(fieldsToUpdate, NEW_PROJECT_FORM_FIELDS.STATUS)) {
      const { status, ...dataWithoutStatus } = fieldsToUpdate;
      updatedStatus = status;
      fieldsToUpdate = { ...dataWithoutStatus };
    }
    if (has(fieldsToUpdate, NEW_PROJECT_FORM_FIELDS.PROJECT_OWNERS)) {
      const { owners, ...dataWithoutOwners } = fieldsToUpdate;
      updatedOwners = owners;
      fieldsToUpdate = { ...dataWithoutOwners };
    }
    if (has(fieldsToUpdate, NEW_PROJECT_FORM_FIELDS.PROJECT_REQUESTS)) {
      const { projectRequests, ...dataWithoutRequests } = fieldsToUpdate;
      updatedProjectRequests = projectRequests;
      fieldsToUpdate = { ...dataWithoutRequests };
    }
    let updatedProject = fieldsToUpdate;
    if (!isEmpty(fieldsToUpdate)) {
      updatedProject = await projectAPI.updateProject(
        updateData.projectId,
        fieldsToUpdate
      );
    }
    if (updatedProjectRequests !== null) {
      const { projectRequests } = await projectAPI.updateProjectLinkedRequests(
        updateData.projectId,
        updatedProjectRequests
      );
      updatedProject[NEW_PROJECT_FORM_FIELDS.PROJECT_REQUESTS] =
        projectRequests;
    }
    if (updatedStatus !== null) {
      await projectAPI.setProjectStatus(updateData.projectId, {
        status: updatedStatus,
      });
      updatedProject[NEW_PROJECT_FORM_FIELDS.STATUS] = updatedStatus;
    }
    if (updatedOwners !== null) {
      const { owners } = await projectAPI.setProjectOwners(
        updateData.projectId,
        updatedOwners
      );
      updatedProject[NEW_PROJECT_FORM_FIELDS.PROJECT_OWNERS] = owners;
    }
    return { ...updatedProject };
  }
);

export const updateProjectFiles = createAsyncThunk(
  'project/UPDATE_FILES',
  async (updateData: { projectId: string; data: { data: object } }) => {
    await projectAPI.updateProject(updateData.projectId, updateData.data);
    return updateData.data.data;
  }
);

/* ================================= REDUCER ================================ */
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(fetchProject.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.value = { ...state.value, ...action.payload };
      })
      .addCase(updateProjectFiles.fulfilled, (state, action) => {
        state.value = { ...state.value, data: action.payload };
      })
      .addCase(resetProject, (state) => {
        state.value = defaultNewProjectData;
      });
  },
});

/* =============================== SELECTORS ================================ */
export const getOriginalProjectData = (state: RootState) => state.project.value;

export const getProjectFiles = createSelector(
  [getOriginalProjectData],
  (project: NewProject) => get(project, 'data.files', [])
);

export const getCurrentProjectData = createSelector(
  [getOriginalProjectData],
  (project: NewProject) => {
    const projectObj = { ...defaultNewProjectData };
    for (const [key, value] of Object.entries(defaultNewProjectData)) {
      if (key === NEW_PROJECT_FORM_FIELDS.PROJECT_REQUESTS) {
        projectObj[key] = get(project, key, value).map(
          (request: Request) => request.id
        );
      } else if (key === NEW_PROJECT_FORM_FIELDS.PROJECT_OWNERS) {
        projectObj[key] = get(project, key, value).map(
          (owner: ProjectOwner) => owner.project_owners.userId
        );
      } else if (key === NEW_PROJECT_FORM_FIELDS.TEAMS) {
        projectObj[key] = get(project, 'ldteams', value).map(
          (team: LearningTeam) => team.id
        );
      } else {
        projectObj[key] = get(project, key, value);
      }
    }
    return projectObj;
  }
);

export default projectSlice.reducer;
