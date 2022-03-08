import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class RequestAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchRequest = async (requestId: string) => {
    const { data } = await this.instance.get(`request/${requestId}`);
    return data;
  };

  deleteRequest = async (requestId: string) => {
    const { data } = await this.instance.delete(`request/${requestId}`);
    return data;
  };

  createRequest: (
    formId: string,
    requestTypeId: string,
    requesterId: string,
    organizationId: string,
    requestData?: { title?: string; published?: boolean },
    requestTitle?: string
  ) => Promise<any> = async (
    formId,
    requestTypeId,
    requesterId,
    organizationId,
    requestData = {},
    requestTitle = ''
  ) => {
    const { data } = await this.instance.post(`form/${formId}/requests`, {
      requester_id: requesterId,
      organizationId: organizationId,
      request_type: requestTypeId,
      data: requestData,
      title: requestTitle,
    });
    return data;
  };

  fetchRequestQuestions = async (requestId: string) => {
    const { data } = await this.instance.get(`request/${requestId}/questions`);
    return data;
  };

  updateRequest = async (requestId: string, updateData: any) => {
    const { data } = await this.instance.put(
      `request/${requestId}/`,
      updateData
    );
    return data;
  };

  updateQuestions = async (requestId: string, updateData: any) => {
    const { data } = await this.instance.put(
      `questions/updateQuestions/${requestId}`,
      updateData
    );
    return data;
  };

  createQuestion = async (requestId: string, questionType: string) => {
    const questionData = { type: questionType, uiController: true };
    const { data } = await this.instance.post(
      `form/${requestId}/questions`,
      questionData
    );
    return data;
  };

  deleteQuestion = async (questionId: string) => {
    const { data } = await this.instance.delete(`questions/${questionId}`);
    return data;
  };

  fetchAllRequests = async (params?: {}) => {
    const { data } = await this.instance.get('request/', { params });
    return data;
  };

  fetchUserRequests = async (params?: {}) => {
    const { data } = await this.instance.get('request/myRequests', { params });
    return data;
  };

  exportCsv = async (csvHeaders: any, csvData: any, fileName: string) => {
    const { data } = await this.instance.post(`export/`, {
      exportData: { csvHeaders, csvData, fileName },
    });
    return data;
  };

  downloadRequest = async (requestId: string, fileName: string) => {
    const { data } = await this.instance.post(`export/downloadPdf`, {
      exportData: { requestId, fileName },
    });
    return data;
  };

  setOwners = async (requestId: string, ownersIds: string[]) => {
    const { data } = await this.instance.put(`request/${requestId}/setOwners`, {
      ownerIds: ownersIds,
    });
    return data;
  };

  linkProjectsToRequest = async (projectIds: string[], requestId: string) => {
    const response = await this.instance.post(
      `request/${requestId}/setLinkProjects`,
      { projectIds }
    );
    return response.data;
  };

  requestDecision = async (requestId: string, decision: string) => {
    const { data } = await this.instance.patch(
      `request/${requestId}/decision`,
      {
        status: { decision },
      }
    );
    return data;
  };
}
export default new RequestAPI();
