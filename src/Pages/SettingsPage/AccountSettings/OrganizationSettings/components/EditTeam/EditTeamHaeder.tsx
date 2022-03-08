import { useElevation } from '@getsynapse/design-system';
import MoreActionsDropdown from './MoreActionsDropdown';
import { BusinessTeam, LearningTeam } from 'utils/customTypes';

const EditTeamHeader = ({
  isBusinessTeam,
  team,
}: {
  isBusinessTeam: boolean;
  team: Partial<BusinessTeam> | Partial<LearningTeam>;
}) => {
  const elevationClass = useElevation(2);

  return (
    <div className='mx-6 mt-2 bg-neutral-white relative z-5'>
      <div
        className={`${elevationClass} h-12 flex items-center justify-end p-2`}
      >
        <MoreActionsDropdown isBusinessTeam={isBusinessTeam} team={team} />
      </div>
    </div>
  );
};

export default EditTeamHeader;
