import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class OrganizationAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchOrganization = async (organizationId: string) => {
    const { data } = await this.instance.get(`organization/${organizationId}`);
    return data.data;
  };
}
export default new OrganizationAPI();
