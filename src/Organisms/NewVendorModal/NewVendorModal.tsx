import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import { Button, Modal, Typography } from '@getsynapse/design-system';
import VendorForm from 'Organisms/NewVendorModal/VendorForm';
import { ProjectVendor } from 'utils/customTypes';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { addVendor } from 'state/Vendors/vendorsSlice';

const ADD_VENDOR_FORM = 'add_vendor_form';

const NewVendorModal = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasName, setHasName] = useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
    setIsLoading(false);
    setHasName(false);
  };

  const onSubmit = useCallback<(vendor: Partial<ProjectVendor>) => void>(
    async (vendor) => {
      setIsLoading(true);
      await dispatch(addVendor(vendor));
      dispatch(
        setNotificationText(intl.get('VENDORS_PAGE.SUCCESS_NOTIFICATION'))
      );
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
      onClose();
    },
    [dispatch]
  );

  const handleNameChange = useCallback((value) => setHasName(value), []);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} data-cy='add-vendor-button'>
        {intl.get('VENDORS_PAGE.ADD_VENDOR_LINK')}
      </Button>

      <Modal
        isOpen={isOpen}
        closeModal={onClose}
        aria-label='Add a Vendor'
        data-cy='add-vendor-modal'
        title={intl.get('VENDORS_PAGE.ADD_VENDOR_LINK')}
        size='large'
        className='h-screen'
        childrenClassName='max-h-136'
        actionButtons={[
          {
            children: intl.get('TEAMS.SAVE'),
            variant: 'primary',
            'data-cy': 'confirm-button',
            form: ADD_VENDOR_FORM,
            disabled: !hasName,
            loading: isLoading,
          },
          {
            children: intl.get('CANCEL'),
            variant: 'tertiary',
            onClick: onClose,
            'data-cy': 'cancel-button',
          },
        ]}
      >
        <Typography variant='body' className='mb-6'>
          {intl.get('VENDORS_PAGE.VENDOR_DETAILS')}
        </Typography>

        <VendorForm
          formId={ADD_VENDOR_FORM}
          onSubmit={onSubmit}
          onNameChange={handleNameChange}
        />
      </Modal>
    </>
  );
};

export default NewVendorModal;
