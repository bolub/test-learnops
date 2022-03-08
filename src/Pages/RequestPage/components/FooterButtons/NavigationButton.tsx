import { MouseEvent } from 'react';
import { Button } from '@getsynapse/design-system';
import { RequestPageTabs } from 'utils/customTypes';

const NavigationButton = ({
  onClickHandler,
  variant,
  tabIndex,
  classes,
  label,
  iconName,
  iconPosition,
  testId,
  disabled,
}: {
  onClickHandler: (tabIndex?: RequestPageTabs) => void;
  variant: string;
  tabIndex?: RequestPageTabs;
  classes?: string;
  label: string;
  iconName?: string;
  iconPosition?: string;
  disabled?: boolean;
  testId?: string;
}) => {
  return (
    <Button
      variant={variant}
      size='small'
      type='button'
      iconName={iconName}
      iconPosition={iconPosition}
      className={classes}
      data-cy={testId}
      onClick={(event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        onClickHandler(tabIndex);
      }}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default NavigationButton;
