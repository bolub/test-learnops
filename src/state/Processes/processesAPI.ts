import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import {
  NewProjectProcess,
  NewProjectProcessStage,
  ProjectProcess,
  ProjectProcessStage,
} from 'utils/customTypes';

class ProcessesAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchOrganizationProcesses = async () => {
    const { data } = await this.instance.get(`project/process/all`);
    return data.data;
  };

  addNewProcess: (process: NewProjectProcess) => Promise<ProjectProcess> =
    async (process: NewProjectProcess) => {
      const { data } = await this.instance.post('/project/process', process);
      return data.data;
    };

  addNewProcessStage: (
    stage: NewProjectProcessStage
  ) => Promise<ProjectProcessStage> = async (stage: NewProjectProcessStage) => {
    const { data } = await this.instance.post('/project/stage', stage);
    return data.data;
  };

  updateProcess: (
    processId: string,
    process: ProjectProcess
  ) => Promise<ProjectProcess> = async (processId, process) => {
    const { data } = await this.instance.put(
      `/project/process/${processId}`,
      process
    );
    return data.data;
  };

  updateProcessStage: (
    stageId: string,
    stage: NewProjectProcessStage
  ) => Promise<ProjectProcessStage> = async (stageId, stage) => {
    const { data } = await this.instance.put(
      `/project/stage/${stageId}`,
      stage
    );
    return data.data;
  };

  removeProcess: (processId: string) => Promise<any> = async (processId) => {
    return await this.instance.delete(`/project/process/${processId}`);
  };

  removeProcessStage: (stageId: string) => Promise<any> = async (stageId) => {
    return await this.instance.delete(`/project/stage/${stageId}`);
  };
}
export default new ProcessesAPI();
