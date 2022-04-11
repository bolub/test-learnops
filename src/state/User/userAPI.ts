import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { Owner } from 'utils/customTypes';

class UserAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  getUser = async (email: string) => {
    const { data } = await this.instance.get(`user/userEmail/${email}`);
    return data;
  };

  editUser = async (userId: string, updateFields: Owner) => {
    const { data } = await this.instance.put(`user/${userId}`, {
      userId,
      updateFields,
    });
    return data;
  };

  getUserBasicInfo = async (userId: string) => {
    const { data } = await this.instance.get(`user/basicInfo/${userId}`);
    return data;
  };

  setRegistered = async (userId: string) => {
    const { data } = await this.instance.put(`user/setRegistered/${userId}`);
    return data;
  };
}

export default new UserAPI();
