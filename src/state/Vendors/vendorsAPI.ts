import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { ProjectVendor } from 'utils/customTypes';

class VendorsAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchVendors = async () => {
    const { data } = await this.instance.get('vendor');
    return data;
  };

  createVendor = async (vendorData: Partial<ProjectVendor>) => {
    const { data } = await this.instance.post('vendor', vendorData);
    return data;
  };

  fetchVendor = async (vendorId: string) => {
    const { data } = await this.instance.get(`vendor/${vendorId}`);
    return data;
  };

  editVendor = async (vendorId: string, newData: Partial<ProjectVendor>) => {
    const { data } = await this.instance.put(`vendor/${vendorId}`, {
      updateFields: newData,
    });
    return data;
  };
}
export default new VendorsAPI();
