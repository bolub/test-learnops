import { Toggle, useElevation } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { USER_STATUS } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedUser,
  updateUser,
} from 'state/UsersManagement/usersManagementSlice';
import get from 'lodash/get';
import { AllUsersType } from 'utils/customTypes';
import { useCallback } from 'react';
const UserPageHeader = ({ accountStatus }: { accountStatus: string }) => {
  const elevationClass = useElevation(2);
  const isAccountEnabled =
    accountStatus === USER_STATUS.INVITED ||
    accountStatus === USER_STATUS.REGISTERED;
  const dispatch = useDispatch();
  const selectedUser: AllUsersType = useSelector(selectSelectedUser);

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
  }, [dispatch, selectedUser]);

  return (
    <div className='mx-6 mt-2 bg-neutral-white relative z-5'>
      <div
        className={`${elevationClass} h-12 flex items-center justify-end p-2`}
      >
        <Toggle
          label={intl.get('SETTINGS_PAGE.USER_PAGE.HEADER.ENABLE_ACCOUNT')}
          labelProps={{ className: 'mb-0 mr-2' }}
          className='flex items-center mr-4'
          isSmall
          id='enable-account-toggle'
          checked={isAccountEnabled}
          onChange={handleEnableDisable}
        />
      </div>
    </div>
  );
};

export default UserPageHeader;
