import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { resetUser } from 'state/User/userSlice';
import { ReactComponent as Logo } from 'assets/images/deactivated-user.svg';
import { Typography, useLink } from '@getsynapse/design-system';
import { PATHS } from 'utils/constants';

const DeactivatedAccountPage = () => {
  const dispatch = useDispatch();
  const linkClassName = useLink();

  useEffect(() => {
    dispatch(resetUser());
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center'>
      <Typography variant='h2' weight='medium' className='mb-5 text-center'>
        {intl.get('DEACTIVATED_USER_PAGE.TITLE')}
      </Typography>

      <Logo />

      <Typography className='mt-6 mb-8'>
        {intl.get('DEACTIVATED_USER_PAGE.CAPTION')}
      </Typography>

      <Link to={PATHS.LOGIN} className={linkClassName}>
        {intl.get('DEACTIVATED_USER_PAGE.CTA')}
      </Link>
    </div>
  );
};

export default DeactivatedAccountPage;
