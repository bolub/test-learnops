import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { TimeOff, TimeOffType } from 'utils/customTypes';
class TimeOffAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  createTimeOff: (newTimeOff: TimeOff) => Promise<any> = async (newTimeOff) => {
    const { data } = await this.instance.post(`user/timeOff`, newTimeOff);
    return data;
  };

  fetchTimeOffInfo = async (timeOffId: string) => {
    const { data } = await this.instance.get(`user/timeOff/${timeOffId}`);
    return data;
  };

  fetchUserTimeOffs = async (userId: string) => {
    const { data } = await this.instance.get(
      `user/timeoff/currentYear/${userId}`
    );
    return data;
  };

  updateTimeOffData: (
    timeOffId: string,
    newTimeOffType: TimeOffType
  ) => Promise<any> = async (timeoffId, newTimeOffType) => {
    const { data } = await this.instance.patch(`user/timeOff/${timeoffId}`, {
      newTimeOffType: newTimeOffType,
    });
    return data;
  };

  updateTimeOff: (
    timeOffId: string,
    newTimeOffType: TimeOffType
  ) => Promise<any> = async (timeoffId, newTimeOffType) => {
    const { data } = await this.instance.put(`user/timeOff/${timeoffId}`, {
      newTimeOffType: newTimeOffType,
    });
    return data;
  };

  deleteTimeOff: (timeOffId: string) => Promise<any> = async (timeoffId) => {
    const { data } = await this.instance.delete(`user/timeOff/${timeoffId}`);
    return data;
  };
}
export default new TimeOffAPI();
