import { AxiosInstance } from 'axios';
import config from 'config/Config';
import get from 'lodash/get';
import { initAxios } from 'utils/axios';

class AccountsAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  getEnterpriseConnection: (accountId: string) => Promise<string> = async (
    accountId
  ) => {
    const response = await this.instance.get(
      `/enterpriseConnections/${accountId}`
    );
    return get(response, 'data.connectionId');
  };
}

export default new AccountsAPI();
