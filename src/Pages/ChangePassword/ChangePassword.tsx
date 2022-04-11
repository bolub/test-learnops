import {
  useState,
  FormEventHandler,
  ChangeEvent,
  useMemo,
  Fragment,
  useEffect,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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

const ChangePassword = () => {
  const location = useLocation();
  const history = useHistory();
  const [data, setData] = useState({
    password: '',
    passwordConfirm: '',
    error: '',
    isSubmitting: false,
  });

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const username = query.get('username');
  const code = query.get('code');

  useEffect(() => {
    if (query && (!username || !code)) {
      history.push(PATHS.LOGIN);
    }
  }, [query, username, code, history]);

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
    if (username && code && data.password) {
      try {
        await Auth.forgotPasswordSubmit(username, code, data.password);
        history.push(PATHS.LOGIN);
        setData({ ...data, isSubmitting: false });
      } catch (error: any) {
        if (error.message) {
          setData({ ...data, error: error.message, isSubmitting: false });
        }
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

  return (
    <Fragment>
      <Typography
        variant='h4'
        className='mb-6 flex items-center justify-center'
      >
        {intl.get('CHANGE_PASSWORD_PAGE.TITLE')}
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
        {intl.get('CHANGE_PASSWORD_PAGE.PROMPT')}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name='password'
          className='mb-8'
          label={intl.get('CHANGE_PASSWORD_PAGE.INPUT.PASSWORD')}
          placeholder={intl.get('CHANGE_PASSWORD_PAGE.INPUT.PLACEHOLDER')}
          onChange={handleChange}
          variant='password'
          value={data.password}
          state={data.error ? 'error' : undefined}
          helpText={
            strength && data.error
              ? intl.get('CHANGE_PASSWORD_PAGE.INPUT.INCORRECT_FORMAT')
              : strength && (
                  <Typography className='text-neutral-black' variant='caption'>
                    <strong className='font-semibold'>
                      {intl.get('CHANGE_PASSWORD_PAGE.PASSWORD_LEVEL.STRENGTH')}
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
          {intl.get('CHANGE_PASSWORD_PAGE.BUTTON')}
        </Button>
      </form>
    </Fragment>
  );
};

export default ChangePassword;
