import intl from 'react-intl-universal';
import { TabPanel, TabPanels, Tabs } from '@reach/tabs';
import { Button, Tab, TabList } from '@getsynapse/design-system';
import OrganizationSettings from './OrganizationSettings/OrganizationSettings';
import UsersListPage from './UsersListPage/UsersListPage';
import { Fragment } from 'react';
import { useState } from 'react';
import AddUserModal from './UsersListPage/AddUserModal';

const AccountSettings = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
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
                <Button
                  onClick={() => setShowAddUserModal(true)}
                  data-cy='add-user_button'
                >
                  {intl.get('ADD_USER.ADD_USER_BUTTON')}
                </Button>
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
