import { Auth } from 'aws-amplify';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import {
  getUser,
  selectUser,
  selectUserSliceStatus,
} from 'state/User/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS, USER_STATUS } from 'utils/constants';
import { useHistory } from 'react-router-dom';

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userSliceStatus = useSelector(selectUserSliceStatus);
  const user = useSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    const initSession = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        dispatch(getUser(user.attributes.email));
      } catch (error) {
        history.push(`${PATHS.LOGIN}?redirect=${window.location.pathname}`);
      }
    };

    initSession();
  }, [dispatch, history]);

  useEffect(() => {
    if (userSliceStatus === 'idle' && !isEmpty(user)) {
      if (
        user.status === USER_STATUS.INVITED_DISABLED ||
        user.status === USER_STATUS.REGISTERED_DISABLED
      ) {
        history.push(PATHS.DEACTIVATED_ACCOUNT);
      } else {
        setIsAuthenticated(true);
      }
    } else if (userSliceStatus === 'failed') {
      history.push(`${PATHS.LOGIN}?redirect=${window.location.pathname}`);
    }
  }, [userSliceStatus, user, history]);

  return isAuthenticated;
};

export default useAuthentication;
