import React from 'react';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { Typography } from '@getsynapse/design-system';
import { useHistory, useLocation } from 'react-router-dom';

const TabLink: React.FC<{
  tabKey: string;
  isActive: boolean;
  setCurrentTab: (tabKey: string) => void;
}> = ({ tabKey, isActive, setCurrentTab }) => {
  const borderClassNames = isActive && 'border-b-2 border-primary';

  const { pathname } = useLocation();
  const history = useHistory();

  const handleChangeTab = () => {
    setCurrentTab(tabKey);
    history.push(`${pathname}?tab=${tabKey}`);
  };

  return (
    <div
      data-cy={`tab-${tabKey}`}
      className={classnames('cursor-pointer ml-6', borderClassNames)}
      onClick={handleChangeTab}
    >
      <Typography
        variant='body2'
        className={classnames('capitalize', {
          'text-neutral-dark font-light': !isActive,
          'text-primary font-semibold': isActive,
        })}
      >
        {intl.get(`UPDATE_PROJECT_PAGE_TABS.${tabKey.toUpperCase()}`)}
      </Typography>
    </div>
  );
};

export default TabLink;
