import intl from 'react-intl-universal';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import { TabPanels, TabPanel, Tabs } from '@reach/tabs';
import { Tab, TabList } from '@getsynapse/design-system';
import AccountSettings from './AccountSettings/AccountSettings';
import PlatformSettings from './PlatformSettings/PlatformSettings';

const SettingsPage = () => {
  return (
    <Tabs className='flex flex-col min-h-full'>
      <PageTitle
        titleComponent={intl.get('SIDEBAR.SETTINGS')}
        headerChildren={
          <TabList type='subHeader'>
            <Tab index={0} type='subHeader'>
              {intl.get('ENTITIES.ACCOUNT', { num: 1 })}
            </Tab>

            <Tab index={1} type='subHeader' data-cy='platform-tab'>
              {intl.get('ENTITIES.PLATFORM', { num: 1 })}
            </Tab>
          </TabList>
        }
      />

      <TabPanels className='mx-6 mt-5 flex flex-grow'>
        <TabPanel key={0} className='flex-grow'>
          <AccountSettings />
        </TabPanel>

        <TabPanel key={1} className='flex-grow'>
          <PlatformSettings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SettingsPage;
