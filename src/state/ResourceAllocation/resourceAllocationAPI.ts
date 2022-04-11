import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import {
  ParticipantAssignment,
  CollaboratorAssignment,
  GetUserAvailabilityParams,
} from 'utils/customTypes';

class ResourceAllocationAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchProjectParticipants: (projectId: string) => Promise<any> = async (
    projectId
  ) => {
    const response = await this.instance.get(
      `project/${projectId}/participants`
    );
    return response.data.data;
  };

  fetchProjectCollaborators: (projectId: string) => Promise<any> = async (
    projectId
  ) => {
    const response = await this.instance.get(
      `project/${projectId}/collaborators`
    );
    return response.data.data;
  };

  updateAllocation: (
    allocationId: string,
    allocatedHours: number
  ) => Promise<any> = async (allocationId, allocatedHours) => {
    const response = await this.instance.put(
      `project/allocations/${allocationId}`,
      {
        allocatedHours,
      }
    );
    return response.data.data;
  };

  deleteCollaboratorAssignment: (
    projectId: string,
    userId: string
  ) => Promise<any> = async (projectId, userId) => {
    const response = await this.instance.delete(
      `project/${projectId}/collaborators/del`,
      {
        data: {
          userId: userId,
        },
      }
    );
    return response.data.data;
  };

  updateProjectParticipant: (
    participationId: string,
    newParticipantData: Omit<ParticipantAssignment, 'participationId'>
  ) => Promise<any> = async (participationId, newParticipantData) => {
    const response = await this.instance.put(
      `project/participants/${participationId}`,
      { newParticipantData }
    );
    return response.data.data;
  };

  deleteParticipantAssignment: (
    projectId: string,
    userId: string,
    role: string
  ) => Promise<any> = async (projectId, userId, role) => {
    const response = await this.instance.post(
      `project/${projectId}/participants/del`,
      {
        userId,
        role,
      }
    );
    return response.data.data;
  };

  updateProjectCollaborator: (
    projectId: string,
    data: CollaboratorAssignment
  ) => Promise<any> = async (projectId, data) => {
    const response = await this.instance.put(
      `project/${projectId}/collaborators`,
      data
    );
    return response.data.data;
  };

  getUserAvailability: (params: GetUserAvailabilityParams) => Promise<any> =
    async ({ timeFrameStartDate, timeFrameEndDate, userId }) => {
      const response = await this.instance.post(
        `project/participants/userAvailability/${userId}`,
        {
          timeFrameStartDate,
          timeFrameEndDate,
        }
      );
      return response.data.data.userTotalAvailability;
    };
}

export default new ResourceAllocationAPI();
