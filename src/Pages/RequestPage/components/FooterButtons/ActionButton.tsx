import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@getsynapse/design-system';

const ActionButton = ({
  action,
  variant,
  className,
  children,
  testId,
  hasErrors = false,
  disabled = false,
}: {
  action: () => Promise<void>;
  variant: string;
  className?: string;
  children: ReactNode;
  testId?: string;
  hasErrors?: boolean;
  disabled?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasErrors) {
      setIsLoading(false);
    }
  }, [hasErrors]);
  const handleClick = () => {
    if (!hasErrors) {
      setIsLoading(true);
    }
    action();
  };
  return (
    <Button
      variant={variant}
      size='small'
      type='button'
      className={className}
      onClick={handleClick}
      loading={isLoading}
      data-cy={testId}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
