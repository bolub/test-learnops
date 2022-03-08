import intl from 'react-intl-universal';
import { TabPanel, TabPanels, Tabs } from '@reach/tabs';
import { Tab, TabList } from '@getsynapse/design-system';
import ProjectSettings from './ProjectSettings/ProjectSettings';
import FormsPage from './components/Forms/FormsPage';

const PlatformSettings = () => {
  return (
    <Tabs className='min-h-full flex flex-col'>
      <TabList className='max-w-sm mb-4'>
        <Tab index={0}>{intl.get('GENERAL')}</Tab>

        <Tab index={1} data-cy='platform-request'>
          {intl.get('ENTITIES.REQUEST_FORM', { num: 2 })}
        </Tab>

        <Tab index={2} data-cy='platform-settings__projects-tab'>
          {intl.get('ENTITIES.PROJECT', { num: 2 })}
        </Tab>
      </TabList>
      <TabPanels className='flex-grow flex flex-col pb-4'>
        <TabPanel key={0}></TabPanel>

        <TabPanel key={1}>
          <FormsPage />
        </TabPanel>

        <TabPanel key={2} className='flex-grow bg-neutral-white rounded pt-6'>
          <ProjectSettings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default PlatformSettings;
