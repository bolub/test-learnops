import React, { useState, useEffect, useMemo } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@getsynapse/design-system';
import {
  getOriginalProjectData,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import {
  fetchProjectParticipantsAllocations,
  getProjectResourceAllocation,
  fetchProjectCollaboratorsAllocations,
} from 'state/ResourceAllocation/resourceAllocation';
import {
  formatResourceAllocationSections,
  generateTableHeaders,
} from './helpers';
import { PROJECT_PARTICIPANT_TYPE } from 'utils/constants';
import AddParticipantModal from '../../components/AddParticipantModal/AddParticipantModal';
import AdjustAllocationModal from '../../components/AdjustAllocationModal/AdjustAllocationModal';
import CapacityAllocationTable from 'Organisms/CapacityAllocationTable/CapacityAllocationTable';
import UpdateParticipantAssignmentModal from '../../components/UpdateParticipantAssignmentModal/UpdateParticipantAssignmentModal';

const ResourceAllocation = () => {
  const dispatch = useDispatch();
  const projectData = useSelector(getOriginalProjectData);
  const rawSections = useSelector(getProjectResourceAllocation);
  const participantType = useSelector(getCurrentUserParticipantType);
  const formattedSections = useMemo(
    () => formatResourceAllocationSections(rawSections),
    [rawSections]
  );
  const headers = useMemo(() => generateTableHeaders(), []);
  const [displayAddParticipantModal, setDisplayAddParticipantModal] =
    useState(false);

  useEffect(() => {
    if (projectData.id) {
      dispatch(fetchProjectParticipantsAllocations(projectData.id));
      dispatch(fetchProjectCollaboratorsAllocations(projectData.id));
    }
  }, [projectData.id, dispatch]);

  return (
    <div className='pb-6'>
      <AddParticipantModal
        isModalOpen={displayAddParticipantModal}
        onCloseModal={() => setDisplayAddParticipantModal(false)}
      />
      <AdjustAllocationModal />
      <UpdateParticipantAssignmentModal />
      {participantType === PROJECT_PARTICIPANT_TYPE.OWNER && (
        <div className='absolute top-0 right-0'>
          <Button
            className='mt-4 mr-6'
            onClick={() => setDisplayAddParticipantModal(true)}
            data-cy='add-participant-button'
          >
            {intl.get('PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.TITLE')}
          </Button>
        </div>
      )}
      <CapacityAllocationTable
        headers={headers}
        sections={formattedSections}
        startDate={new Date(projectData.startDate!)}
        endDate={new Date(projectData.targetCompletionDate!)}
      />
    </div>
  );
};

export default ResourceAllocation;
