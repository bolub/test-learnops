import React, { useState } from 'react';
import {
  Button,
  Icon,
  List,
  Popup,
  Typography,
} from '@getsynapse/design-system';
import classNames from 'classnames';
import { useRef } from 'react';
import intl from 'react-intl-universal';
import { MoreActionsOption } from 'utils/customTypes';
import { TASKS_MORE_ACTIONS } from 'utils/constants';
import DeleteTask from '../DeleteTask/DeleteTask';

const MoreActionsDropdown: React.FC<{
  moreActionsOptions: Array<MoreActionsOption>;
  deleteTaskCallback: () => void;
}> = ({ moreActionsOptions, deleteTaskCallback }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [displayDeleteTaskModal, setDisplayDeleteTaskModal] = useState(false);

  const handleSelectOption = (option: MoreActionsOption) => {
    if (option.selectOption) {
      option.selectOption();
    }

    if (option.value === TASKS_MORE_ACTIONS.DELETE) {
      setDisplayDeleteTaskModal(true);
    }
  };
  return (
    <React.Fragment>
      <DeleteTask
        confirmDeleteTask={deleteTaskCallback}
        shouldDisplayModal={displayDeleteTaskModal}
        onCloseModal={() => setDisplayDeleteTaskModal(false)}
      />
      <Popup
        position='bottom-end'
        extraDivRefs={[ref]}
        trigger={({ isOpen }) => (
          <Button
            size='small'
            variant='tertiary'
            className={classNames({
              'bg-neutral-lightest border-transparent': isOpen,
            })}
            data-cy='tasks-more-actions-button'
          >
            {intl.get('REQUEST_PAGE.TOP_BAR.MORE.MORE_ACTIONS')}
            <Icon
              name={isOpen ? 'caret-up' : 'caret-down'}
              className='text-xs pl-2'
            />
          </Button>
        )}
      >
        {() => (
          <List
            options={moreActionsOptions}
            renderOption={(
              option: MoreActionsOption,
              isSelected: boolean,
              selectOption: () => void
            ) => (
              <li
                onClick={selectOption}
                data-cy={option.dataCy}
                className='group py-2 px-6 flex justify-center items-center cursor-pointer'
              >
                <Icon
                  name={option.iconName}
                  src={option.iconSrc}
                  className={classNames(
                    'mr-2 text-xl',
                    {
                      'text-neutral-black group-hover:text-primary':
                        !option.iconClassName,
                    },
                    { [`${option.iconClassName}`]: option.iconClassName }
                  )}
                />
                <Typography
                  variant='body2'
                  className='text-neutral-black group-hover:text-primary'
                >
                  {option.label}
                </Typography>
              </li>
            )}
            onSelectOption={handleSelectOption}
          />
        )}
      </Popup>
    </React.Fragment>
  );
};

export default MoreActionsDropdown;
