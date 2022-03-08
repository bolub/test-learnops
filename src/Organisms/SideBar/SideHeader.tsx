import { Dispatch, SetStateAction } from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { IconButton } from '@getsynapse/design-system';

import logo from 'assets/icons/logo-white.svg';
import menu from 'assets/icons/menu.svg';

const SideHeader = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className={classnames('flex', 'mb-10', 'justify-center')}>
      {isExpanded && (
        <img
          src={logo}
          data-testid='logo-section'
          className='mr-3.5'
          alt='logo'
        />
      )}

      <IconButton
        description={intl.get('COLLAPSE_EXPAND_ICON_DESC')}
        src={menu}
        className={classnames('bg-primary-dark', 'rounded-sm', 'h-4', 'w-4')}
        hasASize={false}
        onClick={() => setIsExpanded((prev) => !prev)}
        data-cy='expand-collapse_sidebar'
      />
    </div>
  );
};

export default SideHeader;
