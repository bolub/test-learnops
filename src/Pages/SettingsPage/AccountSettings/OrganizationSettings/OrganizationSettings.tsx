import intl from 'react-intl-universal';
import { Tab, TabList, Typography } from '@getsynapse/design-system';
import { TabPanel, TabPanels, Tabs } from '@reach/tabs';
import VendorsPage from './Vendors/VendorsPage';
import LearningTeams from './components/LearningTeams';
import BusinessTeams from './components/BusinessTeams';

const OrganizationSettings = () => (
  <Tabs>
    <div className='shadow-header px-4'>
      <Typography variant='h4'>
        {intl.get('ORG_SETTINGS_PAGE.TITLE')}
      </Typography>

      <Typography variant='caption' className='text-neutral'>
        {intl.get('ORG_SETTINGS_PAGE.CAPTION')}
      </Typography>

      <TabList type='subHeader'>
        <Tab index={0} type='subHeader'>
          {intl.get('ENTITIES.LEARNING_TEAM', { num: 2 })}
        </Tab>

        <Tab index={1} type='subHeader'>
          {intl.get('ENTITIES.BUSINESS_TEAM', { num: 2 })}
        </Tab>

        <Tab index={2} type='subHeader'>
          {intl.get('ENTITIES.VENDOR', { num: 2 })}
        </Tab>
      </TabList>
    </div>

    <TabPanels>
      <TabPanel key={0}>
        <LearningTeams />
      </TabPanel>

      <TabPanel key={1}>
        <BusinessTeams />
      </TabPanel>

      <TabPanel key={2}>
        <VendorsPage />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default OrganizationSettings;
