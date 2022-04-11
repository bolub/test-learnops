import { Dispatch, SetStateAction } from 'react';
import intl from 'react-intl-universal';
import { Typography, Button } from '@getsynapse/design-system';
import TableAvatar from 'Molecules/TableAvatar';
import { UserColumnType } from 'utils/customTypes';

type TeamMemberCellProps = {
  user: UserColumnType['user'];
  projects: UserColumnType['projects'];
  setShowProjects: Dispatch<SetStateAction<boolean>>;
  showProjects: boolean;
};

const TeamMemberCell = ({
  user,
  projects,
  setShowProjects,
  showProjects,
}: TeamMemberCellProps) => {
  return (
    <div className='w-full flex p-2 border-b border-neutral-lighter'>
      <div className='w-4/6 shadow-table-column mr-2'>
        <TableAvatar user={user} />
        <Button
          variant='tertiary'
          onClick={() => setShowProjects((prev) => !prev)}
          className='ml-4'
          disabled={projects.length <= 0}
        >
          {showProjects
            ? intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.HIDE_PROJECTS')
            : intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.VIEW_PROJECTS')}
        </Button>
      </div>
      {user.roles && (
        <div className='flex flex-col w-2/6 justify-around'>
          <Typography
            variant='caption'
            weight='medium'
            className='text-neutral'
          >
            {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ROLES', { op: 2 })}
          </Typography>
          <Typography variant='caption' className='text-neutral-black'>
            {user.roles}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCell;
