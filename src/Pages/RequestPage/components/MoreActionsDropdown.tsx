import { useMemo } from 'react';
import { Button, Dropdown, Icon } from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import kanbanCard from 'assets/icons/kanban-card.svg';
import { MoreActionsOption } from 'utils/customTypes';
import { REQUEST_ACTIONS } from 'utils/constants';

type MoreActionsDropdownProps = {
  onChange: (option: any) => void;
  canCancel: boolean;
  canCreateProject: boolean;
  canLinkProjects: boolean;
};

const MoreActionsDropdown = ({
  onChange,
  canCancel,
  canCreateProject,
  canLinkProjects,
}: MoreActionsDropdownProps) => {
  const moreActionsOptions = useMemo(() => {
    const options: MoreActionsOption[] = [
      {
        value: REQUEST_ACTIONS.DOWNLOAD_REQUEST,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.DOWNLOAD_REQUEST'),
        iconName: 'cloud-download',
        dataCy: 'download_pdf-button',
      },
    ];

    if (canCancel) {
      options.push({
        value: REQUEST_ACTIONS.CANCEL_REQUEST,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.CANCEL_REQUEST'),
        iconName: 'remove-circle',
        dataCy: 'cancel-request-button',
      });
    }

    if (canCreateProject) {
      options.push({
        value: REQUEST_ACTIONS.CREATE_PROJECT,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.CREATE_PROJECT'),
        iconName: 'kanban-card',
        iconSrc: kanbanCard,
        dataCy: 'request-create-project_button',
      });
    }

    if (canLinkProjects) {
      options.push({
        value: REQUEST_ACTIONS.LINK_PROJECT,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.LINK_PROJECT'),
        iconName: 'link-outline',
        dataCy: 'request-link-project-button',
      });
    }

    return options;
  }, [canCancel, canCreateProject, canLinkProjects]);

  return (
    <Dropdown
      popperDiffWidth
      options={moreActionsOptions}
      className='h-full'
      renderTrigger={({ onToggleDropdown, isDropdownExpanded }) => {
        return (
          <Button
            variant='tertiary'
            onClick={onToggleDropdown}
            className={classnames('h-full', {
              'text-primary-darker bg-neutral-lightest': isDropdownExpanded,
            })}
            data-cy='more-actions-button'
          >
            {intl.get('REQUEST_PAGE.TOP_BAR.MORE.MORE_ACTIONS')}
            <Icon name='caret-down' className='text-xs pl-2' />
          </Button>
        );
      }}
      renderOption={(
        option: MoreActionsOption,
        isSelected: boolean,
        selectOption: () => void
      ) => (
        <li
          className={classnames(
            'px-6 py-2 flex cursor-pointer items-center',
            'hover:bg-primary-lighter hover:text-primary active:bg-primary active:text-neutral-white'
          )}
          onClick={selectOption}
          data-cy={option.dataCy}
        >
          <Icon
            name={option.iconName}
            src={option.iconSrc}
            className='mr-2 text-base'
          />
          <span className='ml-2.5'>{option.label}</span>
        </li>
      )}
      onChange={onChange}
    />
  );
};

export default MoreActionsDropdown;
