import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import ProcessesAPI from './processesAPI';
import {
  NewProjectProcess,
  ProjectProcess,
  ProjectProcessStage,
} from 'utils/customTypes';
import {
  compareProcessStages,
  calculateEstimatedProcessCompletionTime,
} from './helpers';

interface Processes {
  projectProcesses: ProjectProcess[];
}
/* ============================= INITIAL STATE ============================== */
const initialState: Processes = {
  projectProcesses: [],
};

/* ============================== REDUX THUNK =============================== */
export const getOrganizationProcesses = createAsyncThunk(
  'processes/GET_PROCESSES',
  async () => {
    const response = await ProcessesAPI.fetchOrganizationProcesses();
    return response;
  }
);

export const addNewProjectProcess = createAsyncThunk(
  'processes/ADD_NEW_PROCESS',
  async (process: NewProjectProcess) => {
    const { projectStages, ...processData } = process;
    const response = await ProcessesAPI.addNewProcess({
      ...processData,
    } as NewProjectProcess);

    const newProcess: ProjectProcess = {
      ...response,
      projectStages: [],
      stagesOrdering: [],
    };

    for (const stage of projectStages) {
      const newStage = { ...stage, process_id: response.id };
      const resp = await ProcessesAPI.addNewProcessStage(newStage);
      newProcess.projectStages.push(resp);
      newProcess.stagesOrdering.push(resp.id);
    }

    return newProcess;
  }
);

export const updateProjectProcess = createAsyncThunk(
  'processes/UPDATE_PROCESS',
  async (processToUpdate: ProjectProcess, { getState }) => {
    const state = getState() as RootState;
    const foundProcess = state.processes.projectProcesses.find(
      (process: ProjectProcess) => processToUpdate.id === process.id
    );
    if (!foundProcess) {
      return;
    }
    const {
      projectStages,
      stagesOrdering,
      estimatedCompletionTime,
      id,
      ...processData
    } = processToUpdate;
    const { stagesToBeAdded, stagesToBeDeleted, stagesToBeUpdated } =
      compareProcessStages(foundProcess.projectStages, projectStages);
    for (const stage of stagesToBeDeleted) {
      await ProcessesAPI.removeProcessStage(stage.id);
    }
    for (const stage of stagesToBeUpdated) {
      const { id, ...stageData } = stage;
      await ProcessesAPI.updateProcessStage(id, {
        ...stageData,
      });
    }
    let updatedProcessStages = projectStages;
    for (const stage of stagesToBeAdded) {
      const resp = await ProcessesAPI.addNewProcessStage({
        ...stage,
        process_id: foundProcess.id,
      });
      updatedProcessStages = projectStages.map((stg: ProjectProcessStage) =>
        stg.stageName === resp.stageName ? resp : stg
      );
    }
    const response = await ProcessesAPI.updateProcess(id, {
      ...processData,
    } as ProjectProcess);
    const updatedProcess = {
      ...response,
      projectStages: updatedProcessStages,
    };
    return updatedProcess;
  }
);

export const removeProjectProcess = createAsyncThunk(
  'processes/REMOVE_PROCESS',
  async (process: ProjectProcess) => {
    const { id, projectStages } = process;
    await ProcessesAPI.removeProcess(id);
    for (const stage of projectStages) {
      await ProcessesAPI.removeProcessStage(stage.id);
    }
    return id;
  }
);

/* ================================= REDUCER ================================ */
const processesSlice = createSlice({
  name: 'processes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationProcesses.fulfilled, (state, action) => {
        state.projectProcesses = action.payload;
      })
      .addCase(addNewProjectProcess.fulfilled, (state, action) => {
        state.projectProcesses = [action.payload, ...state.projectProcesses];
      })
      .addCase(updateProjectProcess.fulfilled, (state, action) => {
        state.projectProcesses = state.projectProcesses.map(
          (process: ProjectProcess) =>
            process.id === action.payload?.id ? action.payload : process
        );
      })
      .addCase(removeProjectProcess.fulfilled, (state, action) => {
        state.projectProcesses = state.projectProcesses.filter(
          (process: ProjectProcess) => process.id !== action.payload
        );
      });
  },
});

/* ================================ ACTIONS ================================= */

/* =============================== SELECTORS ================================ */

export const selectProjectProcesses = (state: RootState) => {
  return state.processes.projectProcesses;
};

export const formattedProjectProcesses = createSelector(
  [selectProjectProcesses],
  (processes: ProjectProcess[]) => {
    return processes.map((process: ProjectProcess) => ({
      ...process,
      estimatedCompletionTime: calculateEstimatedProcessCompletionTime(
        process.projectStages
      ),
    }));
  }
);

export default processesSlice.reducer;
