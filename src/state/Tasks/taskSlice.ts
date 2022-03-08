import {
  createAsyncThunk,
  createSlice,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { selectOrganizationId, selectUserId } from 'state/User/userSlice';
import { fetchProject } from 'state/Project/projectSlice';
import { Task, NewTask, filter, TasksTableTab } from 'utils/customTypes';
import { RootState } from 'state/store';
import { formatFilters } from 'state/Projects/helpers';
import { filterTasks, getTasksAssigneesList, sortTasks } from './helpers';
import TaskAPI from './taskAPI';
import { TASKS_TABLE_TABS, TASK_STATUS } from 'utils/constants';
interface TasksState {
  tasks: Task[];
  userTasks: Task[];
  teamTasksTable: {
    searchParam: string;
    filters: filter[];
    showReorder: boolean;
    pagination: {
      limit: number;
      offset: number;
    };
  };
  myTasksTable: {
    searchParam: string;
    filters: filter[];
    pagination: {
      limit: number;
      offset: number;
    };
  };
}

/* ============================= INITIAL STATE ============================== */
const initialState: TasksState = {
  tasks: [],
  userTasks: [],
  teamTasksTable: {
    searchParam: '',
    filters: [],
    showReorder: false,
    pagination: {
      limit: 15,
      offset: 0,
    },
  },
  myTasksTable: {
    searchParam: '',
    filters: [],
    pagination: {
      limit: 15,
      offset: 0,
    },
  },
};

const tasksAPI = TaskAPI;

/* ============================== REDUX THUNK =============================== */
export const fetchTeamTasks = createAsyncThunk(
  'tasks/FETCH_TEAMS_TASKS',
  async (projectId: string) => {
    const response = await tasksAPI.fetchTeamsTasks(projectId, {
      includeDisabled: true,
    });
    return response.data.orderedTasks;
  }
);

export const fetchUserTasks = createAsyncThunk(
  'tasks/FETCH_MY_TASKS',
  async (projectId: string) => {
    const response = await tasksAPI.fetchUserTasks({
      projectId,
      includeDisabled: true,
    });
    return response.data.myTasks;
  }
);

export const createNewTask = createAsyncThunk(
  'tasks/CREATE_TASK',
  async (newTaskData: NewTask, { getState, dispatch }) => {
    const state = getState() as RootState;
    const organizationId = selectOrganizationId(state);
    const currentUserId = selectUserId(state);
    const response = await tasksAPI.createTask({
      ...newTaskData,
      organization_id: organizationId,
    });
    dispatch(fetchProject(response.data.task.project_id));
    if (newTaskData.assignedUserIds.includes(currentUserId)) {
      dispatch(addUserTask(response.data.task));
    }
    return response.data.task;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/DELETE_TASK',
  async (taskId: string) => {
    await tasksAPI.deleteTask(taskId);
    return { taskId };
  }
);

export const duplicateTask = createAsyncThunk(
  'tasks/DUPLICATE_TASK',
  async (taskId: string) => {
    const response = await tasksAPI.duplicateTask(taskId);
    return response.data.result;
  }
);

/* ================================ ACTIONS ================================= */
const addUserTask = createAction<Task>('tasks/ADD_USER_TASK');

export const setFilters = createAction(
  'tasks/SET_FILTERS',
  (filters: filter[], table: TasksTableTab) => {
    const formatedFilters = formatFilters(filters);
    return { payload: { formatedFilters, table } };
  }
);

export const updatePagination = createAction(
  'tasks/UPDATE_PAGINATION',
  (pagination, table: TasksTableTab) => {
    return { payload: { pagination, table } };
  }
);

export const setSearchParam = createAction(
  'tasks/SET_SEARCH',
  (searchParam: string, table: TasksTableTab) => {
    return { payload: { searchParam, table } };
  }
);

export const setShowReorder = createAction(
  'tasks/SET_SHOW_REORDER',
  (showReorder: boolean, table: TasksTableTab) => {
    return { payload: { showReorder, table } };
  }
);

export const reorderRow = createAction(
  'tasks/REORDER_ROW',
  (newTasksOrderingList: string[]) => {
    return { payload: { newTasksOrderingList } };
  }
);

/* ================================= REDUCER ================================ */
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.tasks = [...state.tasks, action.payload];
      })
      .addCase(fetchTeamTasks.fulfilled, (state, action) => {
        state.tasks = [...action.payload];
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.userTasks = [...action.payload];
      })
      .addCase(addUserTask, (state, action) => {
        state.userTasks = [...state.userTasks, action.payload];
      })
      .addCase(setFilters, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          filters: action.payload.formatedFilters,
          showReorder: false,
        };
      })
      .addCase(updatePagination, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          showReorder: state.teamTasksTable.showReorder,
          pagination: action.payload.pagination,
        };
      })
      .addCase(setSearchParam, (state, action) => {
        if (action.payload.table === TASKS_TABLE_TABS.MY_TASKS) {
          state.myTasksTable.searchParam = action.payload.searchParam;
        } else {
          state.teamTasksTable.searchParam = action.payload.searchParam;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload.taskId
        );
      })
      .addCase(setShowReorder, (state, action) => {
        state.teamTasksTable.showReorder = action.payload.showReorder;
      })
      .addCase(reorderRow, (state, action) => {
        const updatedTasksOrdering = action.payload.newTasksOrderingList;
        const newTeamTasks = state.tasks;
        state.tasks = sortTasks(newTeamTasks, updatedTasksOrdering);
      })
      .addCase(duplicateTask.fulfilled, (state, action) => {
        state.tasks = [...state.tasks, action.payload];
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectUserTasks = (state: RootState) => state.tasks.userTasks;

export const teamSearchParam = (state: RootState) =>
  state.tasks.teamTasksTable.searchParam;
export const mySearchParam = (state: RootState) =>
  state.tasks.myTasksTable.searchParam;

export const teamTasksTableFilters = (state: RootState) =>
  state.tasks.teamTasksTable.filters;
export const myTasksTableFilters = (state: RootState) =>
  state.tasks.myTasksTable.filters;

export const teamTasksTableReorder = (state: RootState) =>
  state.tasks.teamTasksTable.showReorder;

export const selectMyTasks = createSelector(
  [
    selectUserTasks,
    mySearchParam,
    myTasksTableFilters,
    (state: RootState) => state.tasks.myTasksTable.pagination,
  ],
  (tasks: Task[], searchParam, filters: filter[], pagination) => {
    const filteredTasksList = filterTasks(tasks, filters, searchParam);
    return {
      data: orderBy(
        filteredTasksList.slice(pagination.offset, pagination.limit)
      ),
      total: filteredTasksList.length,
    };
  }
);

export const selectTeamTasks = createSelector(
  [
    selectAllTasks,
    teamSearchParam,
    teamTasksTableFilters,
    (state: RootState) => state.tasks.teamTasksTable.pagination,
  ],
  (tasks: Task[], searchParam, filters: filter[], pagination) => {
    const filteredTasksList = filterTasks(tasks, filters, searchParam);
    return {
      data: orderBy(
        filteredTasksList.slice(pagination.offset, pagination.limit)
      ),
      total: filteredTasksList.length,
    };
  }
);

export const getTeamTasksAssigneesList = createSelector(
  [selectAllTasks],
  (tasks: Task[]) => {
    const assignees = getTasksAssigneesList(tasks);
    return assignees;
  }
);

export const getUserTasksAssigneesList = createSelector(
  [selectUserTasks],
  (tasks: Task[]) => {
    const assignees = getTasksAssigneesList(tasks);
    return assignees;
  }
);

export const getTeamTasksCompletionProgress = createSelector(
  [selectAllTasks],
  (tasks: Task[]) => {
    const available = tasks.filter((task: Task) => !task.disabled);
    const completed = available.filter(
      (task: Task) => task.status === TASK_STATUS.COMPLETED
    ).length;
    return { available: available.length, completed };
  }
);

export const getUserTasksCompletionProgress = createSelector(
  [selectUserTasks],
  (tasks: Task[]) => {
    const available = tasks.filter((task: Task) => !task.disabled);
    const completed = available.filter(
      (task: Task) => task.status === TASK_STATUS.COMPLETED
    ).length;
    return { available: available.length, completed };
  }
);

export default tasksSlice.reducer;
