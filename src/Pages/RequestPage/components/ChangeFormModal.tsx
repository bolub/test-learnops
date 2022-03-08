import { Typography, Modal } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { deleteRequest } from 'state/Requests/requestSlice';

type ChangeFormModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  requestId: string;
  onCreateRequest: () => void;
  onClose: () => void;
};
const ChangeFormModal = ({
  setModalOpen,
  modalOpen,
  requestId,
  onCreateRequest,
  onClose,
}: ChangeFormModalProps) => {
  const dispatch = useDispatch();

  const changeRequestForm = () => {
    dispatch(deleteRequest(requestId));
    onCreateRequest();
    setModalOpen(false);
  };

  const handleCancel = () => {
    onClose();
    setModalOpen(false);
  };

  return (
    <Modal
      data-cy='change-request-form'
      aria-label='change-request-form-modal'
      actionButtons={[
        {
          children: intl.get(
            'REQUEST_PAGE.LEFT_PANEL.CHANGE_FORM_ALERT.YES_CHANGE'
          ),
          color: 'warning',
          onClick: changeRequestForm,
          'data-cy': 'change-form-button',
        },
        {
          children: intl.get(
            'REQUEST_PAGE.LEFT_PANEL.CHANGE_FORM_ALERT.CANCEL'
          ),
          variant: 'tertiary',
          onClick: handleCancel,
          'data-cy': 'cancel-change-form-button',
        },
      ]}
      titleIcon={{
        name: 'alert-circle-sharp',
        className: 'text-warning-dark',
      }}
      isOpen={modalOpen}
      closeModal={() => setModalOpen(false)}
      title={intl.get('REQUEST_PAGE.LEFT_PANEL.CHANGE_FORM_ALERT.TITLE')}
      size='medium'
    >
      <Typography>
        {intl.get('REQUEST_PAGE.LEFT_PANEL.CHANGE_FORM_ALERT.DESCRIPTION')}
      </Typography>
    </Modal>
  );
};

export default ChangeFormModal;
