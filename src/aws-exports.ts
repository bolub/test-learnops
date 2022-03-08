import config from 'config/Config';
import { AUTH_CONSTANTS } from 'utils/constants';
import { Amplify, Hub, Auth } from 'aws-amplify';

const awsConfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.get('authentication.region'),
    userPoolId: config.get('authentication.poolId'),
    userPoolWebClientId: config.get('authentication.clientId'),
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    oauth: {
      domain: config.get('authentication.oauthDomain'),
      scope: AUTH_CONSTANTS.SCOPE,
      redirectSignIn: config.get('authentication.redirectSignIn'),
      redirectSignOut: config.get('authentication.redirectSignOut'),
      responseType: AUTH_CONSTANTS.RESPONSE_TYPE,
    },
  },
};

const onLogin: () => Promise<void> = async () => {
  try {
    await Auth.currentAuthenticatedUser();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const checkUser: () => Promise<any> = async () => {
  return await Auth.currentAuthenticatedUser();
};

export const initAuthentication: () => void = () => {
  Amplify.configure(awsConfig);
  Hub.listen('auth', (response) => {
    switch (response.payload.event) {
      case 'signIn':
        onLogin();
        break;
    }
  });
};
