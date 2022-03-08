import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { NewTask } from 'utils/customTypes';

class TaskAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  createTask: (taskData: NewTask) => Promise<any> = async (taskData) => {
    const { data } = await this.instance.post(`/task/`, {
      ...taskData,
    });
    return data;
  };

  fetchTeamsTasks = async (projectId: string, params?: {}) => {
    const { data } = await this.instance.get(`task/projectTasks/${projectId}`, {
      params,
    });
    return data;
  };

  fetchUserTasks = async (params?: {}) => {
    const { data } = await this.instance.get('task/myTasks', { params });
    return data;
  };

  deleteTask = async (taskId: string) => {
    await this.instance.delete(`task/${taskId}`);
  };

  duplicateTask = async (taskId: string) => {
    const { data } = await this.instance.post(`task/${taskId}/duplicate`);
    return data;
  };
}

export default new TaskAPI();
