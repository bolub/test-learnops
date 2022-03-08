import Auth from '@aws-amplify/auth';
import { Icon } from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';

import { PATHS } from 'utils/constants';

import logout from 'assets/icons/logout.svg';

const LogoutButton = ({ isExpanded }: { isExpanded: boolean }) => {
  const logoutHandle = async () => {
    await Auth.signOut();
    window.location.replace(PATHS.LOGIN);
  };

  return (
    <button
      onClick={logoutHandle}
      className={classnames(
        'flex',
        'h-10',
        'items-center',
        'text-center',
        'text-neutral-white',
        'hover:bg-primary-dark',
        'hover:opacity-50',
        'hover:text-neutral-white',
        'rounded',
        'text-sm',
        'leading-6',
        'px-2',
        'focus:outline-none'
      )}
      data-cy='logout-button'
    >
      <Icon
        src={logout}
        className={classnames('h-5', 'w-5', 'text-neutral-white')}
        aria-label={intl.get('SIDEBAR.LOGOUT')}
      />
      {isExpanded && <span className='ml-2'>{intl.get('SIDEBAR.LOGOUT')}</span>}
    </button>
  );
};

export default LogoutButton;
