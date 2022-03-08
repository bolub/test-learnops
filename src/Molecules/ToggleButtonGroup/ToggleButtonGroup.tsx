import React, { useState } from 'react';
import classnames from 'classnames';
import { Button } from '@getsynapse/design-system';

interface ToggleButton {
  className?: string;
  children: (isSelected: boolean) => JSX.Element;
  key: string;
  'data-cy'?: string;
}

const ToggleButtonGroup: React.FC<{
  className?: string;
  buttonsList: ToggleButton[];
  onChange: (value: string) => void;
  defaultSelected?: string;
}> = ({ className, buttonsList, onChange, defaultSelected }) => {
  const [selectedButton, setSelectedButton] = useState(defaultSelected);
  const handleToggleSelectedButton = (key: string) => {
    setSelectedButton(key);
    onChange(key);
  };
  return (
    <div
      className={classnames(
        'h-8 p-1 flex bg-neutral-lightest shadow-toggle-button-group rounded',
        className
      )}
    >
      {buttonsList.map((button: ToggleButton, index: number) => {
        const isSelected = selectedButton === button.key;
        return (
          <Button
            key={index}
            size='small'
            variant='tertiary'
            onClick={() => handleToggleSelectedButton(button.key)}
            data-cy={button['data-cy']}
            className={classnames(
              'p-1 h-6 w-6 item-center justify-center',
              {
                'bg-primary text-neutral-white hover:bg-primary hover:bg-primary-dark':
                  isSelected,
                'bg-lightest text-neutral-dark hover:bg-neutral-lighter':
                  !isSelected,
              },
              button.className
            )}
          >
            {button.children(isSelected)}
          </Button>
        );
      })}
    </div>
  );
};

export default ToggleButtonGroup;
