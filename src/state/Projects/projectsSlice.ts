import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createAction,
} from '@reduxjs/toolkit';
import { selectOrganizationId, selectUserId } from 'state/User/userSlice';
import { RootState } from 'state/store';
import orderBy from 'lodash/orderBy';
import {
  filter,
  Project,
  ProjectsTableTab,
  SortingType,
  SortingOrderType,
  objKeyAsString,
  NewProject,
  ProjectsListViewMode,
  ProjectProcess,
  ProjectProcessStage,
  ProjectsBoardTabs,
} from 'utils/customTypes';
import { PROJECTS_LIST_VIEW_MODE, PROJECTS_BOARD_TABS } from 'utils/constants';
import {
  formatFilters,
  groupProjectsByStage,
  filterProjects,
  filterOutInactiveProjects,
  processNewProjectData,
} from './helpers';
import { selectProjectProcesses } from 'state/Processes/processesSlice';
import ProjectsAPI from './projectsAPI';
import ProjectAPI from '../Project/projectAPI';

interface ProjectsState {
  viewMode: ProjectsListViewMode;
  projects: Project[];
  userProjects: Project[];
  teamProjectsTable: {
    filters: filter[];
    pagination: {
      limit: number;
      offset: number;
    };
    sorting: {
      orderBy: string;
      order: SortingType;
    };
    searchParam: string;
  };
  myProjectsTable: {
    filters: filter[];
    pagination: {
      limit: number;
      offset: number;
    };
    sorting: {
      orderBy: string;
      order: SortingType;
    };
    searchParam: string;
  };
  selectedProjectsBoard: ProjectsBoardTabs;
  teamProjectsBoard: {
    filters: filter[];
    process: string;
    searchParam: string;
    sorting: {
      orderBy: string;
      order: SortingType;
    };
  };
  myProjectsBoard: {
    filters: filter[];
    process: string;
    searchParam: string;
    sorting: {
      orderBy: string;
      order: SortingType;
    };
  };
}

/* ============================= INITIAL STATE ============================== */
const initialState: ProjectsState = {
  viewMode: PROJECTS_LIST_VIEW_MODE.TABLE,
  projects: [],
  userProjects: [],
  teamProjectsTable: {
    filters: [],
    pagination: {
      limit: 15,
      offset: 0,
    },
    sorting: {
      order: 'asc',
      orderBy: '',
    },
    searchParam: '',
  },
  myProjectsTable: {
    filters: [],
    pagination: {
      limit: 15,
      offset: 0,
    },
    sorting: {
      order: 'asc',
      orderBy: '',
    },
    searchParam: '',
  },
  selectedProjectsBoard: PROJECTS_BOARD_TABS.TEAM_BOARD,
  teamProjectsBoard: {
    filters: [],
    process: '',
    searchParam: '',
    sorting: {
      order: 'desc',
      orderBy: 'createdAt',
    },
  },
  myProjectsBoard: {
    filters: [],
    process: '',
    searchParam: '',
    sorting: {
      order: 'desc',
      orderBy: 'createdAt',
    },
  },
};

const projectsAPI = ProjectsAPI;

/* ============================== REDUX THUNK =============================== */
export const createNewProject = createAsyncThunk(
  'projects/CREATE_PROJECT',
  async (newProjectData: NewProject, { getState }) => {
    const state = getState() as RootState;
    const organizationId = selectOrganizationId(state);
    const processedProjectData = processNewProjectData(newProjectData);
    const response = await projectsAPI.createProject({
      ...processedProjectData,
      organization_id: organizationId,
    });
    return response;
  }
);

