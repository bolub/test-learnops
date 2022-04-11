import intl from 'react-intl-universal';
import { TabPanel, TabPanels, Tabs } from '@reach/tabs';
import {
  Button,
  Tab,
  TabList,
  Typography,
  Icon,
} from '@getsynapse/design-system';
import OrganizationSettings from './OrganizationSettings/OrganizationSettings';
import UsersListPage from './UsersListPage/UsersListPage';
import { Fragment, useEffect, useState } from 'react';
import AddUserModal from './UsersListPage/AddUserModal';
import { selectOrganizationLicense } from 'state/Organization/organizationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LICENSE_TIER } from 'utils/constants';
import {
  getLDUsers,
  selectAvailableLicenses,
} from 'state/UsersManagement/usersManagementSlice';
import { License } from 'utils/customTypes';
const AccountSettings = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const licenseData: License = useSelector(selectOrganizationLicense);
  const availableLicenses = useSelector(selectAvailableLicenses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

  return (
    <Fragment>
      <AddUserModal isOpen={showAddUserModal} setIsOpen={setShowAddUserModal} />
      <Tabs className='min-h-full flex flex-col'>
        {({ selectedIndex }) => (
          <>
            <div className='flex justify-between items-start'>
              <TabList className='max-w-sm mb-4 w-58'>
                <Tab index={0}>{intl.get('ENTITIES.USER', { num: 2 })}</Tab>

                <Tab index={1}>
                  {intl.get('ENTITIES.ORGANIZATION', { num: 1 })}
                </Tab>
              </TabList>
              {selectedIndex === 0 && (
                <div className='flex flex-row items-center'>
                  {licenseData.license_tier !== LICENSE_TIER.TRIAL && (
                    <div className='flex flex-row mr-8 items-center'>
                      <Icon
                        name='information-circle-outline'
                        className='text-xl mr-2'
                      />
                      <Typography
                        variant='body2'
                        className='text-neutral-dark leading-4'
                      >
                        {intl.get('LICENSE.LICENSE_REMAINING', {
                          purchasedLicense: licenseData.license_number,
                          licensesLeft: availableLicenses,
                        })}
                      </Typography>
                    </div>
                  )}
                  <Button
                    onClick={() => setShowAddUserModal(true)}
                    data-cy='add-user_button'
                  >
                    {intl.get('ADD_USER.ADD_USER_BUTTON')}
                  </Button>
                </div>
              )}
            </div>

            <TabPanels className='flex-grow flex flex-col pb-4'>
              <TabPanel className='pb-11' key={0}>
                <UsersListPage />
              </TabPanel>
              <TabPanel
                key={1}
                className='flex-grow bg-neutral-white rounded pt-6'
              >
                <OrganizationSettings />
              </TabPanel>
            </TabPanels>
          </>
        )}
      </Tabs>
    </Fragment>
  );
};

export default AccountSettings;
