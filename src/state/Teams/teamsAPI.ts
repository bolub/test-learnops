import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class TeamsAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchLDTeams = async () => {
    const { data } = await this.instance.get('learningTeam');
    return data;
  };
}
export default new TeamsAPI();
