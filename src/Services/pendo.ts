import get from 'lodash/get';
import moment from 'moment';
import { DATE } from 'utils/constants';
import userAPI from 'state/User/userAPI';
import organizationAPI from 'state/Organization/organizationAPI';

declare const window: any;

type Visitor = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  registrationDate?: string;
  type?: string;
  admin?: boolean;
};

type Account = {
  id?: string;
  name?: string;
  creationDate?: string;
  type?: string;
  trialEndDate?: string;
  numberOfLicenses?: string;
};

export const initPendo: (
  userEmail: string,
  organizationId: string
) => void = async (userEmail, organizationId) => {
  if (!window.pendo || !userEmail || !organizationId) {
    return;
  }

  let visitor: Visitor = {};

  if (userEmail) {
    const fetchedUser = await userAPI.getUser(userEmail);
    visitor.id = get(fetchedUser, 'data.user.id');
    visitor.email = userEmail;
    visitor.firstName = get(fetchedUser, 'data.user.data.firstName');
    visitor.lastName = get(fetchedUser, 'data.user.data.lastName');
    visitor.jobTitle = get(fetchedUser, 'data.user.data.jobTitle');
    visitor.registrationDate = moment(
      get(fetchedUser, 'data.user.createdAt')
    ).format(DATE.LONG_FORMAT);
    visitor.type = get(fetchedUser, 'data.user.type');
    visitor.admin = get(fetchedUser, 'data.user.role') === 'admin';
  }

  let account: Account = {
    id: organizationId,
  };

  if (organizationId) {
    const response = await organizationAPI.fetchOrganization(organizationId);
    account.name = response.account_name;
    account.creationDate = moment(response.createdAt).format(DATE.LONG_FORMAT);
    account.numberOfLicenses = response.license_number;
    account.trialEndDate = response.trial_end_date;
    account.type = response.license_tier;
  }

  window.pendo.initialize({
    visitor,
    account,
  });
};
