import { Toggle, useElevation, Tooltip } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { USER_STATUS, USER_TYPES, USER_ACTIONS } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAvailableLicenses,
  selectSelectedUser,
  updateUser,
  inviteUser,
  getLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import get from 'lodash/get';
import { AllUsersType, MoreActionsOption } from 'utils/customTypes';
import { useCallback, useEffect, useMemo } from 'react';
import MoreActions from 'Organisms/MoreActions/MoreActions';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';

const UserToggle = ({
  isAccountEnabled,
  handleEnableDisable,
  toggleDisabled,
}: {
  isAccountEnabled: boolean;
  handleEnableDisable: () => Promise<void>;
  toggleDisabled: boolean;
}) => {
  return (
    <Toggle
      label={intl.get('SETTINGS_PAGE.USER_PAGE.HEADER.ENABLE_ACCOUNT')}
      labelProps={{ className: 'mb-0 mr-2' }}
      className='flex items-center mr-4'
      isSmall
      id='enable-account-toggle'
      checked={isAccountEnabled}
      onChange={handleEnableDisable}
      disabled={toggleDisabled}
    />
  );
};

const UserPageHeader = ({ accountStatus }: { accountStatus: string }) => {
  const elevationClass = useElevation(2);
  const isAccountEnabled =
    accountStatus === USER_STATUS.INVITED ||
    accountStatus === USER_STATUS.REGISTERED;
  const dispatch = useDispatch();
  const selectedUser: AllUsersType = useSelector(selectSelectedUser);
  const availableLicenses = useSelector(selectAvailableLicenses);

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

  const handleEnableDisable = useCallback(async () => {
    const userStatus = get(selectedUser, 'status');
    switch (userStatus) {
      case USER_STATUS.REGISTERED:
      case USER_STATUS.INVITED:
        await dispatch(
          updateUser({
            userId: get(selectedUser, 'id'),
            updateFields: {
              disabled_at: new Date().toISOString(),
              status:
                userStatus === USER_STATUS.REGISTERED
                  ? USER_STATUS.REGISTERED_DISABLED
                  : USER_STATUS.INVITED_DISABLED,
            },
          })
        );
        break;
      case USER_STATUS.REGISTERED_DISABLED:
      case USER_STATUS.INVITED_DISABLED:
        await dispatch(
          updateUser({
            userId: get(selectedUser, 'id'),
            updateFields: {
              disabled_at: null,
              status:
                userStatus === USER_STATUS.REGISTERED_DISABLED
                  ? USER_STATUS.REGISTERED
                  : USER_STATUS.INVITED,
            },
          })
        );
        break;
    }
    dispatch(getLDUsers());
  }, [dispatch, selectedUser]);

  const toggleDisabled = useMemo((): boolean => {
    if (
      selectedUser.type === USER_TYPES.L_D &&
      !isAccountEnabled &&
      availableLicenses < 1
    ) {
      return true;
    }

    return false;
  }, [availableLicenses, isAccountEnabled, selectedUser.type]);

  const options: MoreActionsOption[] = useMemo(() => {
    return [
      {
        iconName: 'mail',
        label: intl.get(
          'SETTINGS_PAGE.USER_PAGE.HEADER.MORE_ACTIONS.NOTIFY_USER'
        ),
        value: USER_ACTIONS.NOTIFY,
      },
    ];
  }, []);

  const onSelectOption = (option: MoreActionsOption) => {
    switch (option.value) {
      case USER_ACTIONS.NOTIFY:
        const userId = selectedUser.id;
        const email = selectedUser.data.email;
        const firstName = selectedUser.data.firstName;
        dispatch(inviteUser({ userId, email, firstName }));
        dispatch(setNotificationTimeout(4000));
        dispatch(setNotificationVariant('success'));
        dispatch(
          setNotificationText(intl.get('SETTINGS_PAGE.USER_PAGE.USER_NOTIFIED'))
        );
        dispatch(displayNotification());
        break;
      default:
        break;
    }
  };

  return (
    <div className='mx-6 mt-2 bg-neutral-white relative z-5'>
      <div
        className={`${elevationClass} h-12 flex items-center justify-end p-2`}
      >
        {toggleDisabled ? (
          <div>
            <Tooltip
              openMode='hover2'
              ariaId='license-info'
              position='bottomLeft'
              trigger={
                <div>
                  <UserToggle
                    isAccountEnabled={isAccountEnabled}
                    handleEnableDisable={handleEnableDisable}
                    toggleDisabled={toggleDisabled}
                  />
                </div>
              }
              contentProps={{
                className: 'bg-warning-lighter text-warning-dark',
              }}
            >
              <span>{intl.get('LICENSE.LICENSE_ACTIVATION')}</span>
            </Tooltip>
          </div>
        ) : (
          <UserToggle
            isAccountEnabled={isAccountEnabled}
            handleEnableDisable={handleEnableDisable}
            toggleDisabled={toggleDisabled}
          />
        )}
        {accountStatus === USER_STATUS.INVITED && (
          <MoreActions options={options} onSelectOption={onSelectOption} />
        )}
      </div>
    </div>
  );
};

export default UserPageHeader;
