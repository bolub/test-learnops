import { useState, useRef, Fragment, useEffect, useCallback } from 'react';
import intl from 'react-intl-universal';
import {
  useLink,
  Typography,
  TextField,
  Checkbox,
  Button,
} from '@getsynapse/design-system';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { PATHS, USER_STATUS } from 'utils/constants';
import classnames from 'classnames';
import { state } from '@getsynapse/design-system/dist/Molecules/Input/Input';
import Auth from '@aws-amplify/auth';
import accountsAPI from 'Services/accountsAPI';
import * as Cookies from 'js-cookie';
import isEmpty from 'lodash/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  resetUser,
  selectUser,
  selectUserSliceStatus,
} from 'state/User/userSlice';

interface InputType {
  state: state;
  helpText: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const userSliceStatus = useSelector(selectUserSliceStatus);
  const user = useSelector(selectUser);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rememberChkRef = useRef<HTMLInputElement>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>(PATHS.ROOT);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<InputType>({
    state: 'default',
    helpText: '',
  });
  const [password, setPassword] = useState<InputType>({
    state: 'default',
    helpText: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();

  const validateEnterpriseConnection = useCallback(
    async (accountId, redirectTo) => {
      const connectionUrl = await accountsAPI.getEnterpriseConnection(
        accountId
      );
      if (connectionUrl) {
        Cookies.set('connectionUrl', connectionUrl);
        if (redirectTo) {
          Cookies.set('redirectUrl', redirectTo);
        } else {
          Cookies.set('redirectUrl', PATHS.ROOT);
        }
        history.push(PATHS.SSO_AUTHENTICATION_PAGE);
      } else {
        dispatch(resetUser());
      }
    },
    [dispatch, history]
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const redirectTo = query.get('redirect');
    const accountId = query.get('accountId');
    if (accountId) {
      validateEnterpriseConnection(accountId, redirectTo);
    }
    if (redirectTo) {
      setRedirectUrl(redirectTo);
    }
  }, [location.search, validateEnterpriseConnection]);

  const validateEmail = (email: string) => {
    var emailReg = /^([\w-+.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const isEmailValid = emailReg.test(email);
    if (!isEmailValid) {
      setEmail({
        state: 'error',
        helpText: intl.get('LOGIN_PAGE.INPUT.INVALID_HELP_TEXT'),
      });
    }
    return isEmailValid;
  };

  const resetInputStates = () => {
    setEmail({
      state: 'default',
      helpText: '',
    });
    setPassword({
      state: 'default',
      helpText: '',
    });
  };

  const validateInputs = () => {
    resetInputStates();
    let validInput = true;
    if (!emailRef.current!.value) {
      setEmail({
        state: 'error',
        helpText: intl.get('LOGIN_PAGE.INPUT.EMPTY_HELP_TEXT'),
      });
      validInput = false;
    } else {
      validInput = validateEmail(emailRef.current!.value);
    }
    if (!passwordRef.current!.value) {
      setPassword({
        state: 'error',
        helpText: intl.get('LOGIN_PAGE.INPUT.EMPTY_HELP_TEXT'),
      });
      validInput = false;
    }
    setButtonDisabled(!validInput);
  };

  const createRemeberMeCookie = (userDataCookie: string) => {
    const cookieName = `${userDataCookie}.remember`;
    Cookies.set(cookieName, rememberChkRef.current!.checked.toString(), {
      expires: 365,
      path: '/',
    });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    validateInputs();
    try {
      await Auth.signOut();
      const user = await Auth.signIn(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      createRemeberMeCookie(user.userDataKey);
      dispatch(getUser(user.attributes.email));
    } catch (error: any) {
      setLoading(false);
      switch (error.code) {
        case 'UserNotFoundException':
          setEmail({
            state: 'error',
            helpText: intl.get('LOGIN_PAGE.INPUT.USER_NOT_FOUND'),
          });
          break;
        case 'NotAuthorizedException':
          setPassword({
            state: 'error',
            helpText: intl.get('LOGIN_PAGE.INPUT.PASSWORD_NOT_MATCH'),
          });
          dispatch(getUser(emailRef.current!.value));
          break;
        default:
          resetInputStates();
      }
    }
  };

  useEffect(() => {
    const handleError = async () => {
      await Auth.signOut();
      setLoading(false);
    };

    if (userSliceStatus === 'idle' && !isEmpty(user)) {
      if (password.state === 'error') {
        validateEnterpriseConnection(user.organization_id, redirectUrl);
      } else if (
        user.status === USER_STATUS.INVITED_DISABLED ||
        user.status === USER_STATUS.REGISTERED_DISABLED
      ) {
        history.push(PATHS.DEACTIVATED_ACCOUNT);
      } else {
        history.push(redirectUrl);
      }
    } else if (userSliceStatus === 'failed') {
      handleError();
    }
  }, [
    userSliceStatus,
    user,
    redirectUrl,
    history,
    password.state,
    validateEnterpriseConnection,
  ]);

  return (
    <Fragment>
      <Typography
        variant='h2'
        weight='medium'
        className={classnames('text-neutral-black', 'text-center')}
      >
        {intl.get('LOGIN_PAGE.HEADING')}
      </Typography>
      <Typography
        variant='body2'
        className={classnames('text-neutral-dark', 'mb-16', 'text-center')}
      >
        {intl.get('LOGIN_PAGE.SLOGAN')}
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label={intl.get('LOGIN_PAGE.INPUT.EMAIL_INPUT.LABEL')}
          placeholder={intl.get('LOGIN_PAGE.INPUT.EMAIL_INPUT.PLACEHOLDER')}
          className='mb-6'
          ref={emailRef}
          state={email.state}
          helpText={email.helpText}
          onChange={validateInputs}
          data-cy='login-input__email'
          id='login-input__email'
        />
        <TextField
          label={intl.get('LOGIN_PAGE.INPUT.PASSWORD_INPUT.LABEL')}
          variant='password'
          placeholder={intl.get('LOGIN_PAGE.INPUT.PASSWORD_INPUT.PLACEHOLDER')}
          ref={passwordRef}
          state={password.state}
          helpText={password.helpText}
          onChange={validateInputs}
          data-cy='login-input__password'
          id='login-input__password'
        />
        <div className={classnames('flex', 'mt-6', 'mb-10', 'justify-between')}>
          <Checkbox
            label={intl.get('LOGIN_PAGE.REMEMBER_ME')}
            inputProps={{ ref: rememberChkRef }}
            data-cy='login-input__remember-me'
          />
          <Link
            to={PATHS.FORGOT_PASSWORD}
            className={classnames('no-underline', useLink())}
            data-cy='forgot-password__link'
          >
            {intl.get('LOGIN_PAGE.FORGET_PASSWORD_LINK')}
          </Link>
        </div>
        <Button
          variant='primary'
          className={classnames('w-full', 'justify-center')}
          disabled={buttonDisabled}
          loading={loading}
          type='submit'
          data-cy='login-submit__button'
        >
          {intl.get('LOGIN_PAGE.BUTTON')}
        </Button>
      </form>
    </Fragment>
  );
};

export default Login;
