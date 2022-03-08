import { useMemo, useState } from 'react';
import {
  Modal,
  Typography,
  Dropdown,
  FormLabel,
  FormItem,
  TextField,
  FormHelperText,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { REASONS_OF_CANCELLATION } from 'utils/constants';

type CancelRequestModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancelRequest: (reason: string, message?: string) => void;
};

const CancelRequestModal = ({
  isOpen,
  setIsOpen,
  onCancelRequest,
}: CancelRequestModalProps) => {
  const other = REASONS_OF_CANCELLATION[REASONS_OF_CANCELLATION.length - 1];
  const [data, setData] = useState<{
    reason: typeof REASONS_OF_CANCELLATION[number] | '';
    specificReason?: string;
    reasonError: boolean;
    specificReasonError: boolean;
  }>({
    reason: '',
    specificReason: '',
    reasonError: false,
    specificReasonError: false,
  });
  const reasonOptions = useMemo(() => {
    return REASONS_OF_CANCELLATION.map((reason) => ({
      value: reason,
      label: intl.get(
        `REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.REASONS.${reason}`
      ),
    }));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setData((prevData) => ({ ...prevData, reason: '', specificReason: '' }));
  };

  const handleCancelRequest = () => {
    if (!data.reason) {
      setData((prevData) => ({ ...prevData, reasonError: true }));
      return;
    }
    if (data.reason === other && !data.specificReason) {
      setData((prevData) => ({ ...prevData, specificReasonError: true }));
      return;
    }
    setData((prevData) => ({
      ...prevData,
      reasonError: false,
      specificReasonError: false,
    }));
    data.specificReason
      ? onCancelRequest(data.reason, data.specificReason)
      : onCancelRequest(data.reason);
  };

  return (
    <Modal
      aria-label='cancel-request-modal'
      actionButtons={[
        {
          children: intl.get(
            'REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.CANCELLATION'
          ),
          variant: 'primary',
          color: 'danger',
          onClick: handleCancelRequest,
          'data-cy': 'request-cancellation-button',
        },
        {
          children: intl.get(
            'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.CANCEL_BUTTON'
          ),
          variant: 'secondary',
          onClick: handleClose,
        },
      ]}
      closeModal={handleClose}
      isOpen={isOpen}
      title={intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.CANCEL_REQUEST')}
      size='medium'
    >
      <Typography className='mb-5'>
        {intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.NOTICE')}
      </Typography>
      <Typography className='mb-4'>
        {intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.CALL_TO_ACTION')}
      </Typography>
      <FormLabel state={data.reasonError ? 'error' : 'default'}>
        {intl.get(
          'REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.CANCELLATION_REASON'
        )}
      </FormLabel>
      <Dropdown
        options={reasonOptions}
        onChange={(value) =>
          setData((prevData) => ({
            ...prevData,
            reason: value.value,
            reasonError: false,
            specificReason: '',
          }))
        }
        placeholder={intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.REASON')}
        state={data.reasonError ? 'error' : 'default'}
        triggerProps={{ 'data-cy': 'cancellation-reason-dropdown' }}
      />
      {data.reasonError && (
        <FormHelperText state='error'>
          {intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.ERROR')}
        </FormHelperText>
      )}
      {data.reason === other && (
        <FormItem
          label={intl.get('REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.SPECIFY')}
          labelProps={{
            state: data.specificReasonError ? 'error' : 'default',
          }}
          className='mt-4'
        >
          <TextField
            variant='text'
            length='medium'
            placeholder={intl.get(
              'REQUESTS_LIST_PAGE.MODAL.CANCEL_REQUEST.REASON'
            )}
            onChange={(event: any) =>
              setData((prevData) => ({
                ...prevData,
                specificReason: event.target.value,
                specificReasonError: false,
              }))
            }
            defaultValue={data.specificReason}
            className='focus:ring-0'
            data-cy='other-specification-input'
            state={data.specificReasonError ? 'error' : 'default'}
            helpText={
              data.specificReasonError
                ? intl.get('REQUEST_PAGE.BASIC_DETAILS.ERRORS.MISSING_INPUT')
                : ''
            }
          />
        </FormItem>
      )}
    </Modal>
  );
};

export default CancelRequestModal;
