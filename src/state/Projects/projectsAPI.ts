import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { objKeyAsString, NewProject } from 'utils/customTypes';

class ProjectsAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchTeamProjects: () => Promise<any> = async () => {
    const { data } = await this.instance.get('project');
    return data;
  };

  fetchUserProjects: () => Promise<any> = async () => {
    const { data } = await this.instance.get('project/myProjects');
    return data;
  };

  exportCsv = async (
    csvHeaders: string[],
    csvData: objKeyAsString,
    fileName: string
  ) => {
    const { data } = await this.instance.post(`export/`, {
      exportData: { csvHeaders, csvData, fileName },
    });
    return data;
  };

  createProject: (newProjectData: NewProject) => Promise<any> = async (
    newProjectData
  ) => {
    const { data } = await this.instance.post(`project`, {
      learningTeams: [],
      collaborators: [],
      participants: [],
      ...newProjectData,
    });
    return data;
  };

  deleteProject = async (projectId: string) => {
    await this.instance.delete(`project/${projectId}/`);
  };
}

export default new ProjectsAPI();
