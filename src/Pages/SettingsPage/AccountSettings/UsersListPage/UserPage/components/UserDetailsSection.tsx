import BasicInformation from './BasicInformation';
import JobInformation from './JobInformation';
import CapacityManagement from './CapacityManagement';
import Divider from 'Atoms/Divider';
import { AllUsersType, HolidaysType } from 'utils/customTypes';
import get from 'lodash/get';
import { useState, useEffect, useCallback } from 'react';
import { USER_TYPES } from 'utils/constants';
import Holidays from 'date-holidays';
import { AccountDeactivationBanner } from '../Banner';
import {
  selectDisabledDate,
  selectSelectedUser,
} from 'state/UsersManagement/usersManagementSlice';
import { useSelector } from 'react-redux';
import { USER_STATUS } from 'utils/constants';
import classnames from 'classnames';

const UserDetailsSection = ({
  userObj,
  handleChangeField,
  errors,
}: {
  userObj?: Partial<AllUsersType>;
  handleChangeField: (
    eventTargetValue: string | string[] | boolean | number,
    pathToUpdate: string
  ) => void;
  errors: any;
}) => {
  const userType = get(userObj, 'type', 'ld');
  const countryCode = get(userObj, 'country_iso_3166_1_alpha_2_code', '');
  const [country, setCountry] = useState(countryCode);
  const [holidays, setHolidays] = useState<HolidaysType[] | undefined>();
  const disabledAtDate = useSelector(selectDisabledDate);
  const selectedUser: AllUsersType = useSelector(selectSelectedUser);

  const status = get(selectedUser, 'status');

  const handleChange = (value: string, path: string) => {
    if (path === 'country_iso_3166_1_alpha_2_code') {
      const hasHolidays = getHolidays(value).length > 0;
      if (!hasHolidays) {
        handleChangeField(false, 'public_holidays_in_capacity_enabled');
      }
    }
    handleChangeField(value, path);
  };

  const getHolidays = useCallback(
    (countryName?: string) => {
      const hd = new Holidays();
      hd.init(countryName ? countryName : country);
      const allHolidays = hd.getHolidays(new Date().getFullYear());
      setHolidays(allHolidays.filter((holiday) => holiday.type === 'public'));
      return allHolidays;
    },
    [country]
  );

  useEffect(() => {
    getHolidays();
  }, [getHolidays]);

  return (
    <div
      className={classnames(
        'pb-24 h-full bg-neutral-white overflow-y-auto mx-6',
        { 'mt-4': !get(userObj, 'id') }
      )}
    >
      {(status === USER_STATUS.INVITED_DISABLED ||
        status === USER_STATUS.REGISTERED_DISABLED) && (
        <AccountDeactivationBanner closedDate={disabledAtDate} />
      )}
      <BasicInformation
        user={userObj}
        userType={userType}
        handleChangeField={handleChange}
        setCountry={setCountry}
        country={country}
        errors={errors}
      />
      <Divider />
      <JobInformation
        user={userObj}
        userType={userType}
        handleChangeField={handleChangeField}
        errors={errors}
      />

      {userType === USER_TYPES.L_D ? (
        <>
          <Divider />
          <CapacityManagement
            user={userObj}
            handleChangeField={handleChangeField}
            country={country}
            errors={errors}
            holidays={holidays}
          />
        </>
      ) : null}
    </div>
  );
};

export default UserDetailsSection;
