import { useElevation } from '@getsynapse/design-system';
import { useState } from 'react';
import classnames from 'classnames';

import SideNav from './SideNav';

import SideHeader from './SideHeader';
import LogoutButton from './LogouButton';

const SideBar = () => {
  const skimClass = useElevation(1);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={classnames(
        skimClass,
        'bg-primary',
        'flex',
        'flex-col',
        'px-2',
        'pt-4',
        'pb-8',
        'relative',
        'z-20',
        'transition-width',
        'duration-150 ease-in',
        'motion-safe',
        { 'w-34': isExpanded },
        { 'w-16': !isExpanded }
      )}
    >
      <SideHeader isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <SideNav isExpanded={isExpanded} />

      <LogoutButton isExpanded={isExpanded} />
    </div>
  );
};

export default SideBar;