export const searchByTitle = createAction(
  'projects/SEARCH_BY_TITLE',
  (searchParam: string, table: ProjectsTableTab) => {
    return { payload: { searchParam, table } };
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/FETCH_PROJECTS',
  async () => {
    const response = await projectsAPI.fetchTeamProjects();
    return response;
  }
);

export const fetchUserProjects = createAsyncThunk(
  'projects/FETCH_MY_PROJECTS',
  async () => {
    const response = await projectsAPI.fetchUserProjects();
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/DELETE_PROJECT',
  async (projectId: string) => {
    await projectsAPI.deleteProject(projectId);
    return { projectId };
  }
);

export const exportCsv = createAsyncThunk(
  'projects/EXPORT_CSV',
  async (exportData: {
    csvHeaders: string[];
    csvData: objKeyAsString;
    fileName: string;
  }) => {
    const { csvHeaders, csvData, fileName } = exportData;
    const response = await projectsAPI.exportCsv(csvHeaders, csvData, fileName);
    return response.data.fileLocation;
  }
);

export const moveProjectToAnotherStage = createAsyncThunk(
  'project/MOVE_PROJECT_TO_ANOTHER_STAGE',
  async (updateData: { projectId: string; newStageId: string }) => {
    ProjectAPI.updateProject(updateData.projectId, {
      stage_id: updateData.newStageId,
    });
    return { ...updateData };
  }
);

/* ================================= ACTIONS ================================ */
export const updatePagination = createAction(
  'projects/UPDATE_PAGINATION',
  (pagination, table: ProjectsTableTab) => {
    return { payload: { pagination, table } };
  }
);

export const setFilters = createAction(
  'projects/SET_FILTERS',
  (filters: filter[], table: ProjectsTableTab) => {
    const formatedFilters = formatFilters(filters);
    return { payload: { formatedFilters, table } };
  }
);

export const setSortingOrders = createAction(
  'projects/SET_ORDERS',
  (order: SortingOrderType, table: ProjectsTableTab) => {
    return { payload: { order, table } };
  }
);

export const setProjectsListViewMode = createAction<ProjectsListViewMode>(
  'projects/SET_PROJECTS_LIST_VIEW_MODE'
);

export const resetBoardView = createAction('projects/RESET_BOAR_VIEW');

export const setProjectsBoard =
  createAction<ProjectsBoardTabs>('projects/SET_BOARD');

export const setBoardProcess = createAction(
  'projects/SET_BOARD_PROCESS',
  (processId: string, board: ProjectsBoardTabs) => {
    return { payload: { processId, board } };
  }
);

export const setBoardSorting = createAction(
  'projects/SET_BOARD_SORTING',
  (order: SortingOrderType, board: ProjectsBoardTabs) => {
    return { payload: { order, board } };
  }
);

export const setBoardSearchParam = createAction(
  'projects/SET_BOARD_SEARCH',
  (searchParam: string, board: ProjectsBoardTabs) => {
    return { payload: { searchParam, board } };
  }
);

export const setBoardFilters = createAction(
  'projects/SET_BOARD_FILTERS',
  (filters: filter[], board: ProjectsBoardTabs) => {
    return { payload: { filters, board } };
  }
);

/* ================================= REDUCER ================================ */
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.projects = [...state.projects, action.payload.data];
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = [...action.payload.data];
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.userProjects = [...action.payload.data];
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload.projectId
        );
      })
      .addCase(searchByTitle, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          searchParam: action.payload.searchParam,
        };
      })
      .addCase(updatePagination, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          pagination: action.payload.pagination,
        };
      })
      .addCase(setFilters, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          filters: action.payload.formatedFilters,
        };
      })
      .addCase(setSortingOrders, (state, action) => {
        state[action.payload.table] = {
          ...state[action.payload.table],
          sorting: action.payload.order,
        };
      })
      .addCase(exportCsv.fulfilled, (state, action) => {
        window.location.href = action.payload;
      })
      .addCase(setProjectsListViewMode, (state, action) => {
        state.viewMode = action.payload;
      })
      .addCase(setProjectsBoard, (state, action) => {
        state.selectedProjectsBoard = action.payload;
      })
      .addCase(resetBoardView, (state, action) => {
        state.selectedProjectsBoard = initialState.selectedProjectsBoard;
        state.teamProjectsBoard = initialState.teamProjectsBoard;
        state.myProjectsBoard = initialState.myProjectsBoard;
      })
      .addCase(setBoardProcess, (state, action) => {
        state[action.payload.board] = {
          ...state[action.payload.board],
          process: action.payload.processId,
        };
      })
      .addCase(setBoardSorting, (state, action) => {
        state[action.payload.board] = {
          ...state[action.payload.board],
          sorting: { ...action.payload.order },
        };
      })
      .addCase(setBoardSearchParam, (state, action) => {
        state[action.payload.board] = {
          ...state[action.payload.board],
          searchParam: action.payload.searchParam,
        };
      })
      .addCase(setBoardFilters, (state, action) => {
        state[action.payload.board] = {
          ...state[action.payload.board],
          filters: action.payload.filters,
        };
      })
      .addCase(moveProjectToAnotherStage.fulfilled, (state, action) => {
        state.projects = state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            let updatedProject = { ...project };
            updatedProject.stage_id = action.payload.newStageId;
            return updatedProject;
          }
          return project;
        });
        state.userProjects = state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            let updatedProject = { ...project };
            updatedProject.stage_id = action.payload.newStageId;
            return updatedProject;
          }
          return project;
        });
      });
  },
});

/* =============================== SELECTORS ================================ */
export const projectsListViewMode = (state: RootState) =>
  state.projectsState.viewMode;
export const teamSearch = (state: RootState) =>
  state.projectsState.teamProjectsTable.searchParam;
export const mySearch = (state: RootState) =>
  state.projectsState.myProjectsTable.searchParam;
export const teamSorting = (state: RootState) =>
  state.projectsState.teamProjectsTable.sorting;
export const mySorting = (state: RootState) =>
  state.projectsState.myProjectsTable.sorting;
export const teamBoardProcess = (state: RootState) =>
  state.projectsState.teamProjectsBoard.process;
export const myBoardProcess = (state: RootState) =>
  state.projectsState.myProjectsBoard.process;
export const teamBoardSearchParam = (state: RootState) =>
  state.projectsState.teamProjectsBoard.searchParam;
