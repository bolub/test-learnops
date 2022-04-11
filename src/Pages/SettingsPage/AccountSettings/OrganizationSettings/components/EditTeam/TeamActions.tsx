import { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import MoreActions from 'Organisms/MoreActions/MoreActions';
import {
  BusinessTeam,
  LearningTeam,
  MoreActionsOption,
} from 'utils/customTypes';
import DeleteTeamModal from './DeleteTeamModal';
import { TEAM_ACTIONS } from 'utils/constants';

const TeamActions = ({
  isBusinessTeam,
  team,
}: {
  isBusinessTeam: boolean;
  team: Partial<BusinessTeam> | Partial<LearningTeam>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasTeamMembers = useMemo<boolean>(
    () =>
      isBusinessTeam
        ? get(team, 'users.length') > 0
        : get(team, 'ldTeamMembers.length') > 0,
    [isBusinessTeam, team]
  );

  const options: MoreActionsOption[] = useMemo(() => {
    return [
      {
        dataCy: 'delete-team_option',
        iconName: 'trash-outline',
        label: intl.get('EDIT_TEAM.DELETE_TEAM'),
        value: TEAM_ACTIONS.DELETE,
        disabled: hasTeamMembers,
        tooltipText: hasTeamMembers
          ? intl.get('EDIT_TEAM.DELETE_TEAM_TOOLTIP')
          : undefined,
      },
    ];
  }, [hasTeamMembers]);

  const onSelectOption = (option: MoreActionsOption) => {
    switch (option.value) {
      case TEAM_ACTIONS.DELETE:
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <DeleteTeamModal
        isBusinessTeam={isBusinessTeam}
        team={team}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
      <MoreActions options={options} onSelectOption={onSelectOption} />
    </>
  );
};

export default TeamActions;
