import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { Typography, tailwindOverride } from '@getsynapse/design-system';
import PriorityLabel from 'Molecules/PriorityLabel';
import HealthLabel from 'Molecules/HealthLabel';
import { TeamMemberProject as TeamMemberProjectType } from 'utils/customTypes';
import { PATHS } from 'utils/constants';

type TeamMemberProjectProps = {
  project: TeamMemberProjectType;
};

const TeamMemberProject = ({ project }: TeamMemberProjectProps) => {
  return (
    <div
      className={tailwindOverride(
        'w-37-percent shadow-allocation-table-inner',
        'grid grid-cols-3 grid-rows-1 py-2',
        'border-b border-neutral-lighter'
      )}
    >
      <div className='col-span-2 shadow-table-column px-2 mr-2'>
        <div className='flex justify-between'>
          <Link to={`${PATHS.PROJECT_PAGE}/${project.id}`}>
            <Typography variant='caption' className='text-primary'>
              {project.title}
            </Typography>
          </Link>
        </div>
        <div className='flex space-x-4'>
          {project.priority && <PriorityLabel priority={project.priority} />}
          <HealthLabel health={project.health} indicatorClassName='mr-1' />
        </div>
      </div>
      <div className='row-span-2 flex flex-col'>
        <Typography variant='caption' weight='medium' className='text-neutral'>
          {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ROLES', { op: 1 })}
        </Typography>
        <Typography variant='caption'>{project.roles.role}</Typography>
      </div>
    </div>
  );
};

export default TeamMemberProject;
