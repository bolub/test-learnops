import intl from 'react-intl-universal';
import { Typography, Modal } from '@getsynapse/design-system';
import { Fragment } from 'react';

const NotifyUserModal = ({
  isOpen,
  inviteUser,
  closeModal,
}: {
  isOpen: boolean;
  inviteUser: () => void;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title={intl.get('SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.TITLE')}
      closeModal={closeModal}
      isOpen={isOpen}
      size='medium'
      aria-label={intl.get('SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.TITLE')}
      actionButtons={[
        {
          children: intl.get(
            'SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.BUTTONS.NOTIFY'
          ),
          variant: 'primary',
          onClick: inviteUser,
        },
        {
          children: intl.get(
            'SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.BUTTONS.NOT_NOW'
          ),
          variant: 'tertiary',
          onClick: closeModal,
        },
      ]}
    >
      <Fragment>
        <Typography className='mb-6'>
          {intl.get(
            'SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.BODY.FIRST_LINE'
          )}
        </Typography>
        <Typography>
          {intl.get(
            'SETTINGS_PAGE.USER_PAGE.NOTIFY_USER_MODAL.BODY.SECOND_LINE'
          )}
        </Typography>
      </Fragment>
    </Modal>
  );
};

export default NotifyUserModal;
