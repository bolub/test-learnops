import React, { useEffect, useMemo, useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import useModal from 'Hooks/useModal';
import useInlineNotification from 'Hooks/useInlineNotification';
import isEmpty from 'lodash/isEmpty';
import { NewProjectParticipant, rangeDate } from 'utils/customTypes';
import {
  getOriginalProjectData,
  addProjectParticipant,
  addProjectCollaborator,
  fetchAllocationSummary,
} from 'state/Project/projectSlice';
import {
  NEW_PROJECT_PARTICIPANT_FIELDS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import ParticipantForm from '../ParticipantForm/ParticipantForm';

const AddParticipantModal: React.FC<{
  isModalOpen: boolean;
  onCloseModal: () => void;
}> = ({ isModalOpen = false, onCloseModal }) => {
  const dispatch = useDispatch();
  const { Modal, modalProps, openModal, closeModal } = useModal();
  const { showInlineNotification } = useInlineNotification();
  const projectData = useSelector(getOriginalProjectData);

  const defaultState: NewProjectParticipant = useMemo(
    () => ({
      userId: '',
      startDate: '',
      endDate: '',
      type: PROJECT_PARTICIPANT_TYPE.MEMBER,
      job_role: '',
      hoursAssigned: 0,
      estimated_hours: 0,
    }),
    []
  );
  const [newParticipant, setNewParticipant] =
    useState<NewProjectParticipant>(defaultState);

  const isValueTypeDateRange = (
    value: string | rangeDate
  ): value is rangeDate =>
    typeof value === 'object' &&
    value !== null &&
    'startDate' in value &&
    'endDate' in value;

  const handleCloseModal = useCallback(() => {
    onCloseModal();
    setNewParticipant(defaultState);
    closeModal();
  }, [closeModal, onCloseModal, defaultState]);

  const handleAddParticipant = useCallback(async () => {
    const { estimatedHours, ...participantData } = newParticipant;
    await dispatch(
      addProjectParticipant({
        projectId: projectData.id,
        newParticipant: { ...participantData },
      })
    );
    dispatch(fetchAllocationSummary(projectData.id));
  }, [newParticipant, projectData.id, dispatch]);

  const handleAddCollaborator = useCallback(async () => {
    const { hoursAssigned, type, job_role, ...collaboratorData } =
      newParticipant;
    await dispatch(
      addProjectCollaborator({
        projectId: projectData.id,
        newCollaborator: { ...collaboratorData, jobRole: job_role },
      })
    );
  }, [newParticipant, projectData.id, dispatch]);

  const handleSave = useCallback(async () => {
    if (newParticipant.type === PROJECT_PARTICIPANT_TYPE.MEMBER) {
      await handleAddParticipant();
    } else {
      await handleAddCollaborator();
    }
    showInlineNotification(
      'success',
      intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_ADDED_SUCCESS_MESSAGE'
      )
    );
    handleCloseModal();
  }, [
    handleAddParticipant,
    handleAddCollaborator,
    newParticipant,
    showInlineNotification,
    handleCloseModal,
  ]);

  const handleUpdateParticipantData = (
    key: string,
    value: string | rangeDate
  ) => {
    setNewParticipant((prevState) => {
      let result = { ...prevState };
      if (isValueTypeDateRange(value)) {
        result = {
          ...result,
          [NEW_PROJECT_PARTICIPANT_FIELDS.START_DATE]: value.startDate,
          [NEW_PROJECT_PARTICIPANT_FIELDS.END_DATE]: value.endDate,
        };
      } else if (key === NEW_PROJECT_PARTICIPANT_FIELDS.TYPE) {
        result = {
          ...result,
          [NEW_PROJECT_PARTICIPANT_FIELDS.TYPE]: value,
          [NEW_PROJECT_PARTICIPANT_FIELDS.USER_ID]: '',
        };
      } else {
        result = { ...result, [key]: value };
      }
      return result;
    });
  };

  const canCreateParticipant = useMemo(
    () =>
      !isEmpty(newParticipant.type) &&
      !isEmpty(newParticipant.job_role) &&
      newParticipant.startDate &&
      newParticipant.endDate &&
      !isEmpty(newParticipant.userId),
    [newParticipant]
  );

  const actionButons = useMemo(
    () => [
      {
        children: intl.get('TEAMS.SAVE'),
        variant: 'primary',
        'data-cy': 'confirm-button',
        disabled: !canCreateParticipant,
        onClick: handleSave,
      },
      {
        children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.CANCEL'),
        variant: 'tertiary',
        onClick: handleCloseModal,
        'data-cy': 'cancel-button',
      },
    ],
    [handleCloseModal, canCreateParticipant, handleSave]
  );

  useEffect(() => {
    if (isModalOpen && !modalProps.isOpen) {
      openModal(modalProps);
    }
  }, [openModal, modalProps, isModalOpen]);

  return (
    <Modal
      {...modalProps}
      closeModal={handleCloseModal}
      title={intl.get('PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.TITLE')}
      aria-label={intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.TITLE'
      )}
      size='large'
      className='h-full'
      actionButtons={actionButons}
      data-cy='add-participant-modal'
    >
      <ParticipantForm
        participant={newParticipant}
        updateParticipant={handleUpdateParticipantData}
      />
    </Modal>
  );
};

export default AddParticipantModal;
