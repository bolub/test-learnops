import lowPriority from 'assets/icons/low-priority.svg';
import mediumPriority from 'assets/icons/medium-priority.svg';
import highPriority from 'assets/icons/high-priority.svg';
import intl from 'react-intl-universal';
import { PROJECT_PRIORITY } from 'utils/constants';
import { Icon, Typography, tailwindOverride } from '@getsynapse/design-system';

const PriorityLabel = ({ priority }: { priority: string }) => {
  const iconMapping: { [key: string]: string } = {
    [PROJECT_PRIORITY.LOW]: lowPriority,
    [PROJECT_PRIORITY.MEDIUM]: mediumPriority,
    [PROJECT_PRIORITY.HIGH]: highPriority,
  };
  return (
    <div className='flex items-center'>
      <Icon
        src={iconMapping[priority]}
        className={tailwindOverride('h-5', 'w-5')}
      />
      <Typography variant='caption'>
        {intl.get(`PROJECT_DETAIL.PRIORITY_OPTIONS.${priority.toUpperCase()}`)}
      </Typography>
    </div>
  );
};

export default PriorityLabel;
