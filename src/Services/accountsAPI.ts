import { AxiosInstance } from 'axios';
import config from 'config/Config';
import get from 'lodash/get';
import { initAxios } from 'utils/axios';

class AccountsAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(config.get('accountsURL'));
  }

  getEnterpriseConnection: (accountId: string) => Promise<string> = async (
    accountId
  ) => {
    const response = await this.instance.get(`/login/${accountId}`);
    return get(response, 'data.connectionUrl');
  };
}

export default new AccountsAPI();
