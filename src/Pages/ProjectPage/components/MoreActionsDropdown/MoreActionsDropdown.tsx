import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { usePopper } from 'react-popper';
import {
  useElevation,
  Button,
  List,
  Icon,
  Typography,
} from '@getsynapse/design-system';
import { MoreActionsOption } from 'utils/customTypes';
import { PROJECT_MORE_ACTIONS } from 'utils/constants';
import CloseProjectIcon from 'assets/icons/close-project.svg';
import DeleteProject from '../DeleteProject/DeleteProject';
import CancelProject from '../CancelProject/CancelProject';

const MoreActionsDropdown: React.FC<{
  canCancelProject: boolean;
  canDeleteProject: boolean;
  canCloseProject?: boolean;
  cancelProjectCallback: (reason: string) => void;
  deleteProjectCallback: () => void;
  toggleCloseModal: () => void;
}> = ({
  canCancelProject = false,
  canDeleteProject = false,
  canCloseProject = false,
  cancelProjectCallback,
  deleteProjectCallback,
  toggleCloseModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const [buttonElement, setButtonElement] = useState<HTMLDivElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const [displayCancelModal, setDisplayCancelModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

  const handleClickOutside = useCallback(
    (event: Event) => {
      const target = event.target as Element;
      if (
        !containerRef?.current?.contains(target) &&
        !containerRef?.current?.contains(target) &&
        showPopper
      ) {
        setShowPopper(false);
      }
    },
    [showPopper]
  );

  const handleEscape = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === 'Escape' || key === 'Esc') {
      setShowPopper(false);
    }
  };

  const togglePopper = () => {
    setShowPopper((prevState) => !prevState);
  };

  const moreActionsOptions = useMemo(() => {
    const options = [];
    if (canCancelProject) {
      options.push({
        value: PROJECT_MORE_ACTIONS.CANCEL,
        label: intl.get('PROJECT_DETAIL.CANCEL_PROJECT.TITLE'),
        iconName: 'remove-circle',
        dataCy: 'cancel-project-button',
        iconClassName: 'text-error-dark',
      });
    }

    if (canDeleteProject) {
      options.push({
        value: PROJECT_MORE_ACTIONS.DELETE,
        label: intl.get('PROJECT_DETAIL.DELETE_PROJECT.TITLE'),
        iconName: 'trash',
        dataCy: 'delete-project-button',
      });
    }

    if (canCloseProject) {
      options.push({
        value: PROJECT_MORE_ACTIONS.CLOSE,
        label: intl.get('PROJECT_DETAIL.CLOSE_PROJECT.TITLE'),
        iconSrc: CloseProjectIcon,
        dataCy: 'close-project-button',
      });
    }
    return options;
  }, [canCancelProject, canDeleteProject, canCloseProject]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClickOutside]);

  const popperElevation = useElevation(2);
  const { styles, attributes, update } = usePopper(
    buttonElement,
    popperElement,
    {
      placement: 'bottom-end',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 4],
          },
        },
      ],
    }
  );

  useEffect(() => {
    if (showPopper && update) {
      update();
    }
  }, [showPopper, update]);

  const handleSelectOption = (option: MoreActionsOption) => {
    if (option.value === PROJECT_MORE_ACTIONS.CANCEL) {
      setDisplayCancelModal(true);
    }

    if (option.value === PROJECT_MORE_ACTIONS.DELETE) {
      setDisplayDeleteModal(true);
    }

    if (option.value === PROJECT_MORE_ACTIONS.CLOSE) {
      toggleCloseModal();
    }
  };

  return (
    <React.Fragment>
      <CancelProject
        confirmCancelProject={cancelProjectCallback}
        shouldDisplayModal={displayCancelModal}
        closeModalCallback={() => setDisplayCancelModal(false)}
      />
      <DeleteProject
        confirmDeleteProject={deleteProjectCallback}
        shouldDisplayModal={displayDeleteModal}
        onCloseModal={() => setDisplayDeleteModal(false)}
      />
      <div ref={containerRef} className='relative bg-neutral-white h-auto'>
        <div ref={setButtonElement} className='h-auto'>
          <Button
            size='small'
            variant='tertiary'
            onClick={togglePopper}
            className={classnames({
              'bg-neutral-lightest border-transparent': showPopper,
            })}
            data-cy='more-action-menu-trigger'
          >
            <div className='py-1.5'>
              {intl.get('REQUEST_PAGE.TOP_BAR.MORE.MORE_ACTIONS')}
              <Icon
                name={showPopper ? 'caret-up' : 'caret-down'}
                className='text-xs pl-2'
              />
            </div>
          </Button>
        </div>
        <div
          hidden={!showPopper}
          ref={setPopperElement}
          style={styles.popper}
          className={classnames(
            'rounded z-20 w-49 h-auto bg-neutral-white',
            popperElevation
          )}
          {...attributes.popper}
        >
          <List
            options={moreActionsOptions}
            data-cy='more-action-menu-options-list'
            renderOption={(
              option: MoreActionsOption,
              isSelected: boolean,
              selectOption: () => void
            ) => (
              <li
                onClick={selectOption}
                data-cy={option.dataCy}
                className='group py-2 px-6 flex justify-center items-center cursor-pointer hover:bg-primary-lightest'
              >
                <Icon
                  name={option.iconName}
                  src={option.iconSrc}
                  className={classnames(
                    'mr-2 text-xl',
                    {
                      'fill-current text-neutral-black group-hover:fill-current group-hover:text-primary':
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default MoreActionsDropdown;
