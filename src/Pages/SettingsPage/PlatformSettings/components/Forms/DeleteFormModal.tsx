import { useCallback } from 'react';
import { Typography, Modal } from '@getsynapse/design-system';
import intl from 'react-intl-universal';

type DeleteFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  isPublished?: boolean;
  onDelete: (formId: string) => void;
};

const DeleteFormModal = ({
  isOpen,
  onClose,
  formId,
  isPublished = false,
  onDelete,
}: DeleteFormModalProps) => {
  const handleDelete = useCallback(() => {
    onDelete(formId);
    onClose();
  }, [formId, onClose, onDelete]);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      aria-label='delete-form'
      data-cy='delete-form_modal'
      title={intl.get('SETTINGS_PAGE.FORMS.DELETE.TITLE', {
        status: isPublished
          ? intl.get('SETTINGS_PAGE.FORMS.PUBLISHED').toLocaleLowerCase()
          : intl.get('SETTINGS_PAGE.FORMS.UN_PUBLISHED').toLocaleLowerCase(),
      })}
      size='medium'
      actionButtons={[
        {
          children: intl.get(
            'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.DELETE_BUTTON'
          ),
          variant: 'primary',
          color: 'danger',
          onClick: handleDelete,
          'data-cy': 'delete-form_button',
        },
        {
          children: intl.get(
            'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.CANCEL'
          ),
          variant: 'tertiary',
          onClick: onClose,
          'data-cy': 'delete_cancel',
        },
      ]}
    >
      <Typography className='pb-6'>
        {isPublished
          ? intl.getHTML('SETTINGS_PAGE.FORMS.DELETE.PUBLISHED_DESCRIPTION')
          : intl.getHTML('SETTINGS_PAGE.FORMS.DELETE.UNPUBLISHED_DESCRIPTION')}
      </Typography>
      <Typography className=''>
        {intl.get('SETTINGS_PAGE.FORMS.DELETE.QUESTION')}
      </Typography>
    </Modal>
  );
};

export default DeleteFormModal;
