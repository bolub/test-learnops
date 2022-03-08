import React, { useState, useEffect, useCallback, useMemo } from 'react';
import intl from 'react-intl-universal';
import isEmpty from 'lodash/isEmpty';
import {
  Typography,
  FormItem,
  Dropdown,
  TextField,
} from '@getsynapse/design-system';
import { PROJECT_CANCEL_REASONS } from 'utils/constants';
import useModal from 'Hooks/useModal';

type Option = {
  label: string;
  value: string;
};

const SpecifyHoldReasonForm: React.FC<{
  holdReason?: string;
  setHoldReason: React.Dispatch<React.SetStateAction<string>>;
  otherReason?: string;
  setOtherReason: React.Dispatch<React.SetStateAction<string>>;
  shouldSpecifyOtherReason?: boolean;
  canUpdateHoldReason?: boolean;
}> = ({
  holdReason,
  setHoldReason,
  otherReason,
  setOtherReason,
  shouldSpecifyOtherReason = false,
  canUpdateHoldReason = true,
}) => {
  const reasonOptions = useMemo(
    () =>
      Object.entries(PROJECT_CANCEL_REASONS).map((entry) => {
        return {
          label: intl.get(
            `PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.REASON_PICKER_OPTIONS.${entry[0]}`
          ),
          value: entry[1],
        };
      }),
    []
  );
  const selectedReason = useMemo(
    () =>
      isEmpty(holdReason)
        ? []
        : reasonOptions.filter((reason: Option) => reason.value === holdReason),
    [holdReason, reasonOptions]
  );

  return (
    <React.Fragment>
      <Typography variant='body'>
        {intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.QUESTION')}
      </Typography>
      <Typography variant='body' className='mt-6'>
        {intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.RESPONSE')}
      </Typography>
      <FormItem
        label={intl.get(
          'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.REASONS_PICKER_LABEL'
        )}
        className='mt-6'
      >
        <Dropdown
          options={reasonOptions}
          onChange={(option: Option) => setHoldReason(option.value)}
          values={selectedReason}
          placeholder={intl.get(
            'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.REASONS_PICKER_PLACEHOLDER'
          )}
          disabled={!canUpdateHoldReason}
          triggerProps={{
            'data-cy': 'hold-reason-picker',
          }}
        />
      </FormItem>
      {shouldSpecifyOtherReason && (
        <FormItem
          label={intl.get(
            'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.PLEASE_SPECIFY'
          )}
          className='mt-6'
        >
          <TextField
            value={otherReason}
            className='p-1'
            onChange={(event: React.KeyboardEvent<HTMLInputElement>) => {
              const target = event.target as HTMLInputElement;
              setOtherReason(target.value);
            }}
            disabled={!canUpdateHoldReason}
            data-cy='specify-hold-reason-input'
            placeholder={intl.get(
              'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.SPECIFY_REASON_PLACEHOLDER'
            )}
          />
        </FormItem>
      )}
    </React.Fragment>
  );
};

const PutProjectOnHoldModal: React.FC<{
  onConfirm: (onHoldReason: string) => void;
  holdReason?: string;
  shouldDisplayModal?: boolean;
  canUpdateHoldReason?: boolean;
  onClose: () => void;
  onCancelCallback: () => void;
}> = ({
  onConfirm,
  holdReason,
  shouldDisplayModal = false,
  canUpdateHoldReason = true,
  onClose,
  onCancelCallback,
}) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const { Modal, modalProps, openModal, closeModal, updateModal } = useModal();
  const shouldSpecifyOtherReason =
    reason ===
    intl.get(
      'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.REASON_PICKER_OPTIONS.OTHER'
    );
  const canPutProjectOnHold =
    (!isEmpty(reason) && !shouldSpecifyOtherReason) ||
    (!isEmpty(reason) && shouldSpecifyOtherReason && !isEmpty(otherReason));

  useEffect(() => {
    if (!shouldSpecifyOtherReason && !isEmpty(otherReason)) {
      setOtherReason('');
    }
  }, [otherReason, shouldSpecifyOtherReason]);

  useEffect(() => {
    if (modalProps.isOpen && !isEmpty(holdReason)) {
      if (holdReason?.includes(':')) {
        const splittedReason = holdReason.split(':');
        setReason(splittedReason[0]);
        setOtherReason(splittedReason[1]);
      } else {
        setReason(holdReason!);
      }
    }
  }, [holdReason, setReason, setOtherReason, modalProps.isOpen]);

  const handleCloseModal = useCallback(() => {
    setReason('');
    setOtherReason('');
    closeModal();
    onClose();
  }, [setReason, setOtherReason, closeModal, onClose]);

  const handleConfirmClick = useCallback(() => {
    onConfirm(
      `${shouldSpecifyOtherReason ? `${reason}:${otherReason}` : `${reason}`}`
    );
    handleCloseModal();
  }, [
    onConfirm,
    reason,
    otherReason,
    shouldSpecifyOtherReason,
    handleCloseModal,
  ]);

  const actionButtons = useMemo(
    () => [
      {
        children: intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.CONFIRM'),
        disabled: !canPutProjectOnHold || !canUpdateHoldReason,
        onClick: handleConfirmClick,
        'data-cy': 'confirm-button',
      },
      {
        children: intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.CANCEL'),
        variant: 'secondary',
        'data-cy': 'cancel-button',
        onClick: () => {
          onCancelCallback();
          handleCloseModal();
        },
      },
    ],
    [
      handleCloseModal,
      handleConfirmClick,
      canPutProjectOnHold,
      canUpdateHoldReason,
      onCancelCallback,
    ]
  );

  useEffect(() => {
    if (modalProps.isOpen) {
      updateModal({
        children: (
          <SpecifyHoldReasonForm
            holdReason={reason}
            otherReason={otherReason}
            setHoldReason={setReason}
            setOtherReason={setOtherReason}
            shouldSpecifyOtherReason={shouldSpecifyOtherReason}
            canUpdateHoldReason={canUpdateHoldReason}
          />
        ),
        actionButtons,
      });
    }
  }, [
    reason,
    otherReason,
    shouldSpecifyOtherReason,
    modalProps.isOpen,
    updateModal,
    canUpdateHoldReason,
    actionButtons,
  ]);

  const displayPutProjectOnHoldModal = useCallback(() => {
    openModal({
      title: intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.TITLE'),
      size: 'medium',
      children: (
        <SpecifyHoldReasonForm
          holdReason={reason}
          otherReason={otherReason}
          setHoldReason={setReason}
          setOtherReason={setOtherReason}
          shouldSpecifyOtherReason={shouldSpecifyOtherReason}
          canUpdateHoldReason={canUpdateHoldReason}
        />
      ),
      actionButtons,
    });
  }, [
    openModal,
    canUpdateHoldReason,
    reason,
    otherReason,
    shouldSpecifyOtherReason,
    actionButtons,
  ]);

  useEffect(() => {
    if (shouldDisplayModal && !modalProps.isOpen) {
      displayPutProjectOnHoldModal();
    }
  }, [shouldDisplayModal, displayPutProjectOnHoldModal, modalProps.isOpen]);

  return (
    <Modal
      {...modalProps}
      aria-label={intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.TITLE')}
      closeModal={handleCloseModal}
      data-cy='put-project-on-hold-modal'
    />
  );
};

export default PutProjectOnHoldModal;
