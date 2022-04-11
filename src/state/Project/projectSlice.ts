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
  LDUser,
  AllUsersType,
  UserAvatars,
  ProjectParticipant,
  ProjectCollaborator,
  NewProjectParticipant,
  NewProjectCollaborator,
  objKeyAsString,
  ResourceSummary,
} from 'utils/customTypes';
import {
  selectLDUsers,
  allUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { selectUserId } from 'state/User/userSlice';
import {
  addParticipantAllocations,
  addCollaboratorAllocations,
} from 'state/ResourceAllocation/resourceAllocation';
import { defaultNewProjectData } from '../../Pages/NewProjectPage/helpers/types';
import ProjectAPI from './projectAPI';
import {
  SLICE_STATUS,
  NEW_PROJECT_FORM_FIELDS,
  PROJECT_PARTICIPANT_TYPE,
  PROJECT_OWNER,
} from 'utils/constants';

interface ProjectState {
  value: NewProject;
  status: Status;
  resourceSummary: objKeyAsString;
}

/* ============================= INITIAL STATE ============================== */
const initialState: ProjectState = {
  value: defaultNewProjectData,
  status: SLICE_STATUS.IDLE,
  resourceSummary: {},
};

const projectAPI = ProjectAPI;

/* ================================ ACTIONS ================================= */
export const resetProject = createAction('project/RESET_PROJECT');

export const removeProjectParticipant = createAction<string>(
  'project/REMOVE_PARTICIPANT'
);

export const removeProjectCollaborator = createAction<string>(
  'project/REMOVE_COLLABORATOR'
);

/* ============================== REDUX THUNK =============================== */
export const fetchProject = createAsyncThunk(
  'project/FETCH_PROJECT',
  async (projectId: string) => {
    const response = await projectAPI.fetchProject(projectId);
    return response.data;
  }
);

export const fetchAllocationSummary = createAsyncThunk(
  'project/FETCH_RESOURCE_SUMMARY',
  async (projectId: string) => {
    const response = await projectAPI.fetchAllocationSummary(projectId);
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

export const addProjectParticipant = createAsyncThunk(
  'project/ADD_PARTICIPANT',
  async (
    params: {
      newParticipant: NewProjectParticipant;
      projectId: string;
    },
    { dispatch }
  ) => {
    const response = await projectAPI.addProjectParticipant(
      params.projectId,
      params.newParticipant
    );
    dispatch(addParticipantAllocations(response));
    const userId = params.newParticipant.userId;
    const newParticipant: ProjectParticipant = {
      data: {
        email: get(response, `${userId}.data.data.email`),
        lastName: get(response, `${userId}.data.data.lastName`),
        firstName: get(response, `${userId}.data.data.firstName`),
      },
      project_participants: {
        userId: get(response, `${userId}.data.id`),
        projectLearnOpId: params.projectId,
      },
    };
    return newParticipant;
  }
);

export const addProjectCollaborator = createAsyncThunk(
  'project/ADD_COLLABORATOR',
  async (
    params: {
      projectId: string;
      newCollaborator: NewProjectCollaborator;
    },
    { dispatch }
  ) => {
    const response = await projectAPI.addProjectCollaborator(
      params.projectId,
      params.newCollaborator
    );
    dispatch(
      addCollaboratorAllocations({
        ...response.collaborator,
        collaborator: response.user,
      })
    );
    const collaborator = {
      data: {
        email: get(response, 'user.data.email'),
        lastName: get(response, 'user.data.lastName'),
        firstName: get(response, 'user.data.firstName'),
      },
      project_collaborators: {
        projectLearnOpId: params.projectId,
        userId: get(response, 'collaborator.userId'),
      },
    };
    return collaborator;
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
      .addCase(fetchAllocationSummary.fulfilled, (state, action) => {
        state.resourceSummary = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.value = { ...state.value, ...action.payload };
      })
      .addCase(updateProjectFiles.fulfilled, (state, action) => {
        state.value = { ...state.value, data: action.payload };
      })
      .addCase(resetProject, (state) => {
        state.value = defaultNewProjectData;
      })
      .addCase(addProjectParticipant.fulfilled, (state, action) => {
        state.value = {
          ...state.value,
          participants: state.value.participants?.concat(action.payload),
        };
      })
      .addCase(removeProjectParticipant, (state, action) => {
        state.value = {
          ...state.value,
          participants: state.value.participants?.filter(
            (participant: ProjectParticipant) =>
              participant.project_participants.userId !== action.payload
          ),
        };
      })
      .addCase(addProjectCollaborator.fulfilled, (state, action) => {
        state.value = {
          ...state.value,
          collaborators: state.value.collaborators?.concat(action.payload),
        };
      })
      .addCase(removeProjectCollaborator, (state, action) => {
        state.value = {
          ...state.value,
          collaborators: state.value.collaborators?.filter(
            (collaborator: ProjectCollaborator) =>
              collaborator.project_collaborators.userId !== action.payload
          ),
        };
      });
  },
});

/* =============================== SELECTORS ================================ */
export const getOriginalProjectData = (state: RootState) => state.project.value;

export const getCurrentProjectId = createSelector(
  [getOriginalProjectData],
  (project: NewProject) => project.id
);

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

const getProjectOwners = createSelector(
  [getOriginalProjectData],
  (project: NewProject) =>
    project.owners.map((owner) => get(owner, 'project_owners.userId'))
);

const getProjectMembers = createSelector(
  [getOriginalProjectData],
  (project: NewProject) =>
    project.participants?.map((participant: ProjectParticipant) =>
      get(participant, 'project_participants.userId')
    )
);

const getProjectCollaborators = createSelector(
  [getOriginalProjectData],
  (project: NewProject) =>
    project.collaborators?.map((collaborator: ProjectCollaborator) =>
      get(collaborator, 'project_collaborators.userId')
    )
);

export const getCurrentUserParticipantType = createSelector(
  [getProjectOwners, getProjectMembers, getProjectCollaborators, selectUserId],
  (
    owners: string[],
    members: string[] = [],
    collaborators: string[] = [],
    currentUserId: string = ''
  ) => {
    if (owners.length === 0) {
      return undefined;
    }

    const isCurrentUserOwner = owners.find(
      (ownerId: string) => ownerId === currentUserId
    );
    if (isCurrentUserOwner) {
      return PROJECT_PARTICIPANT_TYPE.OWNER;
    }

    const isCurrentUserMember = members.find(
      (memberId: string) => memberId === currentUserId
    );
    if (isCurrentUserMember) {
      return PROJECT_PARTICIPANT_TYPE.MEMBER;
    }

    const isCurrentUserCollaborator = collaborators.find(
      (collaboratorId: string) => collaboratorId === currentUserId
    );
    if (isCurrentUserCollaborator) {
      return PROJECT_PARTICIPANT_TYPE.COLLABORATOR;
    }

    return PROJECT_PARTICIPANT_TYPE.NOT_PARTICIPANT;
  }
);

export const getAvailableLDUsersForOwnersAndMembers = createSelector(
  [
    getProjectOwners,
    getProjectMembers,
    getProjectCollaborators,
    selectLDUsers,
    selectUserId,
  ],
  (
    owners: string[],
    members: string[] = [],
    collaborators: string[] = [],
    ldUsers: LDUser[],
    currentUserId: string = ''
  ) =>
    ldUsers
      .filter(
        (user: LDUser) =>
          !owners.includes(user.id) &&
          !members.includes(user.id) &&
          !collaborators.includes(user.id) &&
          user.id !== currentUserId
      )
      .map((user: LDUser) => ({
        label: `${user.data.firstName} ${user.data.lastName}`,
        avatar: {
          imageSrc: user.avatar_url,
          initial: `${user.data.firstName.charAt(0)}${user.data.lastName.charAt(
            0
          )}`,
        },
        value: user.id,
      })) as UserAvatars[]
);

export const getAvailableUsersForCollaborators = createSelector(
  [
    getProjectOwners,
    getProjectMembers,
    getProjectCollaborators,
    allUsers,
    selectUserId,
  ],
  (
    owners: string[],
    members: string[] = [],
    collaborators: string[] = [],
    users: AllUsersType[],
    currentUserId: string = ''
  ) =>
    users
      .filter(
        (user: AllUsersType) =>
          !owners.includes(user.id) &&
          !members.includes(user.id) &&
          !collaborators.includes(user.id) &&
          user.id !== currentUserId
      )
      .map((user: AllUsersType) => ({
        label: `${user.data.firstName} ${user.data.lastName}`,
        avatar: {
          imageSrc: user.avatar_url,
          initial: `${user.data.firstName.charAt(0)}${user.data.lastName.charAt(
            0
          )}`,
        },
        value: user.id,
      })) as UserAvatars[]
);

export const getResourceSummary = createSelector(
  [(state: RootState) => state],
  (state) => {
    const summaryData: ResourceSummary = {
      items: [],
      total: {
        totalNumberOfResource: 0,
        totalHours: 0,
      },
    };
    for (const [key, value] of Object.entries(state.project.resourceSummary)) {
      summaryData.items.push({
        projectRole: key,
        numberOfResource: value.resourceNumber,
        totalHours: value.totalAllocatedHour,
      });
      summaryData.total.totalNumberOfResource += value.resourceNumber;
      summaryData.total.totalHours += value.totalAllocatedHour;
    }
    summaryData.items.forEach((item, i) => {
      if (item.projectRole === PROJECT_OWNER) {
        summaryData.items.splice(i, 1);
        summaryData.items.unshift(item);
      }
    });
    return summaryData;
  }
);

export default projectSlice.reducer;
