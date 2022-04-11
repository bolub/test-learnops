import { Modal, Typography } from '@getsynapse/design-system';
import intl from 'react-intl-universal';

type EditFormModalProps = {
  isOpen: boolean;
  handleSave: () => void;
  onClose: () => void;
  status: 'published' | 'unpublished';
};

const EditFormModal = ({
  isOpen,
  handleSave,
  onClose,
  status,
}: EditFormModalProps) => {
  const modalDataMap = {
    published: {
      ariaLabel: 'published-modal-warning',
      title: intl.get('SETTINGS_PAGE.FORMS.PUBLISHED_MODAL.TITLE'),
      description: intl.getHTML(
        'SETTINGS_PAGE.FORMS.PUBLISHED_MODAL.DESCRIPTION'
      ),
      dataCy: 'published-modal-warning',
      actionCy: 'published-modal_save',
    },
    unpublished: {
      ariaLabel: 'unpublished-modal-warning',
      title: intl.get('SETTINGS_PAGE.FORMS.UNPUBLISHED_MODAL.TITLE'),
      description: intl.getHTML(
        'SETTINGS_PAGE.FORMS.UNPUBLISHED_MODAL.DESCRIPTION'
      ),
      dataCy: 'unpublished-modal-warning',
      actionCy: 'unpublished-modal_save',
    },
  };
  return (
    <Modal
      aria-label={modalDataMap[status].ariaLabel}
      isOpen={isOpen}
      closeModal={onClose}
      title={modalDataMap[status].title}
      size='medium'
      data-cy={modalDataMap[status].dataCy}
      actionButtons={[
        {
          children: intl.get('SETTINGS_PAGE.FORMS.YES_UPDATE'),
          variant: 'primary',
          color: 'warning',
          'data-cy': modalDataMap[status].actionCy,
          onClick: handleSave,
        },
        {
          children: intl.get('CANCEL'),
          variant: 'tertiary',
          onClick: onClose,
        },
      ]}
    >
      <Typography variant='body'>{modalDataMap[status].description}</Typography>
      <Typography variant='body' className='my-4'>
        {intl.getHTML('SETTINGS_PAGE.FORMS.UNPUBLISHED_MODAL.QUESTION')}
      </Typography>
    </Modal>
  );
};

export default EditFormModal;
