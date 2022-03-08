import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class ProjectCommentsAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchProjectComments: (projectId: string) => Promise<any> = async (
    projectId
  ) => {
    const { data } = await this.instance.get(
      `project/comment/${projectId}/all`
    );
    return data.data;
  };

  addNewProjectComment: (
    projectId: string,
    userId: string,
    content: string
  ) => Promise<any> = async (projectId, commentCreatorId, content) => {
    const { data } = await this.instance.post('project/comment', {
      commentCreatorId,
      projectId,
      content,
    });
    return data.data;
  };

  updateProjectComment: (commentId: string, content: string) => Promise<any> =
    async (commentId, content) => {
      const { data } = await this.instance.put(`project/comment/${commentId}`, {
        updateFields: { content },
      });
      return data.data;
    };

  removeProjectComment: (commentId: string) => Promise<any> = async (
    commentId
  ) => {
    await this.instance.delete(`project/comment/${commentId}`);
  };
}

export default new ProjectCommentsAPI();
