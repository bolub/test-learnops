import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import useModal from 'Hooks/useModal';
import useInlineNotification from 'Hooks/useInlineNotification';
import { ProjectProcess } from 'utils/customTypes';
import { removeProjectProcess } from 'state/Processes/processesSlice';
import { Typography } from '@getsynapse/design-system';

const RemoveProcessConfirmationModal: React.FC<{
  isModalOpen: boolean;
  process: ProjectProcess | null;
  onCloseModalHandle: () => void;
}> = ({ isModalOpen, onCloseModalHandle, process }) => {
  const dispatch = useDispatch();
  const { Modal, modalProps, openModal, closeModal } = useModal();
  const { showInlineNotification } = useInlineNotification();

  useEffect(() => {
    if (isModalOpen && !modalProps.isOpen) {
      openModal(modalProps);
    }
  }, [modalProps, isModalOpen, openModal]);

  const handleCloseModal = () => {
    onCloseModalHandle();
    closeModal();
  };

  const handleConfirm = async () => {
    dispatch(removeProjectProcess(process!));
    showInlineNotification(
      'success',
      intl.get(
        'SETTINGS_PAGE.REMOVE_PROCESS_MODAL.REMOVE_PROCESS_SUCCESSFULLY_MESSAGE'
      )
    );
    handleCloseModal();
  };

  const actionButtons = [
    {
      children: intl.get(
        'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.DELETE_BUTTON'
      ),
      variant: 'primary',
      'data-cy': 'remove-process__confirm-button',
      onClick: handleConfirm,
      color: 'danger',
    },
    {
      children: intl.get(
        'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.CANCEL_BUTTON'
      ),
      variant: 'tertiary',
      onClick: handleCloseModal,
    },
  ];

  return (
    <Modal
      {...modalProps}
      aria-label={intl.get('SETTINGS_PAGE.REMOVE_PROCESS_MODAL.TITLE')}
      title={intl.get('SETTINGS_PAGE.REMOVE_PROCESS_MODAL.TITLE')}
      actionButtons={actionButtons}
      size='medium'
      closeModal={handleCloseModal}
      data-cy='remove-process__confirmation-modal'
    >
      <Typography variant='body' className='text-neutral-black'>
        {intl.getHTML('SETTINGS_PAGE.REMOVE_PROCESS_MODAL.DESCRIPTION')}
      </Typography>
    </Modal>
  );
};

export default RemoveProcessConfirmationModal;
