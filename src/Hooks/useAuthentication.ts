import { Auth } from 'aws-amplify';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import {
  getUser,
  selectUser,
  selectUserSliceStatus,
} from 'state/User/userSlice';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { PATHS } from 'utils/constants';
import { useHistory } from 'react-router-dom';

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userSliceStatus = useAppSelector(selectUserSliceStatus);
  const user = useAppSelector(selectUser);
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
      setIsAuthenticated(true);
    } else if (userSliceStatus === 'failed') {
      history.push(`${PATHS.LOGIN}?redirect=${window.location.pathname}`);
    }
  }, [userSliceStatus, user, history]);

  return isAuthenticated;
};

export default useAuthentication;
