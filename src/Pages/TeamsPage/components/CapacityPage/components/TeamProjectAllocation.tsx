import { tailwindOverride, Typography } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { PROJECT_STATUS } from 'utils/constants';

type TeamProjectAllocationProps = {
  isFirst: boolean;
  isLast: boolean;
  status: string;
  hours: number;
};

const TeamProjectAllocation = ({
  isFirst,
  isLast,
  status,
  hours,
}: TeamProjectAllocationProps) => {
  const statusMapping: { [key: string]: string } = {
    [PROJECT_STATUS.NEW]: 'success',
    [PROJECT_STATUS.IN_PLANNING]: 'warning',
    [PROJECT_STATUS.IN_PROGRESS]: 'teal',
    [PROJECT_STATUS.COMPLETED]: 'purple',
    [PROJECT_STATUS.CANCELED]: 'error',
    [PROJECT_STATUS.ON_HOLD]: 'neutral',
    [PROJECT_STATUS.CLOSED]: 'primary',
  };

  return (
    <div
      className={tailwindOverride(
        'w-full h-6 flex items-center',
        'border-b-2',
        `bg-${statusMapping[status]}-lighter`,
        `border-${statusMapping[status]}-dark`,
        {
          'justify-start': isFirst && !isLast,
          'justify-end': isLast && !isFirst,
          'justify-between': isFirst && isLast,
        }
      )}
    >
      {isFirst && (
        <Typography
          variant='caption'
          className={tailwindOverride(
            'pl-2 font-semibold',
            `text-${statusMapping[status]}-dark`
          )}
        >
          {intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${status.toUpperCase()}`)}
        </Typography>
      )}
      {isLast && (
        <Typography
          variant='caption'
          className={tailwindOverride(
            'pr-2 font-semibold',
            `text-${statusMapping[status]}-dark`
          )}
        >
          {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.HOURS', { hours })}
        </Typography>
      )}
    </div>
  );
};
export default TeamProjectAllocation;
