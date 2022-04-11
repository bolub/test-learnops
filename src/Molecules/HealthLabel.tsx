import intl from 'react-intl-universal';
import { Typography, tailwindOverride } from '@getsynapse/design-system';
import { PROJECT_HEALTH } from 'utils/constants';
import { objKeyAsString, ProjectHealth } from 'utils/customTypes';

type HealthLabelProps = {
  health: ProjectHealth;
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
};
const HealthLabel = ({
  health,
  className,
  indicatorClassName,
  labelClassName,
}: HealthLabelProps) => {
  const healthMapping: objKeyAsString = {
    [PROJECT_HEALTH.OFF_TRACK]: {
      color: 'bg-error',
      label: intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.OFF_TRACK'),
    },
    [PROJECT_HEALTH.ON_TRACK]: {
      color: 'bg-success',
      label: intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.ON_TRACK'),
    },
    [PROJECT_HEALTH.AT_RISK]: {
      color: 'bg-warning',
      label: intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.AT_RISK'),
    },
  };
  return (
    <div className={tailwindOverride('flex items-center', className)}>
      <div
        className={tailwindOverride(
          'w-2 h-2 rounded-full mr-3',
          healthMapping[health].color,
          indicatorClassName
        )}
      />
      <Typography className={tailwindOverride('text-caption', labelClassName)}>
        {healthMapping[health].label}
      </Typography>
    </div>
  );
};

export default HealthLabel;
