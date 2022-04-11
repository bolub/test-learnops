import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUserParticipantType } from 'state/Project/projectSlice';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { Typography, Button } from '@getsynapse/design-system';
import { Owner, ProjectParticipantRole } from 'utils/customTypes';
import { PROJECT_PARTICIPANT_TYPE } from 'utils/constants';
import UserAvatar from 'Atoms/UserAvatar';
import ActionsMenu from './ActionsMenu';

export const AllocatedUserDetails: React.FC<{
  user: Owner;
  hasAssignments?: boolean;
  participantType: string;
  params: {
    toggleSection?: (event: React.MouseEvent<HTMLElement>) => void;
    isOpen?: boolean;
  };
}> = ({ user, hasAssignments = false, participantType, params }) => {
  const currentUserType = useSelector(getCurrentUserParticipantType);
  return (
    <div className='flex p-2'>
      <UserAvatar
        user={{
          avatar_url: user.avatar_url,
          data: {
            firstName: user.data?.firstName || '',
            lastName: user.data?.lastName || '',
          },
        }}
      />
      <div className='flex flex-1 flex-col pl-2 relative'>
        <Typography
          variant='label'
          className='text-neutral-black font-semibold'
        >
          {`${user.data?.firstName} ${user.data?.lastName}`}
        </Typography>
        <Typography variant='label' className='text-neutral mb-2'>
          {user.data?.email}
        </Typography>
        <Button
          variant='tertiary'
          disabled={!hasAssignments}
          className={classnames('text-sm self-start px-1', {
            'text-neutral-light': !hasAssignments,
            'text-primary': hasAssignments,
          })}
          onClick={params?.toggleSection}
          size='small'
        >
          {params?.isOpen
            ? intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.HIDE_TASKS')
            : intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.VIEW_TASKS')}
        </Button>
        {currentUserType === PROJECT_PARTICIPANT_TYPE.OWNER && (
          <ActionsMenu user={user} participantType={participantType} />
        )}
      </div>
    </div>
  );
};

export const AllocatedUserRoles: React.FC<{
  roles: ProjectParticipantRole[];
}> = ({ roles }) => {
  return (
    <div className='flex flex-col h-full px-2'>
      {roles.map(({ role }, index: number) => (
        <div className='flex items-start py-2' key={index}>
          <Typography variant='caption' className='text-neutral-black h-6'>
            {role}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export const AllocatesUserHours: React.FC<{
  roles: ProjectParticipantRole[];
}> = ({ roles }) => {
  return (
    <div className='flex flex-col h-full px-2'>
      {roles.map((role: ProjectParticipantRole, index: number) => {
        let totalAllocation = 0;
        if (role.estimation) {
          totalAllocation = parseInt(role.estimation.estimated_hours) || 0;
        } else if (role.allocations) {
          for (const allocation of role.allocations) {
            totalAllocation += allocation.allocatedHours;
          }
        }

        return (
          <div className='flex items-start py-2' key={index}>
            <Typography variant='caption' className='text-neutral-black h-6'>
              {totalAllocation}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};
