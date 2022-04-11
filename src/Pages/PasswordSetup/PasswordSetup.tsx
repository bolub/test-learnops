import {
  useState,
  FormEventHandler,
  ChangeEvent,
  useMemo,
  Fragment,
  useEffect,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import intl from 'react-intl-universal';
import Auth from '@aws-amplify/auth';
import {
  Button,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from '@getsynapse/design-system';
import { PATHS } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserBasicInfo,
  getUserBasicInfo,
  setRegistered,
} from 'state/User/userSlice';
import passwordSetupImage from 'assets/images/password-setup.svg';

const PasswordSetup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState({
    password: '',
    passwordConfirm: '',
    error: '',
    isSubmitting: false,
  });
  const userSelector = useSelector(selectUserBasicInfo);

  useEffect(() => {
    if (userId) {
      dispatch(getUserBasicInfo(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userSelector) {
      history.push(PATHS.LOGIN);
    }
  }, [userSelector, history]);

  const strength = useMemo(() => {
    if (data.password) {
      const length = data.password.length;
      if (length >= 16) {
        return intl.get('CHANGE_PASSWORD_PAGE.PASSWORD_LEVEL.STRONG');
      } else if (length >= 12) {
        return intl.get('CHANGE_PASSWORD_PAGE.PASSWORD_LEVEL.MEDIUM');
      } else {
        return intl.get('CHANGE_PASSWORD_PAGE.PASSWORD_LEVEL.WEAK');
      }
    } else return '';
  }, [data.password]);

  const passwordMatch = useMemo(() => {
    return data.password && data.password === data.passwordConfirm;
  }, [data]);

  const confirmProps = useMemo((): {
    state?: 'success' | 'error';
    helpText?: string;
  } | void => {
    if (passwordMatch) {
      return {
        state: 'success',
        helpText: intl.get('CHANGE_PASSWORD_PAGE.INPUT.MATCHED'),
      };
    } else if (data.passwordConfirm) {
      return {
        state: 'error',
        helpText: intl.get('CHANGE_PASSWORD_PAGE.INPUT.NO_MATCH'),
      };
    }
  }, [passwordMatch, data.passwordConfirm]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setData({ ...data, isSubmitting: true });
    const userInfo = {
      username: userSelector.email!,
      password: data.password,
      attributes: {
        given_name: userSelector.firstName,
        family_name: userSelector.lastName,
      },
    };
    try {
      await Auth.signUp(userInfo);
      dispatch(setRegistered(userId));
    } catch (error: any) {
      if (error.message) {
        setData({ ...data, error: error.message, isSubmitting: false });
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      error: '',
      [event.target.name]: event.target.value,
    });
  };

  const resendVerification = async () => {
    try {
      await Auth.resendSignUp(userSelector.email!);
    } catch (error: any) {
      if (error.message) {
        setData({ ...data, error: error.message, isSubmitting: false });
      }
    }
  };

  return (
    <Fragment>
      {!data.isSubmitting ? (
        <Fragment>
          <Typography
            variant='h4'
            className='mb-6 flex items-center justify-center'
          >
            {intl.get('PASSWORD_SETUP_PAGE.TITLE')}
            <Tooltip
              className='pl-2'
              contentProps={{
                className:
                  'bg-warning-lighter text-warning-dark text-xs rounded px-4 py-2 w-56 absolute z-40',
              }}
              trigger={
                <IconButton
                  description='trigger'
                  name='information-circle'
                  iconClassname='text-xl text-warning-dark'
                />
              }
              position='bottomRight'
            >
              {intl.get('CHANGE_PASSWORD_PAGE.INFO.TITLE')}
              <ul className='list-disc pl-5'>
                {intl.getHTML('CHANGE_PASSWORD_PAGE.INFO.CONTENT')}
              </ul>
            </Tooltip>
          </Typography>

          <Typography className='mb-6'>
            {intl.getHTML('PASSWORD_SETUP_PAGE.PROMPT', {
              email: userSelector?.email,
            })}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              name='password'
              className='mb-8'
              label={intl.get('PASSWORD_SETUP_PAGE.INPUT.PASSWORD')}
              placeholder={intl.get('CHANGE_PASSWORD_PAGE.INPUT.PLACEHOLDER')}
              onChange={handleChange}
              variant='password'
              value={data.password}
              state={data.error ? 'error' : undefined}
              helpText={
                strength && data.error
                  ? intl.get('CHANGE_PASSWORD_PAGE.INPUT.INCORRECT_FORMAT')
                  : strength && (
                      <Typography
                        className='text-neutral-black'
                        variant='caption'
                      >
                        <strong className='font-semibold'>
                          {intl.get(
                            'CHANGE_PASSWORD_PAGE.PASSWORD_LEVEL.STRENGTH'
                          )}
                        </strong>
                        {strength}
                      </Typography>
                    )
              }
            />

            <TextField
              name='passwordConfirm'
              label={intl.get('CHANGE_PASSWORD_PAGE.INPUT.CONFIRM')}
              placeholder={intl.get('CHANGE_PASSWORD_PAGE.INPUT.PLACEHOLDER')}
              className='mb-10'
              onChange={handleChange}
              variant='password'
              value={data.passwordConfirm}
              {...confirmProps}
            />

            <Button
              type='submit'
              className='w-full justify-center'
              disabled={!passwordMatch}
              loading={data.isSubmitting}
            >
              {intl.get('PASSWORD_SETUP_PAGE.BUTTON')}
            </Button>
          </form>
        </Fragment>
      ) : (
        <Fragment>
          <Typography variant='h2' className='mb-8'>
            {intl.get('PASSWORD_SETUP_PAGE.SUCCESS_MESSAGE.TITLE')}
          </Typography>
          <div className='flex justify-center'>
            <img src={passwordSetupImage} alt='' />
          </div>
          <Typography className='mt-8 text-center mb-4'>
            {intl.get('PASSWORD_SETUP_PAGE.SUCCESS_MESSAGE.LINE_ONE')}
          </Typography>
          <div className='flex justify-center items-center'>
            <Typography>
              {intl.get('PASSWORD_SETUP_PAGE.SUCCESS_MESSAGE.LINE_TWO')}
            </Typography>
            <Button variant='tertiary' onClick={resendVerification}>
              {intl.get('PASSWORD_SETUP_PAGE.SUCCESS_MESSAGE.LINK')}
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default PasswordSetup;
