import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class RequestCommentsAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  updatePropertyComment = async (commentId: string, message: string) => {
    const { data } = await this.instance.put(
      `/requestPropertyComment/${commentId}`,
      {
        updateFields: { message: message },
      }
    );
    return data;
  };

  updateQuestionComment = async (commentId: string, content: string) => {
    const { data } = await this.instance.put(`/comments/${commentId}`, {
      content: { content: content },
    });
    return data;
  };

  fetchPropertiesComments = async (requestId: string) => {
    const { data } = await this.instance.get(
      `/requestPropertyComment/${requestId}/all`
    );
    return data;
  };

  deletePropertiesComment = async (commentId: string) => {
    const { data } = await this.instance.delete(
      `/requestPropertyComment/${commentId}`
    );
    return data;
  };

  postNewPropertiesComment = async (content: {
    message: string;
    isBaseComment: boolean;
    requestId: string;
    requestProperty: string;
    userId: string;
  }) => {
    const { data } = await this.instance.post(
      `/requestPropertyComment/`,
      content
    );
    return data;
  };

  fetchQuestionsComments = async (questionId: string) => {
    const { data } = await this.instance.get(`/request/${questionId}/comments`);
    return data;
  };

  deleteQuestionComment = async (commentId: string) => {
    const { data } = await this.instance.delete(`/comments/${commentId}`);
    return data;
  };

  postNewQuestionComment = async (questionId: string, content: string) => {
    const { data } = await this.instance.post(
      `/questions/${questionId}/comments`,
      {
        content,
      }
    );
    return data;
  };
}
export default new RequestCommentsAPI();
