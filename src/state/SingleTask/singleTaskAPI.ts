import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class singleTaskAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  updateTask = async (taskId: string, updateData: any) => {
    const { data } = await this.instance.put(`task/${taskId}`, {
      ...updateData,
    });
    return data.data.resultTask;
  };

  updateStatus = async (taskId: string, status: string) => {
    const { data } = await this.instance.put(`task/${taskId}/status`, {
      status,
    });
    return data.data.resultTask;
  };

  updateAssignees = async (taskId: string, assignedUsers: string[]) => {
    const { data } = await this.instance.put(`task/${taskId}/setAssignees`, {
      assignedUsers,
    });
    return data.data.resultTask;
  };

  updateEnablement = async (taskId: string, disabled: boolean) => {
    const { data } = await this.instance.put(`task/${taskId}/disable`, {
      disabled,
    });
    return data.data;
  };

  fetchTask = async (taskId: string) => {
    const { data } = await this.instance.get(`task/${taskId}`);
    return data;
  };
}

export default new singleTaskAPI();
