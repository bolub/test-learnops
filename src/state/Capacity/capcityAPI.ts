import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class CapacityAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchCapacity = async () => {
    const { data } = await this.instance.get(
      '/project/participants/myTeamsCapacity'
    );
    return data;
  };
}

export default new CapacityAPI();
