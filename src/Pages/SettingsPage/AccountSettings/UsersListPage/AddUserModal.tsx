import intl from 'react-intl-universal';
import {
  FormItem,
  Typography,
  TextField,
  Dropdown,
  Modal,
} from '@getsynapse/design-system';
import { useHistory } from 'react-router-dom';
import { LICENSE_TIER, PATHS, USER_TYPES } from 'utils/constants';
import { useState, useMemo, Fragment } from 'react';
import { Option, License } from 'utils/customTypes';
import LicenseBanner from './LicenseBanner';
import { useSelector } from 'react-redux';
import { selectOrganizationLicense } from 'state/Organization/organizationSlice';
import { selectAvailableLicenses } from 'state/UsersManagement/usersManagementSlice';

const AddUserModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const userTypeOptions = useMemo(
    () => [
      {
        value: USER_TYPES.L_D,
        label: intl.get('USERS_PAGE.TABLE.USER_TYPE.LD'),
      },
      {
        value: USER_TYPES.BUSINESS,
        label: intl.get('USERS_PAGE.TABLE.USER_TYPE.BUSINESS'),
      },
      {
        value: USER_TYPES.EXTERNAL,
        label: intl.get('USERS_PAGE.TABLE.USER_TYPE.EXTERNAL'),
      },
    ],
    []
  );

  const licenseData: License = useSelector(selectOrganizationLicense);

  const availableLicenses = useSelector(selectAvailableLicenses);

  const addUser = () => history.push(`${PATHS.USER_PAGE}/${email}/${userType}`);

  const closeModal = () => {
    setIsOpen(false);
    setEmail('');
    setUserType('');
  };

  return (
    <Modal
      title={intl.get('ADD_USER.ADD_USER_MODAL.TITLE', {
        op: 1,
        userType: 'User',
      })}
      closeModal={closeModal}
      isOpen={isOpen}
      aria-label={intl.get('ADD_USER.ADD_USER_MODAL.TITLE')}
      size='large'
      actionButtons={[
        {
          children: intl.get('ADD_USER.ADD_USER_MODAL.CONTINUE_BUTTON'),
          variant: 'primary',
          onClick: addUser,
          disabled: !email || !userType,
          'data-cy': 'continue-add-user_button',
        },
        {
          children: intl.get('CANCEL'),
          variant: 'tertiary',
          onClick: closeModal,
        },
      ]}
    >
      <Fragment>
        <Typography variant='body' className='mb-4 text-neutral-black'>
          {intl.get('ADD_USER.ADD_USER_MODAL.BODY')}
        </Typography>
        <div className='grid grid-cols-2 gap-x-10 h-20'>
          <FormItem
            label={intl.get('ADD_USER.ADD_USER_MODAL.EMAIL_LABEL')}
            labelProps={{
              required: true,
            }}
          >
            <TextField
              variant='text'
              length='medium'
              placeholder={intl.get(
                'ADD_USER.ADD_USER_MODAL.EMAIL_PLACEHOLDER'
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              data-cy='user-email_input'
            />
          </FormItem>
          <FormItem
            label={intl.get('ADD_USER.ADD_USER_MODAL.USER_TYPE_LABEL')}
            labelProps={{
              required: true,
            }}
            helpText={
              userType &&
              intl.get(
                `ADD_USER.ADD_USER_MODAL.USER_TYPE_HELP_TEXT.${userType.toUpperCase()}`
              )
            }
            helpTextProps={{
              className: 'text-neutral-black',
            }}
          >
            <Dropdown
              options={userTypeOptions}
              triggerProps={{
                className: 'h-6',
                placeholder: intl.get(
                  'ADD_USER.ADD_USER_MODAL.USER_TYPE_PLACEHOLDER'
                ),
                'data-cy': 'user-type_dropdown',
              }}
              onChange={(option: Option) => setUserType(option.value)}
            />
          </FormItem>
        </div>
      </Fragment>
      {userType === USER_TYPES.L_D &&
        licenseData.license_tier !== LICENSE_TIER.TRIAL &&
        availableLicenses < 1 && <LicenseBanner />}
    </Modal>
  );
};

export default AddUserModal;
