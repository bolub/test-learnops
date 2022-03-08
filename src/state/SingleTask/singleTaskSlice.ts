import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { TaskDetailType, Task_Status } from 'utils/customTypes';
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
    let updatedAssignedUsers = [];

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

    if (updatedAssignedUsers.length > 0) {
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
    const updatedtask = await taskAPI.updateEnablement(taskId, disabled);
    return { ...updatedtask };
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
        state.value = action.payload;
      });
  },
});

/* =============================== SELECTORS ================================ */
export const getSingleTaskData = (state: RootState) => state.singleTask.value;

export default singleTaskSlice.reducer;
