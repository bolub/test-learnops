import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import {
  ProjectStatus,
  NewProjectParticipant,
  NewProjectCollaborator,
} from 'utils/customTypes';

class ProjectAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchProject = async (projectId: string) => {
    const { data } = await this.instance.get(`project/${projectId}`);
    return data;
  };

  fetchAllocationSummary = async (projectId: string) => {
    const { data } = await this.instance.get(
      `project/${projectId}/allocationSummary`
    );
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

  addProjectParticipant: (
    projectId: string,
    newParticipantData: NewProjectParticipant
  ) => Promise<any> = async (projectId, newParticipantData) => {
    const response = await this.instance.post(
      `project/${projectId}/participants`,
      { newParticipantData }
    );
    return response.data.data;
  };

  addProjectCollaborator: (
    projectId: string,
    newCollaboratorData: NewProjectCollaborator
  ) => Promise<any> = async (projectId, newCollaboratorData) => {
    const response = await this.instance.post(
      `project/${projectId}/collaborators`,
      newCollaboratorData
    );
    return response.data.data;
  };

  fetchParticipantAvailability: (
    userId: string,
    timeFrameStartDate: string,
    timeFrameEndDate: string
  ) => Promise<any> = async (userId, timeFrameStartDate, timeFrameEndDate) => {
    const response = await this.instance.post(
      `project/participants/userAvailability/${userId}`,
      {
        timeFrameStartDate,
        timeFrameEndDate,
      }
    );
    return response.data.data;
  };
}

export default new ProjectAPI();
