import {
  ChangeEventHandler,
  FormEventHandler,
  Fragment,
  useRef,
  useState,
} from 'react';
import intl from 'react-intl-universal';
import {
  Button,
  Icon,
  TextField,
  Typography,
  useLink,
} from '@getsynapse/design-system';
import { Link } from 'react-router-dom';
import { PATHS } from 'utils/constants';
import Auth from '@aws-amplify/auth';

const SendEmailForm = ({ onSubmit }: { onSubmit: (sent: boolean) => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputState, setInputState] = useState<'default' | 'error'>('default');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const ref = useRef<HTMLInputElement>(null);

  const validateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
    const email = event.target.value;
    var emailReg = /^([\w-+.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const isEmpty = !Boolean(email);
    const isEmail = emailReg.test(email);
    setDisabled(isEmpty || !isEmail);
    if (!isEmail) {
      setErrorMessage(intl.get('ERROR_MESSAGE.INVALID_FORMAT'));
      setInputState('error');
    } else {
      setErrorMessage(undefined);
      setInputState('default');
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    const email: string = ref.current?.value || '';
    try {
      await Auth.forgotPassword(email);
      onSubmit(true);
    } catch (error) {
      setErrorMessage(intl.get('ERROR_MESSAGE.USER_NOT_REGISTERED'));
      setInputState('error');
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Typography variant='body' className='mb-6 text-neutral-black'>
        {intl.get('FORGOT_PAGE.PROMPT')}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          ref={ref}
          label={intl.get('FORGOT_PAGE.INPUT.LABEL')}
          placeholder={intl.get('FORGOT_PAGE.INPUT.PLACEHOLDER')}
          className='mb-6'
          onChange={validateEmail}
          state={inputState}
          helpText={errorMessage}
          data-cy='forgot-password-input__email'
        />

        <Button
          type='submit'
          className='w-full justify-center'
          disabled={disabled}
          loading={loading}
          data-cy='forgot-password-submit__button'
        >
          {intl.get('FORGOT_PAGE.BUTTON')}
        </Button>
      </form>
    </Fragment>
  );
};

const SentEmailMessage = ({
  resetPage,
}: {
  resetPage: (sent: boolean) => void;
}) => {
  const internalLink = useLink();

  return (
    <Fragment>
      <div className='flex mb-4'>
        <div className='w-6'>
          <Icon
            name='checkmark-circle'
            className='text-success-dark text-2xl'
          />
        </div>

        <Typography className='ml-2 text-neutral-black'>
          {intl.get('FORGOT_PAGE.SUCCESS_MESSAGE')}
        </Typography>
      </div>

      <Link
        to={PATHS.FORGOT_PASSWORD}
        onClick={() => resetPage(false)}
        className={internalLink}
      >
        {intl.get('FORGOT_PAGE.FAIL_PROMPT')}
      </Link>
    </Fragment>
  );
};

const ForgotPassword = () => {
  const [sent, setSent] = useState<boolean>(false);

  return (
    <Fragment>
      <Typography variant='h5' className='mb-4 text-neutral-black'>
        {intl.get('FORGOT_PAGE.TITLE')}
      </Typography>

      {!sent && <SendEmailForm onSubmit={setSent} />}

      {sent && <SentEmailMessage resetPage={setSent} />}
    </Fragment>
  );
};

export default ForgotPassword;
