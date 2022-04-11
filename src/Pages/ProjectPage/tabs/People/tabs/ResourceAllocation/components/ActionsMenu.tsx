import React from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import { OverflowMenu, OverflowMenuItem } from '@getsynapse/design-system';
import { Owner } from 'utils/customTypes';
import { RESOURCE_ALLOCATION_TABLE_SECTIONS } from 'utils/constants';
import {
  setParticipantAssignmentToUpdate,
  setCurrentEditingUser,
} from 'state/ResourceAllocation/resourceAllocation';

const ActionsMenu: React.FC<{
  user: Owner;
  participantType: string;
}> = ({ user, participantType }) => {
  const isCollaboratorType =
    participantType === RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS;
  const isOwnerType =
    participantType === RESOURCE_ALLOCATION_TABLE_SECTIONS.OWNERS;
  const participantTypeLabel = intl.get(
    `PEOPLE.RESOURCE_ALLOCATION.TABLE.${participantType}`,
    {
      num: 0,
    }
  );
  const dispatch = useDispatch();

  const handlePetParticipantAssignmentToUpdate = () => {
    dispatch(
      setParticipantAssignmentToUpdate({
        userId: user.id || '',
        name: `${user.data?.firstName} ${user.data?.lastName}`,
        participantType,
      })
    );
  };

  return (
    <div className='absolute top-0 right-0'>
      <OverflowMenu>
        {!isOwnerType && (
          <OverflowMenuItem onSelect={handlePetParticipantAssignmentToUpdate}>
            {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.UPDATE_ASSIGNMENT', {
              type: participantTypeLabel,
            })}
          </OverflowMenuItem>
        )}
        {!isCollaboratorType && (
          <OverflowMenuItem
            onSelect={() =>
              dispatch(
                setCurrentEditingUser({
                  userId: user.id || '',
                  name: `${user.data?.firstName} ${user.data?.lastName}`,
                })
              )
            }
          >
            {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.ADJUST_ALLOCATION')}
          </OverflowMenuItem>
        )}
      </OverflowMenu>
    </div>
  );
};

export default ActionsMenu;
