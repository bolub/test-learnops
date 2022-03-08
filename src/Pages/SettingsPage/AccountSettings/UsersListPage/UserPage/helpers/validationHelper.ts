import { AllUsersType } from 'utils/customTypes';
import { get } from 'lodash';
import { USER_TYPES } from 'utils/constants';

export const validateRequiredFields = (userData: Partial<AllUsersType>) => {
  let errorsList = {};
  if (!userData?.data?.firstName) {
    errorsList = { firstName: true };
  }
  if (!userData?.data?.lastName) {
    errorsList = { ...errorsList, lastName: true };
  }
  if (!userData?.data?.email) {
    errorsList = { ...errorsList, email: true };
  }
  if (
    userData?.country_iso_3166_1_alpha_2_code === 'UNDEFINED' ||
    !userData?.country_iso_3166_1_alpha_2_code
  ) {
    errorsList = { ...errorsList, country: true };
  }
  if (!userData?.data?.jobTitle) {
    errorsList = { ...errorsList, jobTitle: true };
  }
  if (userData.type === USER_TYPES.L_D) {
    if (!get(userData, 'data.employmentType')) {
      errorsList = { ...errorsList, employmentType: true };
    }
    if (get(userData, 'default_capacity', '') === '') {
      errorsList = { ...errorsList, capacity: true };
    }
  } else if (
    userData.type === USER_TYPES.BUSINESS &&
    !get(userData, 'businessTeam_id')
  ) {
    errorsList = { ...errorsList, businessTeam: true };
  } else if (
    userData.type === USER_TYPES.EXTERNAL &&
    !get(userData, 'data.companyName')
  ) {
    errorsList = { ...errorsList, companyName: true };
  }
  return errorsList;
};
