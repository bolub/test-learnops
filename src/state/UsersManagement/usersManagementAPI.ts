import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { AllUsersType } from 'utils/customTypes';

class UsersManagementAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchUsers = async (params?: { type?: string }) => {
    const { data } = await this.instance.get('user/orgUsers', { params });
    return data;
  };

  fetchUser = async (userId: string) => {
    const { data } = await this.instance.get(`user/userId/${userId}`);
    return data;
  };

  updateUser = async (userId: string, updateFields: Partial<AllUsersType>) => {
    const { data } = await this.instance.put(`user/${userId}`, {
      updateFields,
    });
    return data;
  };

  assignUserToLearningTeam = async (userId: string, teamId: string) => {
    const { data } = await this.instance.post('learningTeam/updateUser', {
      userId,
      teamId,
    });
    return data;
  };

  createUser = async (userData: Partial<AllUsersType>) => {
    const { data } = await this.instance.post('user', userData);
    return data;
  };

  inviteUser = async (
    userId: string,
    email: string,
    firstName: string,
    companyName: string
  ) => {
    const { data } = await this.instance.post('user/inviteUser', {
      userId,
      email,
      firstName,
      companyName,
    });
    return data;
  };
}
export default new UsersManagementAPI();