export const myBoardSearchParam = (state: RootState) =>
  state.projectsState.myProjectsBoard.searchParam;
export const teamBoardFilters = (state: RootState) =>
  state.projectsState.teamProjectsBoard.filters;
export const myBoardFilters = (state: RootState) =>
  state.projectsState.myProjectsBoard.filters;
export const teamBoardSorting = (state: RootState) =>
  state.projectsState.teamProjectsBoard.sorting;
export const myBoardSorting = (state: RootState) =>
  state.projectsState.myProjectsBoard.sorting;
export const projectsBoard = (state: RootState) =>
  state.projectsState.selectedProjectsBoard;

const teamBoardStages = createSelector(
  [selectProjectProcesses, teamBoardProcess],
  (processes, processId) => {
    let stages: ProjectProcessStage[] = [];
    const process = processes.find(
      (process: ProjectProcess) => process.id === processId
    );
    if (process) {
      stages = process.projectStages;
    }
    return stages;
  }
);

const myBoardStages = createSelector(
  [selectProjectProcesses, myBoardProcess],
  (processes, processId) => {
    let stages: ProjectProcessStage[] = [];
    const process = processes.find(
      (process: ProjectProcess) => process.id === processId
    );
    if (process) {
      stages = process.projectStages;
    }
    return stages;
  }
);

export const selectAllProjects = (state: RootState) =>
  state.projectsState.projects;

const selectAllActiveProjects = createSelector(
  selectAllProjects,
  (allProjects) => filterOutInactiveProjects(allProjects)
);

const selectMyActiveProjects = createSelector(
  (state: RootState) => state.projectsState.userProjects,
  (myProjects) => filterOutInactiveProjects(myProjects)
);

export const selectTeamProjects = createSelector(
  [
    selectAllProjects,
    teamSearch,
    teamSorting,
    (state: RootState) => state.projectsState.teamProjectsTable.pagination,
    (state: RootState) => state.projectsState.teamProjectsTable.filters,
  ],
  (projects, search, sortingParams, pagination, filters) => {
    const filteredProjectsList = filterProjects(projects, search, filters);
    return {
      data: orderBy(
        filteredProjectsList.slice(pagination.offset, pagination.limit),
        [sortingParams.orderBy],
        [sortingParams.order]
      ),
      total: filteredProjectsList.length,
    };
  }
);

export const selectUserProjects = createSelector(
  [
    (state: RootState) => state.projectsState.userProjects,
    mySearch,
    mySorting,
    (state: RootState) => state.projectsState.myProjectsTable.pagination,
    (state: RootState) => state.projectsState.myProjectsTable.filters,
    selectUserId,
  ],
  (userProjects, search, sortingParams, pagination, filters, userId) => {
    const filteredProjectsList = filterProjects(
      userProjects,
      search,
      filters,
      userId!
    );
    return {
      data: orderBy(
        filteredProjectsList.slice(pagination.offset, pagination.limit),
        [sortingParams.orderBy],
        [sortingParams.order]
      ),
      total: filteredProjectsList.length,
    };
  }
);

export const teamBoard = createSelector(
  [
    selectAllActiveProjects,
    teamBoardProcess,
    teamBoardStages,
    teamBoardSorting,
    teamBoardSearchParam,
    teamBoardFilters,
  ],
  (projects, processId, processStages, sortingParams, searchParam, filters) => {
    const filteredProjectsByProcess = projects.filter(
      (project: Project) => project?.process_id === processId
    );

    const filteredProjects = filterProjects(
      filteredProjectsByProcess,
      searchParam,
      filters
    );

    const orderedProjects = orderBy(
      filteredProjects,
      [sortingParams.orderBy],
      [sortingParams.order]
    );

    return groupProjectsByStage(processStages, orderedProjects);
  }
);

export const myBoard = createSelector(
  [
    selectMyActiveProjects,
    myBoardProcess,
    myBoardStages,
    myBoardSorting,
    myBoardSearchParam,
    myBoardFilters,
  ],
  (projects, processId, processStages, sortingParams, searchParam, filters) => {
    const filteredProjectsByProcess = projects.filter(
      (project: Project) => project?.process_id === processId
    );
    const filteredProjects = filterProjects(
      filteredProjectsByProcess,
      searchParam,
      filters
    );
    const orderedProjects = orderBy(
      filteredProjects,
      [sortingParams.orderBy],
      [sortingParams.order]
    );
    return groupProjectsByStage(processStages, orderedProjects);
  }
);

export const selectAssociatedProcessesAndStages = createSelector(
  [selectAllProjects],
  (projects: Project[]) => {
    const associatedProcesses: objKeyAsString = {};
    for (const project of projects) {
      if (!associatedProcesses[project.process_id!]) {
        associatedProcesses[project.process_id!] = [project.stage_id];
      } else {
        if (
          !associatedProcesses[project.process_id!].includes(project.stage_id)
        ) {
          associatedProcesses[project.process_id!].push(project.stage_id);
        }
      }
    }
    return associatedProcesses;
  }
);

export default projectsSlice.reducer;
