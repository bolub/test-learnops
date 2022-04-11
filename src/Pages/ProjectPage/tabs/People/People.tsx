import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useHistory, useLocation } from 'react-router-dom';
import { Tabs } from '@getsynapse/design-system';
import { PROJECT_PEOPLE_TABS } from 'utils/constants';
import ResourcePlan from './tabs/ResourcePlan/ResourcePlan';
import ResourceAllocation from './tabs/ResourceAllocation/ResourceAllocation';
import ResourceSummary from './tabs/ResourceSummary/ResourceSummary';

const People: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(1);
  const history = useHistory();
  const { search, pathname } = useLocation();

  const queryParams = new URLSearchParams(search);
  const parentTab = queryParams.get('tab');
  const childTab = queryParams.get('subTab');

  const resourceTabs = Object.values(PROJECT_PEOPLE_TABS);

  useEffect(() => {
    if (resourceTabs.includes(childTab)) {
      const foundIndex = resourceTabs.findIndex(
        (tab: string) => tab === childTab
      );
      if (foundIndex > -1 && foundIndex !== currentTabIndex) {
        setCurrentTabIndex(foundIndex);
      }
    }
  }, [childTab, currentTabIndex, resourceTabs]);

  const handleSelectTab = (index: number) => {
    history.push(`${pathname}?tab=${parentTab}&subTab=${resourceTabs[index]}`);
    setCurrentTabIndex(index);
  };

  return (
    <div className='w-full h-full relative'>
      <div className='px-6 pt-4 h-full'>
        <Tabs
          index={currentTabIndex}
          onChange={handleSelectTab}
          tabListProps={{ className: 'w-102' }}
          type='tab'
          data={[
            {
              label: intl.get('PEOPLE.TABS.RESOURCE_PLAN'),
              content: <ResourcePlan />,
            },
            {
              label: intl.get('PEOPLE.TABS.RESOURCE_ALLOCATION'),
              content: <ResourceAllocation />,
            },
            {
              label: intl.get('PEOPLE.TABS.RESOURCE_SUMMARY'),
              content: currentTabIndex === 2 && (
                <ResourceSummary projectId={projectId} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default People;
