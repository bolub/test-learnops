import { Fragment, useMemo } from 'react';
import {
  Button,
  Dropdown,
  Icon,
  useElevation,
} from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { BusinessTeam, LearningTeam } from 'utils/customTypes';
import DeleteTeamModal from './DeleteTeamModal';
import { useState } from 'react';
import get from 'lodash/get';

const MoreActionsDropdown = ({
  isBusinessTeam,
  team,
}: {
  isBusinessTeam: boolean;
  team: Partial<BusinessTeam> | Partial<LearningTeam>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const moreActionsOptions = useMemo(() => [{}], []);
  const hasTeamMembers = useMemo<boolean>(
    () =>
      isBusinessTeam
        ? get(team, 'users.length')
        : get(team, 'ldTeamMembers.length'),
    [isBusinessTeam, team]
  );
  const tooltipElevation = useElevation(2);

  const handleEscape = (event: React.KeyboardEvent) => {
    const key = event.key;
    if ((key === 'Escape' || key === 'Esc') && showTooltip) {
      setShowTooltip(false);
    }
  };

  return (
    <Fragment>
      <DeleteTeamModal
        isBusinessTeam={isBusinessTeam}
        team={team}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <div className='relative'>
        {showTooltip && (
          <div
            role='tooltip'
            data-cy='no-delete_tooltip'
            id='no-delete-tooltip'
            tabIndex={0}
            className={`bg-neutral-dark text-neutral-white rounded p-4 absolute right-1 top-6 w-64 ${tooltipElevation}`}
          >
            {intl.get('EDIT_TEAM.DELETE_TEAM_TOOLTIP')}
          </div>
        )}
      </div>
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
                'bg-neutral-lightest': isDropdownExpanded,
              })}
              onKeyDown={handleEscape}
              data-cy='team-more-actions_dropdown'
            >
              {intl.get('MORE_ACTIONS')}
              <Icon
                name={isDropdownExpanded ? 'caret-up' : 'caret-down'}
                className='text-xs pl-2'
              />
            </Button>
          );
        }}
        renderOption={() => (
          <li
            tabIndex={0}
            data-cy='delete-team_option'
            className={classnames(
              'px-6 py-2 flex items-center',
              `${
                !hasTeamMembers
                  ? 'cursor-pointer text-neutral-black hover:bg-primary-lighter hover:text-primary active:bg-primary active:text-neutral-white'
                  : 'text-neutral-light cursor-not-allowed'
              }`
            )}
            onClick={() =>
              !hasTeamMembers && !isModalOpen ? setIsModalOpen(true) : {}
            }
            onMouseEnter={() =>
              hasTeamMembers && !showTooltip ? setShowTooltip(true) : {}
            }
            onMouseLeave={() =>
              hasTeamMembers && showTooltip ? setShowTooltip(false) : {}
            }
            onFocus={() =>
              hasTeamMembers && !showTooltip ? setShowTooltip(true) : {}
            }
            onBlur={() =>
              hasTeamMembers && showTooltip ? setShowTooltip(false) : {}
            }
          >
            <Icon name='trash-outline' className='mr-2 text-xl' />
            <span className='text-sm leading-6'>
              {intl.get('EDIT_TEAM.DELETE_TEAM')}
            </span>
          </li>
        )}
        onChange={() => {}}
      />
    </Fragment>
  );
};

export default MoreActionsDropdown;
