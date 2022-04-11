import {
  createSlice,
  createAsyncThunk,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import {
  Status,
  ProjectCollaboratorsAllocations,
  ProjectParticipantsAllocations,
  AllocationUpdateData,
  ParticipanttAllocation,
  ProjectParticipantRole,
  UserIdWithName,
  ParticipantAssignment,
  CollaboratorAssignment,
  CollaboratorEstimation,
  BulkHandleAssignmentsChangesParams,
} from 'utils/customTypes';
import { RootState } from 'state/store';
import {
  SLICE_STATUS,
  RESOURCE_ALLOCATION_TABLE_SECTIONS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import {
  generateResourceAllocationSections,
  populateOwnersAndMembersSections,
  populateCollaboratorsSection,
} from './helpers';
import {
  addProjectParticipant,
  removeProjectParticipant,
  removeProjectCollaborator,
} from 'state/Project/projectSlice';
import ResourceAllocationAPI from './resourceAllocationAPI';

export type SelectedParticipant = {
  participantType: string;
} & UserIdWithName;

interface ResourceAllocationState {
  value: {
    participants: ProjectParticipantsAllocations;
    collaborators: ProjectCollaboratorsAllocations[];
  };
  status: Status;
  currentEditingWeelkyHoursUser: UserIdWithName;
  participantAssignmentToUpdate: SelectedParticipant | null;
}

const resourceAllocationAPI = ResourceAllocationAPI;

/* ============================= INITIAL STATE ============================== */
const initialState: ResourceAllocationState = {
  value: {
    participants: {},
    collaborators: [],
  },
  status: SLICE_STATUS.IDLE,
  currentEditingWeelkyHoursUser: {
    userId: '',
    name: '',
  },
  participantAssignmentToUpdate: null,
};

/* ================================ ACTIONS ================================= */
export const addParticipantAllocations =
  createAction<ProjectParticipantsAllocations>(
    'project/ADD_PARTICIPANTS_ALLOCATIONS'
  );

export const addCollaboratorAllocations =
  createAction<ProjectCollaboratorsAllocations>(
    'project/ADD_COLLABORATOR_ALLOCATIONS'
  );

export const setCurrentEditingUser = createAction<UserIdWithName>(
  'project/SET_CURRENT_EDITING_USER'
);

export const setParticipantAssignmentToUpdate =
  createAction<SelectedParticipant | null>(
    'project/SET_PARTICIPANT_ASSIGNMENT_TO_UPDATE'
  );

/* ============================== REDUX THUNK =============================== */

export const fetchProjectParticipantsAllocations = createAsyncThunk(
  'project/FETCH_PARTICIPANTS_ALLOCATIONS',
  async (projectId: string) => {
    const participantsAllocations =
      await resourceAllocationAPI.fetchProjectParticipants(projectId);
    return participantsAllocations;
  }
);

export const fetchProjectCollaboratorsAllocations = createAsyncThunk(
  'project/FETCH_COLLABORATORS_ALLOCATIONS',
  async (projectId: string) => {
    const collaboratorsAllocations =
      await resourceAllocationAPI.fetchProjectCollaborators(projectId);
    return collaboratorsAllocations.collaborators;
  }
);

export const updateParticipantAllocation = createAsyncThunk(
  'project/UPDATE_PARTICIPANT_ALLOCATION',
  async (params: AllocationUpdateData) => {
    const newAllocationData = await resourceAllocationAPI.updateAllocation(
      params.allocationId,
      params.allocatedHours
    );
    return newAllocationData.updatedResourceAllocation;
  }
);

export const updateProjectParticipant = createAsyncThunk(
  'project/UPDATE_PARTICIPANT',
  async (
    params: {
      participantAssignments: ParticipantAssignment[];
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const currentParticipants = cloneDeep(
      state.resourceAllocation.value.participants
    );
    for (let assignment of params.participantAssignments) {
      const { participationId, ...otherParticipantData } = assignment;
      const foundIndex = currentParticipants[assignment.userId].roles.findIndex(
        (role: ProjectParticipantRole) =>
          role.participationId === participationId
      );
      if (foundIndex > -1) {
        const updatedParticipant =
          await resourceAllocationAPI.updateProjectParticipant(
            participationId!,
            {
              ...otherParticipantData,
              type: PROJECT_PARTICIPANT_TYPE.MEMBER,
            } as ParticipantAssignment
          );
        currentParticipants[assignment.userId] = {
          ...currentParticipants[assignment.userId],
          ...updatedParticipant[assignment.userId],
          roles: [
            ...currentParticipants[assignment.userId].roles.slice(
              0,
              foundIndex
            ),
            updatedParticipant[assignment.userId].roles[0],
            ...currentParticipants[assignment.userId].roles.slice(
              foundIndex + 1
            ),
          ],
        };
      }
    }
    return currentParticipants;
  }
);

export const updateProjectCollaborator = createAsyncThunk(
  'project/UPDATE_COLLABORATOR',
  async (
    params: { projectId: string; data: CollaboratorAssignment },
    { getState }
  ) => {
    const state = getState() as RootState;
    const currentCollaborators = cloneDeep(
      state.resourceAllocation.value.collaborators
    );
    const foundIndex = currentCollaborators.findIndex(
      (estimation: CollaboratorEstimation) =>
        estimation.userId === params.data.userId
    );
    let updatedCollaborators = currentCollaborators;
    if (foundIndex > -1) {
      await resourceAllocationAPI.updateProjectCollaborator(
        params.projectId,
        params.data
      );

      let updatedEstimatedHours = 0;
      if (params.data.estimatedHours) {
        updatedEstimatedHours = params.data.estimatedHours;
      }

      updatedCollaborators = [
        ...currentCollaborators.slice(0, foundIndex),
        {
          ...currentCollaborators[foundIndex],
          start_date: new Date(params.data.startDate).toString(),
          end_date: new Date(params.data.endDate).toString(),
          estimated_hours: updatedEstimatedHours.toString(),
          job_role: params.data.jobRole,
        },
        ...currentCollaborators.slice(foundIndex + 1),
      ];
    }
    return updatedCollaborators;
  }
);

export const bulkUpdateAllocations = createAsyncThunk(
  'project/BULK_UPDATE_PARTICIPANT_ALLOCATION',
  async (fieldsToUpdate: AllocationUpdateData[], { dispatch }) => {
    batch(() => {
      fieldsToUpdate.forEach((itemForUpdate) => {
        dispatch(updateParticipantAllocation(itemForUpdate));
      });
    });
  }
);

export const deleteCollaboratorAssignments = createAsyncThunk(
  'project/DELETE_COLLABORATOR_ASSIGNMENTS',
  async (
    params: { projectId: string; userId: string },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    let teamCollaborators = cloneDeep(
      state.resourceAllocation.value.collaborators
    );
    await resourceAllocationAPI.deleteCollaboratorAssignment(
      params.projectId,
      params.userId
    );
    dispatch(removeProjectCollaborator(params.userId));
    teamCollaborators = teamCollaborators.filter(
      (collaborator: ProjectCollaboratorsAllocations) => {
        return collaborator.userId !== params.userId;
      }
    );
    return teamCollaborators;
  }
);

export const deleteParticipantAssignments = createAsyncThunk(
  'project/DELETE_PARTICIPANT_ASSIGNMENTS',
  async (
    params: {
      assignments: ParticipantAssignment[];
      projectId: string;
      userId: string;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const tempParticipants = cloneDeep(
      state.resourceAllocation.value.participants
    );
    for (let assignment of params.assignments) {
      await resourceAllocationAPI.deleteParticipantAssignment(
        params.projectId,
        params.userId,
        assignment.job_role
      );
      if (!isEmpty(tempParticipants[params.userId])) {
        tempParticipants[params.userId].roles = tempParticipants[
          params.userId
        ].roles.filter((role) => {
          return role.role !== assignment.job_role;
        });
        if (tempParticipants[params.userId].roles.length === 0) {
          delete tempParticipants[params.userId];
          dispatch(removeProjectParticipant(params.userId));
        }
      }
    }
    return tempParticipants;
  }
);

export const bulkHandleAssignmentsChanges = createAsyncThunk(
  'project/BULK_HANDLE_ASSIGNMENT_CHANGES',
  async (params: BulkHandleAssignmentsChangesParams, { dispatch }) => {
    const {
      isCollaborator,
      updatedAssignments,
      deletedAssignments,
      addedParticipantAssignments,
      projectId,
      userId,
    } = params;

    batch(async () => {
      if (!isCollaborator) {
        if (!isEmpty(updatedAssignments)) {
          await dispatch(
            updateProjectParticipant({
              participantAssignments: updatedAssignments,
            })
          );
        }
        if (!isEmpty(deletedAssignments)) {
          dispatch(
            deleteParticipantAssignments({
              assignments: deletedAssignments,
              projectId,
              userId,
            })
          );
        }
        if (!isEmpty(addedParticipantAssignments)) {
          addedParticipantAssignments.forEach(async (newAssignment) => {
            const { userId, startDate, endDate, job_role, totalAllocation } =
              newAssignment;
            await dispatch(
              addProjectParticipant({
                newParticipant: {
                  userId,
                  startDate,
                  endDate,
                  job_role,
                  type: PROJECT_PARTICIPANT_TYPE.MEMBER,
                  hoursAssigned: totalAllocation,
                },
                projectId,
              })
            );
          });
        }
      } else {
        if (!isEmpty(deletedAssignments)) {
          dispatch(deleteCollaboratorAssignments({ projectId, userId }));
        }
        if (!isEmpty(updatedAssignments)) {
          const {
            participationId,
            totalAllocation,
            allocations,
            job_role,
            estimatedHours,
            ...otherAssignmentData
          } = updatedAssignments[0];

          await dispatch(
            updateProjectCollaborator({
              projectId,
              data: {
                ...otherAssignmentData,
                jobRole: job_role,
                estimatedHours: estimatedHours,
              },
            })
          );
        }
      }
    });
  }
);

/* ================================= REDUCER ================================ */
const resourceAllocationSlice = createSlice({
  name: 'resourceAllocation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProjectParticipantsAllocations.fulfilled,
        (state, action) => {
          state.value.participants = action.payload;
        }
      )
      .addCase(
        fetchProjectCollaboratorsAllocations.fulfilled,
        (state, action) => {
          state.value.collaborators = action.payload;
        }
      )
      .addCase(addParticipantAllocations, (state, action) => {
        let tempParticipants = { ...state.value.participants };
        const keys = Object.keys(action.payload);
        if (!isEmpty(keys) && tempParticipants[keys[0]]) {
          tempParticipants[keys[0]].roles = tempParticipants[
            keys[0]
          ].roles.concat(action.payload[keys[0]].roles);
        } else {
          tempParticipants = {
            ...state.value.participants,
            ...action.payload,
          };
        }
        state.value.participants = tempParticipants;
      })
      .addCase(setCurrentEditingUser, (state, action) => {
        state.currentEditingWeelkyHoursUser = action.payload;
      })
      .addCase(setParticipantAssignmentToUpdate, (state, action) => {
        state.participantAssignmentToUpdate = action.payload;
      })
      .addCase(updateProjectParticipant.fulfilled, (state, action) => {
        state.value.participants = action.payload;
      })
      .addCase(updateProjectCollaborator.fulfilled, (state, action) => {
        state.value.collaborators = action.payload;
      })
      .addCase(addCollaboratorAllocations, (state, action) => {
        state.value.collaborators = state.value.collaborators.concat(
          action.payload
        );
      })
      .addCase(deleteCollaboratorAssignments.fulfilled, (state, action) => {
        state.value.collaborators = action.payload;
      })
      .addCase(updateParticipantAllocation.fulfilled, (state, action) => {
        const participantData = state.value.participants[action.payload.userId];
        const newRoles = participantData.roles.map((role) => {
          if (role.allocations) {
            const newAllocations = role.allocations.map((allocation) => {
              if (allocation.allocationId === action.payload.id) {
                allocation.allocatedHours = action.payload.allocatedHours;
              }
              return allocation;
            });
            role.allocations = newAllocations;
          }
          return role;
        });
        participantData.roles = newRoles;
        state.value.participants = {
          ...state.value.participants,
          [action.payload.userId]: participantData,
        };
      })
      .addCase(deleteParticipantAssignments.fulfilled, (state, action) => {
        state.value.participants = action.payload;
      });
  },
});

/* =============================== SELECTORS ================================ */

const getParticipantsAllocations = (state: RootState) =>
  state.resourceAllocation.value.participants;

const getCollaboratorAllocations = (state: RootState) =>
  state.resourceAllocation.value.collaborators;

export const getCurrentEditingUser = (state: RootState) =>
  state.resourceAllocation.currentEditingWeelkyHoursUser;

export const getCurrentEditingWeeklyHoursUser = createSelector(
  [getCurrentEditingUser],
  (currentEditingUser: UserIdWithName) => {
    return currentEditingUser;
  }
);

export const getParticipantAssignmentToUpdate = (state: RootState) =>
  state.resourceAllocation.participantAssignmentToUpdate;

export const getParticipantAssignmentDetails = createSelector(
  [
    getParticipantAssignmentToUpdate,
    getParticipantsAllocations,
    getCollaboratorAllocations,
  ],
  (
    user: SelectedParticipant | null,
    participants: ProjectParticipantsAllocations,
    collaborators: ProjectCollaboratorsAllocations[]
  ) => {
    const response: ParticipantAssignment[] = [];
    if (user?.userId) {
      if (
        user.participantType ===
        RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS
      ) {
        const collaborator = collaborators.find(
          (collaborator: ProjectCollaboratorsAllocations) =>
            collaborator.userId === user.userId
        );
        response.push({
          userId: collaborator?.userId!,
          job_role: collaborator?.job_role ? collaborator?.job_role : '',
          startDate: collaborator?.start_date!,
          endDate: collaborator?.end_date!,
          estimatedHours: collaborator?.estimated_hours
            ? parseInt(collaborator.estimated_hours)
            : 0,
        });
      } else {
        const participant = participants[user.userId];
        for (const role of participant.roles) {
          const totalAllocation = role.allocations?.reduce(
            (acc, cur) => (acc += cur.allocatedHours),
            0
          );
          response.push({
            participationId: role.participationId!,
            job_role: role.role,
            startDate: role.startDate!,
            endDate: role.endDate!,
            totalAllocation,
            userId: participant.data.id!,
            allocations: role.allocations,
          });
        }
      }
    }
    return response;
  }
);

export const getProjectResourceAllocation = createSelector(
  [getParticipantsAllocations, getCollaboratorAllocations],
  (
    participantsAllocations: ProjectParticipantsAllocations,
    collaboratorsAllocations: ProjectCollaboratorsAllocations[]
  ) => {
    const sections = generateResourceAllocationSections();
    const participants = Object.values(participantsAllocations);
    let updatedSections = sections;
    updatedSections = populateOwnersAndMembersSections(sections, participants);
    updatedSections = populateCollaboratorsSection(
      updatedSections,
      collaboratorsAllocations
    );
    return updatedSections;
  }
);

export const getUserAllocations = createSelector(
  [getParticipantsAllocations, getCurrentEditingUser],
  (participantsAllocations, user) => {
    if (!user.userId) return [];
    const roles = participantsAllocations[user.userId]?.roles || [];
    let allocationsList: ParticipanttAllocation[] = [];
    roles.forEach((role: ProjectParticipantRole) => {
      role.allocations?.forEach((allocation: ParticipanttAllocation) => {
        allocationsList.push({
          ...allocation,
          role: role.role,
        });
      });
    });

    return allocationsList;
  }
);

export default resourceAllocationSlice.reducer;
