import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { ProjectStatus } from 'utils/customTypes';

class ProjectAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchProject = async (projectId: string) => {
    const { data } = await this.instance.get(`project/${projectId}`);
    return data;
  };

  updateProject = async (projectId: string, updateData: any) => {
    const { data } = await this.instance.put(`project/${projectId}/`, {
      updateFields: { ...updateData },
    });
    return data.data.resultProject;
  };

  updateProjectLinkedRequests = async (
    projectId: string,
    requestIds: string[]
  ) => {
    const { data } = await this.instance.post(
      `project/${projectId}/setlinkRequests`,
      {
        requestIds,
      }
    );
    return data.data;
  };

  setProjectOwners = async (projectId: string, ownerIds: string[]) => {
    const { data } = await this.instance.post(
      `project/${projectId}/setProjectOwners`,
      {
        ownerIds,
      }
    );
    return data.data;
  };

  setProjectStatus = async (
    projectId: string,
    data: { status: ProjectStatus; hold_reason?: string }
  ) => {
    const response = await this.instance.put(`project/${projectId}/status`, {
      status: data.status,
      hold_reason: data.hold_reason,
    });
    return response.data.data;
  };
}

export default new ProjectAPI();
