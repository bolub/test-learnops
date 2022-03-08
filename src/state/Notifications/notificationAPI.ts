import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class NotificationAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchNotifications = async () => {
    const { data } = await this.instance.get(`notifications/`);
    return data;
  };

  updateNotification = async (id: string, updateData: any) => {
    const { data } = await this.instance.put(
      `notifications/${id}/`,
      updateData
    );
    return data;
  };

  markAllAsRead = async () => {
    const { data } = await this.instance.put('notifications/mark-read');
    return data;
  };

  markAllAsSeen = async () => {
    const { data } = await this.instance.put('notifications/mark-seen');
    return data;
  };
}
export default new NotificationAPI();
