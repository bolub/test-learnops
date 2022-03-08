import React, { useMemo, useState, useEffect, useCallback } from 'react';
import intl from 'react-intl-universal';
import {
  Typography,
  FormItem,
  Dropdown,
  TextField,
} from '@getsynapse/design-system';
import { PROJECT_CANCEL_REASONS } from 'utils/constants';
import { FormOption } from 'utils/customTypes';
import useModal from 'Hooks/useModal';

const Content: React.FC<{
  onChangeReason: (reason: string) => void;
  onChangeCustomReason: (reason: string) => void;
}> = ({ onChangeReason, onChangeCustomReason }) => {
  const [reason, setReason] = useState('');

  const reasonOptions = useMemo(
    () =>
      Object.entries(PROJECT_CANCEL_REASONS).map((entry) => {
        return {
          label: intl.get(`PROJECT_DETAIL.CANCEL_PROJECT.REASONS.${entry[0]}`),
          value: entry[1],
        };
      }),
    []
  );

  return (
    <React.Fragment>
      <Typography variant='body'>
        {intl.getHTML('PROJECT_DETAIL.CANCEL_PROJECT.BODY')}
      </Typography>
      <Typography variant='body' className='mt-6'>
        {intl.get('PROJECT_DETAIL.CANCEL_PROJECT.SELECT_REASON')}
      </Typography>
      <FormItem
        className='mt-6'
        label={intl.get('PROJECT_DETAIL.CANCEL_PROJECT.CANCELLATION_REASON')}
      >
        <Dropdown
          placeholder={intl.get(
            'PROJECT_DETAIL.CANCEL_PROJECT.SELECT_REASON_PLACEHOLDER'
          )}
          onChange={(option: FormOption) => {
            setReason(option.value);
            onChangeReason(option.value);
          }}
          options={reasonOptions}
          triggerProps={{ 'data-cy': 'cancel-reason-picker' }}
        />
      </FormItem>
      {reason === PROJECT_CANCEL_REASONS.OTHER && (
        <FormItem
          className='mt-6'
          label={intl.get('PROJECT_DETAIL.CANCEL_PROJECT.SPECIFY')}
        >
          <TextField
            className='p-1'
            variant='text'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeCustomReason(e.target.value)
            }
            placeholder={intl.get(
              'PROJECT_DETAIL.CANCEL_PROJECT.SPECIFY_PLACEHOLDER'
            )}
            data-cy='specify-cancel-reason-input'
          />
        </FormItem>
      )}
    </React.Fragment>
  );
};

const CancelProject: React.FC<{
  confirmCancelProject: (reason: string) => void;
  shouldDisplayModal: boolean;
  closeModalCallback: () => void;
}> = ({ confirmCancelProject, shouldDisplayModal, closeModalCallback }) => {
  const { Modal, modalProps, openModal, closeModal, updateModal } = useModal();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [canCancelProject, setCanCancelProject] = useState(false);

  const onCloseModal = useCallback(() => {
    setReason('');
    setCustomReason('');
    closeModal();
    closeModalCallback();
  }, [setReason, setCustomReason, closeModal, closeModalCallback]);

  const handleSubmit = useCallback(() => {
    if (reason === PROJECT_CANCEL_REASONS.OTHER && customReason) {
      confirmCancelProject(customReason);
    } else {
      confirmCancelProject(reason);
    }
    onCloseModal();
  }, [customReason, reason, confirmCancelProject, onCloseModal]);

  const getActionButtons = useCallback(() => {
    return [
      {
        children: intl.get('PROJECT_DETAIL.CANCEL_PROJECT.SUBMIT'),
        variant: 'primary',
        color: 'danger',
        disabled: !canCancelProject,
        'data-cy': 'confirm-button',
        onClick: handleSubmit,
      },
      {
        children: intl.get('PROJECT_DETAIL.CANCEL_PROJECT.CANCEL'),
        variant: 'secondary',
        'data-cy': 'cancel-button',
        onClick: () => onCloseModal(),
      },
    ];
  }, [canCancelProject, onCloseModal, handleSubmit]);

  useEffect(() => {
    if (!reason || (reason === PROJECT_CANCEL_REASONS.OTHER && !customReason)) {
      if (canCancelProject) {
        setCanCancelProject(false);
      }
    } else {
      if (!canCancelProject) {
        setCanCancelProject(true);
      }
    }
    updateModal({
      actionButtons: getActionButtons(),
    });
  }, [canCancelProject, reason, customReason, getActionButtons, updateModal]);

  const displayModal = useCallback(() => {
    openModal({
      title: intl.get('PROJECT_DETAIL.CANCEL_PROJECT.TITLE'),
      size: 'medium',
      children: (
        <Content
          onChangeReason={setReason}
          onChangeCustomReason={setCustomReason}
        />
      ),
      actionButtons: getActionButtons(),
    });
  }, [setReason, setCustomReason, getActionButtons, openModal]);

  useEffect(() => {
    if (shouldDisplayModal && !modalProps.isOpen) {
      displayModal();
    }
  }, [shouldDisplayModal, modalProps.isOpen, displayModal]);

  return (
    <Modal
      {...modalProps}
      aria-label='cancel project confirmation'
      data-cy='cancel-project-modal'
      closeModal={onCloseModal}
    />
  );
};

export default CancelProject;
