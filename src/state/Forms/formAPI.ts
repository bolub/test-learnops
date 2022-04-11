import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { NewFormType, Form } from 'utils/customTypes';

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

  createForm = async (form: NewFormType) => {
    const { data } = await this.instance.post('/', form);
    return data;
  };

  updateForm = async (form: Form) => {
    const { data } = await this.instance.put(`/${form.id}`, form);
    return data;
  };

  duplicateForm = async (formId: string, title: string, creatorId: string) => {
    const { data } = await this.instance.post(`/duplicate/${formId}`, {
      title,
      form_creator_id: creatorId,
    });
    return data;
  };

  deleteForm = async (formId: string) => {
    const { data } = await this.instance.delete(`/${formId}`);
    return data;
  };
}

export default new FormAPI();
