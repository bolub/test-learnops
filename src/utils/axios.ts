import Auth from '@aws-amplify/auth';
import axios, { AxiosError } from 'axios';
import config from 'config/Config';

export const initAxios = (baseURL: string) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use(async (config) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      config.headers.common['Authorization'] = `bearer ${token}`;
    } catch (error) {
      config.headers.common['Authorization'] = undefined;
    }

    return config;
  });
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        //! TODO: replace this for an error boundry flow to be handled in react
        window.location.href = config.get('authentication.redirectSignOut');
      }
      return error;
    }
  );
  return instance;
};
