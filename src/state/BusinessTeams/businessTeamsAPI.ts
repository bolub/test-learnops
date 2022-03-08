import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { BusinessTeam, NewBusinessTeamData } from 'utils/customTypes';

class BusinessTeamsAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(`${config.get('backendURL')}businessTeam`);
  }

  fetchBusinessTeams = async () => {
    const { data } = await this.instance.get('/');
    return data;
  };

  postBusinessTeam = async (newBusinessTeamData: NewBusinessTeamData) => {
    const { data } = await this.instance.post('/', newBusinessTeamData);
    return data;
  };

  getBusinessTeam = async (id: string) => {
    const { data } = await this.instance.get(`/${id}`);
    return data;
  };

  updateTeam = async (teamId: string, updateFields: Partial<BusinessTeam>) => {
    const { data } = await this.instance.put(`/${teamId}`, {
      updateFields,
    });
    return data;
  };

  deleteTeam = async (teamId: string) => {
    const { data } = await this.instance.delete(`/${teamId}`);
    return data;
  };
}

export default new BusinessTeamsAPI();
