import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { LDTeam, LearningTeamBase } from 'utils/customTypes';

class LearningTeamsAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(`${config.get('backendURL')}learningTeam`);
  }

  fetchLearningTeams = async () => {
    const { data } = await this.instance.get('/organization/all');
    return data;
  };

  createLDTeam = async (team: LearningTeamBase) => {
    const { data } = await this.instance.post('/', team);
    return data;
  };

  getLearningTeam = async (id: string) => {
    const { data } = await this.instance.get(`/${id}`);
    return data;
  };

  updateTeam = async (teamId: string, updateFields: Partial<LDTeam>) => {
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

export default new LearningTeamsAPI();
