import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import moment from 'moment';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { selectUserId } from 'state/User/userSlice';
import { allUsers } from 'state/UsersManagement/usersManagementSlice';
import { getOriginalProjectData } from 'state/Project/projectSlice';
import {
  TaskDetailType,
  Task_Status,
  TaskAssignedUser,
  NewProject,
  AllUsersType,
  UserAvatars,
} from 'utils/customTypes';
import { DATE, TASK_STATUS, TASK_FIELDS } from 'utils/constants';
import { taskFields } from 'Pages/ProjectPage/tabs/Tasks/helpers/constants';
import singleTaskAPI from './singleTaskAPI';
import { RootState } from 'state/store';

interface taskState {
  value: TaskDetailType;
  taskStatus: Task_Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: taskState = {
  value: taskFields,
  taskStatus: 'new',
};

const taskAPI = singleTaskAPI;
/* ============================== REDUX THUNK =============================== */

export const fetchTask = createAsyncThunk(
  'singleTask/FETCH_TASK',
  async (taskId: string) => {
    const response = await taskAPI.fetchTask(taskId);
    return response.data.task;
  }
);

export const updateTask = createAsyncThunk(
  'singleTask/UPDATE_TASK',
  async (updateData: { taskId: string; data: TaskDetailType | any }) => {
    let fieldsToUpdate = { ...updateData.data };
    let updatedStatus = null;
    let updatedAssignedUsers = undefined;

    if (has(fieldsToUpdate, TASK_FIELDS.STATUS)) {
      const { status, ...remainingTaskData } = fieldsToUpdate;
      updatedStatus = status;
      if (status === TASK_STATUS.COMPLETED) {
        const completion_date = moment(new Date()).format(DATE.SHORT_FORMAT);
        fieldsToUpdate = { ...remainingTaskData, completion_date };
      } else {
        fieldsToUpdate = { ...remainingTaskData };
      }
    }

    if (has(fieldsToUpdate, TASK_FIELDS.ASSIGNEE_UPDATE)) {
      const { assignedUsers, ...remainingTaskData } = fieldsToUpdate;
      updatedAssignedUsers = assignedUsers;
      fieldsToUpdate = { ...remainingTaskData };
    }

    let updatedtask = fieldsToUpdate;
    if (!isEmpty(fieldsToUpdate)) {
      updatedtask = await taskAPI.updateTask(updateData.taskId, fieldsToUpdate);
    }

    if (updatedStatus !== null) {
      await taskAPI.updateStatus(updateData.taskId, updatedStatus);
      updatedtask[TASK_FIELDS.STATUS] = updatedStatus;
    }

    if (updatedAssignedUsers !== undefined) {
      const response = await taskAPI.updateAssignees(
        updateData.taskId,
        updatedAssignedUsers
      );
      updatedtask[TASK_FIELDS.ASSIGNEE_UPDATE] = response.assignedUsers;
    }

    return { ...updatedtask };
  }
);

export const updateTaskEnablement = createAsyncThunk(
  'singleTask/UPDATE_TASK_ENABLEMENT',
  async ({ taskId, disabled }: { taskId: string; disabled: boolean }) => {
    await taskAPI.updateEnablement(taskId, disabled);
    return disabled;
  }
);

/* ================================= REDUCER ================================ */
const singleTaskSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        state.value = { ...state.value, ...action.payload };
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateTaskEnablement.fulfilled, (state, action) => {
        state.value = {
          ...state.value,
          disabled: action.payload,
        };
      });
  },
});

/* =============================== SELECTORS ================================ */
export const getSingleTaskData = (state: RootState) => state.singleTask.value;

const getTaskAssignees = createSelector(
  [getSingleTaskData],
  (task: TaskDetailType) => {
    if (!task.assignedUsers) {
      return [];
    }
    return (task.assignedUsers as TaskAssignedUser[]).map(
      (assignee: TaskAssignedUser) => assignee.id
    );
  }
);

export const isCurrentUserAssignedToTask = createSelector(
  [getTaskAssignees, selectUserId],
  (assignees: string[], currentUserId: string = '') => {
    return assignees.includes(currentUserId);
  }
);

export const getFormattedTaskAssignees = createSelector(
  [getTaskAssignees, allUsers],
  (assignees: string[], users: AllUsersType[]) => {
    return users
      .filter((user: AllUsersType) => assignees.includes(user.id))
      .map((user: AllUsersType) => ({
        label: `${user.data.firstName} ${user.data.lastName}`,
        avatar: {
          imageSrc: user.avatar_url,
          initial: `${user.data.firstName.charAt(0)}${user.data.lastName.charAt(
            0
          )}`,
        },
        value: user.id,
      })) as UserAvatars[];
  }
);

export const getAvailableUsersForTaskAssignees = createSelector(
  [getOriginalProjectData, getTaskAssignees, allUsers],
  (project: NewProject, assignees: string[], users: AllUsersType[]) => {
    const usersList: string[] = [];
    for (let owner of project.owners) {
      if (!assignees.includes(get(owner, 'project_owners.userId'))) {
        usersList.push(get(owner, 'project_owners.userId'));
      }
    }

    if (project.participants) {
      for (let member of project.participants) {
        if (!assignees.includes(get(member, 'project_participants.userId'))) {
          usersList.push(get(member, 'project_participants.userId'));
        }
      }
    }

    if (project.collaborators) {
      for (let collaborator of project.collaborators) {
        if (
          !assignees.includes(get(collaborator, 'project_collaborators.userId'))
        ) {
          usersList.push(get(collaborator, 'project_collaborators.userId'));
        }
      }
    }

    return users
      .filter((user: AllUsersType) => usersList.includes(user.id))
      .map((user: AllUsersType) => ({
        label: `${user.data.firstName} ${user.data.lastName}`,
        avatar: {
          imageSrc: user.avatar_url,
          initial: `${user.data.firstName.charAt(0)}${user.data.lastName.charAt(
            0
          )}`,
        },
        value: user.id,
      })) as UserAvatars[];
  }
);

export default singleTaskSlice.reducer;
