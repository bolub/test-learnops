import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

type fetchFormsParams = {
  organizationId: string;
  published?: boolean;
};

class FormAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(`${config.get('backendURL')}form`);
  }

  fetchOrganizationForms = async ({
    organizationId,
    published,
  }: fetchFormsParams) => {
    const { data } = await this.instance.get('/', {
      params: {
        organization_id: organizationId,
        published,
      },
    });
    return data;
  };

  fetchForm = async (formId: string) => {
    const { data } = await this.instance.get(`/${formId}`);
    return data;
  };
}

export default new FormAPI();
