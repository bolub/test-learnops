import React, { useEffect, useCallback } from 'react';
import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import useModal from 'Hooks/useModal';

const DeleteTask: React.FC<{
  confirmDeleteTask: (taskId: string) => void;
  shouldDisplayModal: boolean;
  onCloseModal: () => void;
}> = ({ confirmDeleteTask, shouldDisplayModal, onCloseModal }) => {
  const { Modal, modalProps, openModal, closeModal } = useModal();

  const handleCloseModal = useCallback(() => {
    closeModal();
    onCloseModal();
  }, [closeModal, onCloseModal]);

  const displayModal = useCallback(() => {
    openModal({
      title: intl.get('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.TITLE'),
      size: 'medium',
      children: (
        <React.Fragment>
          <Typography variant='body'>
            {intl.getHTML('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.BODY')}
          </Typography>
          <Typography variant='body' className='mt-6'>
            {intl.get('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.QUESTION')}
          </Typography>
        </React.Fragment>
      ),
      actionButtons: [
        {
          children: intl.get('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.SUBMIT'),
          variant: 'primary',
          color: 'danger',
          onClick: confirmDeleteTask,
          'data-cy': 'confirm-button',
        },
        {
          children: intl.get('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.CANCEL'),
          variant: 'secondary',
          onClick: handleCloseModal,
          'data-cy': 'cancel-button',
        },
      ],
    });
  }, [openModal, handleCloseModal, confirmDeleteTask]);

  useEffect(() => {
    if (shouldDisplayModal && !modalProps.isOpen) {
      displayModal();
    }
  }, [shouldDisplayModal, displayModal, modalProps.isOpen]);

  return (
    <Modal
      {...modalProps}
      aria-label={intl.get('TASKS.TASK_DETAIL_PAGE.DELETE_TASK_MODAL.TITLE')}
      data-cy='delete-task-modal'
      closeModal={handleCloseModal}
    />
  );
};

export default DeleteTask;
