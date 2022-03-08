import { Fragment, useState } from 'react';
import {
  Modal,
  Typography,
  FormLabel,
  FormItem,
  Input,
  TextArea,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { Request } from 'utils/customTypes';
import { editRequest } from 'state/ActiveRequest/activeRequestSlice';
import { REQUEST_STATUS, PATHS } from 'utils/constants';
import { useDispatch } from 'react-redux';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { useHistory } from 'react-router-dom';

type ConfirmCancellationModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestData: Request;
};

const ConfirmCancellationModal = ({
  isOpen,
  setIsOpen,
  requestData,
}: ConfirmCancellationModalProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ldRemark, setldRemark] = useState('');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirmCancellation = async () => {
    await dispatch(
      editRequest({
        request: requestData,
        updateData: {
          status: REQUEST_STATUS.CANCELED,
          data: {
            ...requestData.data,
            cancellation: {
              ...requestData.data?.cancellation,
              ldRemark: ldRemark,
            },
          },
        },
      })
    );
    setIsOpen(false);
    history.push(PATHS.REQUESTS_LIST_PAGE);
    dispatch(
      setNotificationText(
        intl.get(
          'REQUEST_PAGE.NOTIFICATIONS.REQUEST_CANCELLATION_CONFIRMATION',
          {
            requestNo: requestData.requestIdentifier,
          }
        )
      )
    );
    dispatch(setNotificationTimeout(4000));
    dispatch(setNotificationVariant('success'));
    dispatch(displayNotification());
  };

  return (
    <Modal
      aria-label='confirm-cancellation-request-modal'
      actionButtons={[
        {
          children: intl.get(
            'REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.CONFIRM_CANCELLATION'
          ),
          variant: 'primary',
          color: 'danger',
          onClick: handleConfirmCancellation,
          'data-cy': 'confirm-cancellation-button',
        },
        {
          children: intl.get(
            'REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.CANCEL_BUTTON'
          ),
          variant: 'tertiary',
          onClick: handleClose,
        },
      ]}
      closeModal={handleClose}
      isOpen={isOpen}
      title={intl.get('REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.TITLE')}
      size='medium'
      childrenClassName='h-auto'
    >
      <Typography className='mb-4'>
        {intl.get('REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.HINT')}
      </Typography>
      <FormLabel>
        {intl.get('REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.PURPOSE')}
      </FormLabel>
      <Input
        value={intl.get(
          `REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.REASONS.${requestData.data?.cancellation?.reason}`
        )}
        disabled
        data-cy='cancellation-reason-text'
      />
      {requestData.data?.cancellation?.reason === 'OTHER' && (
        <Fragment>
          <FormLabel className='mt-4'>
            {intl.get(
              'REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.ADDITIONAL_INFORMATION'
            )}
          </FormLabel>
          <TextArea
            value={requestData.data?.cancellation.details}
            textAreaProps={{
              className: 'max-h-24',
              'data-cy': 'other-specification-text',
            }}
            disabled
          />
        </Fragment>
      )}
      <Typography variant='h5' className='my-4'>
        {intl.get('REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.LD_SECTION')}
      </Typography>
      <FormItem
        label={intl.get(
          'REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.LD_REMARK'
        )}
      >
        <TextArea
          textAreaProps={{
            placeholder: intl.get(
              'REQUEST_PAGE.MODAL.CONFIRM_CANCELLATION_REQUEST.REMARK_PLACEHOLDER'
            ),
            className: 'max-h-24',
            'data-cy': 'ld-remark-input',
          }}
          onChange={(event) => setldRemark(event.target.value)}
        />
      </FormItem>
    </Modal>
  );
};

export default ConfirmCancellationModal;
