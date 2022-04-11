import { useMemo, Fragment, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import intl from 'react-intl-universal';
import Auth from '@aws-amplify/auth';
import { Button, Typography } from '@getsynapse/design-system';
import { PATHS } from 'utils/constants';
import verifyImage from 'assets/images/verify-image.svg';

const ChangePassword = () => {
  const location = useLocation();
  const history = useHistory();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const username = query.get('username');
  const code = query.get('code');

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await Auth.confirmSignUp(username!, code!);
        setTimeout(() => {
          history.push(PATHS.LOGIN);
        }, 5000);
      } catch (error: any) {
        return;
      }
    };
    if (query && (!username || !code)) {
      history.push(PATHS.LOGIN);
    } else {
      verifyUser();
    }
  }, [query, username, code, history]);

  return (
    <Fragment>
      <Typography variant='h2' className='mb-8 text-center'>
        {intl.get('VERIFY_PAGE.TITLE')}
      </Typography>
      <div className='flex justify-center'>
        <img src={verifyImage} alt='' />
      </div>
      <Typography className='mt-10 text-center mb-4'>
        {intl.get('VERIFY_PAGE.BODY.LINE_ONE')}
      </Typography>
      <div className='flex justify-center items-center'>
        <Typography>{intl.get('VERIFY_PAGE.BODY.LINE_TWO')}</Typography>
        <Button variant='tertiary' onClick={() => history.push(PATHS.LOGIN)}>
          {intl.get('VERIFY_PAGE.LINK')}
        </Button>
      </div>
    </Fragment>
  );
};

export default ChangePassword;
