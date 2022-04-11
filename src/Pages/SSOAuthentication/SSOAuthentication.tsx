import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { getUser, selectUser } from 'state/User/userSlice';
import Loader from 'Molecules/Loader/Loader';
import { PATHS, USER_STATUS } from 'utils/constants';

const SSOAuthentication = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (
        user.status === USER_STATUS.INVITED_DISABLED ||
        user.status === USER_STATUS.REGISTERED_DISABLED
      ) {
        history.push(PATHS.DEACTIVATED_ACCOUNT);
      } else {
        const redirectUrl = Cookies.get('redirectUrl');
        Cookies.remove('redirectUrl');
        if (redirectUrl) {
          history.replace(redirectUrl);
        }
      }
    }
  }, [history, user]);

  useEffect(() => {
    const validateUserSession = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await dispatch(getUser(user.attributes.email));
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
