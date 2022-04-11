import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Typography, Modal, FormItem, Input } from '@getsynapse/design-system';
import intl from 'react-intl-universal';

type DuplicateFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formName?: string;
  formId: string;
  onDuplicate: (title: string, formId: string, redirect: boolean) => void;
};

const DuplicateFormModal = ({
  isOpen,
  onClose,
  formName,
  formId,
  onDuplicate,
}: DuplicateFormModalProps) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(`${formName} ${intl.get('SETTINGS_PAGE.FORMS.DUPLICATE.COPY')}`);
  }, [formName]);

  const onTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value),
    []
  );

  const handleDuplicate = useCallback(() => {
    onDuplicate(title, formId, false);
    onClose();
  }, [formId, onClose, onDuplicate, title]);

  const handleDuplicateRedirect = useCallback(() => {
    onDuplicate(title, formId, true);
    onClose();
  }, [formId, onClose, onDuplicate, title]);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      aria-label='duplicate-form'
      data-cy='duplicate-form_modal'
      title={intl.get('SETTINGS_PAGE.FORMS.DUPLICATE.DUPLICATE_FORM')}
      size='medium'
      actionButtons={[
        {
          children: intl.get(
            'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SAVE_OPEN'
          ),
          variant: 'primary',
          onClick: handleDuplicateRedirect,
          disabled: !title.trim(),
          'data-cy': 'duplicate_save-open',
        },
        {
          children: intl.get(
            'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SAVE_NOW'
          ),
          variant: 'secondary',
          onClick: handleDuplicate,
          disabled: !title.trim(),
          'data-cy': 'duplicate_save',
        },
        {
          children: intl.get(
            'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.CANCEL'
          ),
          variant: 'tertiary',
          onClick: onClose,
          'data-cy': 'duplicate_cancel',
        },
      ]}
    >
      <Typography className='pb-4'>
        {intl.get('SETTINGS_PAGE.FORMS.DUPLICATE.FILL_DETAILS')}
      </Typography>
      <Typography variant='body2' weight='medium' className='pb-2'>
        {intl.get('SETTINGS_PAGE.FORMS.DUPLICATE.ORIGINAL_NAME')}
      </Typography>
      <Typography className='pb-4' data-cy='form-original_name'>
        {formName}
      </Typography>
      <FormItem
        className='h-16'
        labelProps={{ required: true }}
        label={intl.get('SETTINGS_PAGE.FORMS.DUPLICATE.NEW_NAME')}
      >
        <Input
          className='h-10'
          placeholder={intl.get('SETTINGS_PAGE.FORMS.FORM_TITLE')}
          value={title}
          onChange={onTitleChange}
          data-cy='form-new_name'
        />
      </FormItem>
    </Modal>
  );
};

export default DuplicateFormModal;
