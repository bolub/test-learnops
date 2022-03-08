import React, { useEffect, useCallback } from 'react';
import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import useModal from 'Hooks/useModal';

const DeleteProject: React.FC<{
  confirmDeleteProject: (projectId: string) => void;
  shouldDisplayModal: boolean;
  onCloseModal: () => void;
}> = ({ confirmDeleteProject, shouldDisplayModal, onCloseModal }) => {
  const { Modal, modalProps, openModal, closeModal } = useModal();

  const handleCloseModal = useCallback(() => {
    closeModal();
    onCloseModal();
  }, [closeModal, onCloseModal]);

  const displayModal = useCallback(() => {
    openModal({
      title: intl.get('PROJECT_DETAIL.DELETE_PROJECT.TITLE'),
      size: 'medium',
      children: (
        <React.Fragment>
          <Typography variant='body'>
            {intl.getHTML('PROJECT_DETAIL.DELETE_PROJECT.BODY')}
          </Typography>
          <Typography variant='body' className='mt-6'>
            {intl.get('PROJECT_DETAIL.DELETE_PROJECT.QUESTION')}
          </Typography>
        </React.Fragment>
      ),
      actionButtons: [
        {
          children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.SUBMIT'),
          variant: 'primary',
          color: 'danger',
          onClick: confirmDeleteProject,
          'data-cy': 'confirm-button',
        },
        {
          children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.CANCEL'),
          variant: 'secondary',
          onClick: handleCloseModal,
          'data-cy': 'cancel-button',
        },
      ],
    });
  }, [openModal, handleCloseModal, confirmDeleteProject]);

  useEffect(() => {
    if (shouldDisplayModal && !modalProps.isOpen) {
      displayModal();
    }
  }, [shouldDisplayModal, displayModal, modalProps.isOpen]);

  return (
    <Modal
      {...modalProps}
      aria-label={intl.get('PROJECT_DETAIL.DELETE_PROJECT.TITLE')}
      data-cy='delete-project-modal'
      closeModal={handleCloseModal}
    />
  );
};

export default DeleteProject;
