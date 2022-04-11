import { useState, useEffect, useLayoutEffect } from 'react';
import { TabPanels, TabPanel, Tabs } from '@reach/tabs';
import { Tab, TabList } from '@getsynapse/design-system';
import intl from 'react-intl-universal';

import config from 'config/Config';
import PageTitle from 'Molecules/PageTitle/PageTitle';

import './styles.css';

declare global {
  interface Window {
    yellowfin: any;
  }
}

const tabsDashboards = [
  {
    id: '23178d1a-cbc2-4aef-83f5-d9424123133f',
    elementId: 'rpt169860',
  },
  {
    id: '2ace0702-3b46-4f6b-a2c7-9f7583555868',
    elementId: 'rpt36539',
  },
];

const loadAPI = () =>
  new Promise<void>((resolve) => {
    if (document.getElementById('yellowfin-api-script') !== null) {
      return resolve();
    }

    const yellowfinHost = config.get('yellowfinURL');
    const apiURL = yellowfinHost + '/JsAPI/v3';
    const scriptTag = document.createElement('script');

    scriptTag.type = 'text/javascript';
    scriptTag.src = apiURL;
    scriptTag.id = 'yellowfin-api-script';
    scriptTag.onload = () => {
      resolve();
    };

    document.head.appendChild(scriptTag);
  });

const InsightsPage = () => {
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [dashboardDrawStatus, setDashboardDrawStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const handleTabChange = (index: number) => {
    loadDashboard(tabsDashboards[index]);
  };

  const loadDashboard = ({ id, elementId }: { [key: string]: string }) => {
    const options = {
      element: document.querySelector(`#${elementId}`),
      dashboardUUID: id,
      showInfo: 'false',
      showShare: 'false',
      showExport: 'false',
      showToolbar: 'false',
      showGlobalContentContainer: 'true',
    };

    const loadAndDrawDashboard = () => {
      if (dashboardDrawStatus[id]) {
        return;
      } else {
        setDashboardDrawStatus({
          ...dashboardDrawStatus,
          [id]: true,
        });
      }

      const yfin: any = window.yellowfin;

      if (yfin) {
        yfin.loadDashboardAPI().then(() => {
          yfin.dashboards.loadDashboard(options);
        });
      }
    };

    const localRetry = () => {
      if (isAPIReady) {
        loadAndDrawDashboard();
      } else {
        setTimeout(localRetry, 250);
      }
    };

    localRetry();
  };

  useLayoutEffect(() => {
    loadAPI().then(() => {
      setIsAPIReady(true);
    });
  });

  useEffect(() => {
    loadDashboard(tabsDashboards[0]);
  });

  return (
    <Tabs className='flex flex-col h-full' onChange={handleTabChange}>
      <PageTitle
        titleComponent={intl.get('INSIGHTS_PAGE.TITLE')}
        headerChildren={
          <div className='flex'>
            <TabList type='subHeader'>
              <Tab index={0} type='subHeader'>
                {intl.get('INSIGHTS_PAGE_TABS.INTAKE')}
              </Tab>

              <Tab index={1} type='subHeader'>
                {intl.get('INSIGHTS_PAGE_TABS.PROJECTS')}
              </Tab>
            </TabList>
          </div>
        }
      />

      <TabPanels id='yellowfin-wrapper' className='mx-auto pb-16 px-6 w-full'>
        <TabPanel key={0}>
          <div id='rpt169860' className='w-full flex' />
        </TabPanel>

        <TabPanel key={1}>
          <div id='rpt36539' className='w-full flex' />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default InsightsPage;
