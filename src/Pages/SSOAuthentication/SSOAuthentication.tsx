import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useAppDispatch } from 'state/hooks';
import { getUser } from 'state/User/userSlice';
import Loader from 'Molecules/Loader/Loader';
import { PATHS } from 'utils/constants';

const SSOAuthentication = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateUserSession = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await dispatch(getUser(user.attributes.email));
        const redirectUrl = Cookies.get('redirectUrl');
        Cookies.remove('redirectUrl');
        if (redirectUrl) {
          history.replace(redirectUrl);
        }
      } catch (error) {
        history.replace(PATHS.LOGIN);
      }
    };

    const connectionUrl = Cookies.get('connectionUrl') || '';
    if (connectionUrl) {
      Cookies.remove('connectionUrl');
      window.location.href = connectionUrl;
    } else {
      validateUserSession();
    }
  }, [history, dispatch]);

  return (
    <div className='flex h-screen px-16'>
      <Loader />
    </div>
  );
};

SSOAuthentication.propTypes = {};

export default SSOAuthentication;
