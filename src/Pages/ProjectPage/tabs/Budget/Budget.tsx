import { useState } from 'react';
import { Tabs } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import BudgetPlan from './BudgetPlan';
import BudgetDetails from './BudgetDetails';

const Budget = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  return (
    <div className='pt-4 px-6'>
      <Tabs
        index={currentTabIndex}
        onChange={(index: number) => setCurrentTabIndex(index)}
        tabListProps={{
          className: 'mb-4 w-58',
        }}
        type='tab'
        data={[
          {
            label: intl.get('BUDGET.BUDGET_PLAN'),
            content: <BudgetPlan />,
          },
          {
            label: intl.get('BUDGET.BUDGET_DETAILS'),
            content: <BudgetDetails />,
          },
        ]}
      />
    </div>
  );
};

export default Budget;
