import { Tabs } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useState } from 'react';
import ResourcePlan from './ResourcePlan';

const Budget = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  return (
    <div className='pt-4 px-6'>
      <Tabs
        index={currentTabIndex}
        onChange={(index: number) => setCurrentTabIndex(index)}
        tabListProps={{
          className: 'mb-4 w-96',
        }}
        type='tab'
        data={[
          {
            label: intl.get('PEOPLE.RESOURCE_PLAN'),
            content: <ResourcePlan />,
          },
          {
            label: intl.get('PEOPLE.RESOURCE_ALLOCATION'),
            content: 'Resource Allocation',
          },
          {
            label: intl.get('PEOPLE.RESOURCE_SUMMARY'),
            content: 'Resource summary',
          },
        ]}
      />
    </div>
  );
};

export default Budget;
