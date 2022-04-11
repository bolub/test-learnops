import React, { useMemo } from 'react';
import { Typography } from '@getsynapse/design-system';
import { Week } from '../helpers';
import { RoleAllocation } from './AllocatedWeeksTable';

const EmptySection: React.FC<{
  label: string;
  currentWeeksSlideArray: Week[];
  numberOfWeeks: number;
}> = ({ label, numberOfWeeks, currentWeeksSlideArray }) => {
  const allocationsGrid = useMemo(() => {
    return currentWeeksSlideArray.map((week: Week, index: number) => (
      <RoleAllocation
        id={index}
        key={index}
        displayContent={false}
        isCurrentWeek={week.isCurrentWeek || false}
        className='flex flex-1'
      />
    ));
  }, [currentWeeksSlideArray]);

  return (
    <div className='h-10 flex flex-1'>
      <div className='w-2/5 flex shadow-allocation-table-inner'>
        <div className='w-12' />
        <div className='h-full flex flex-1 items-center shadow-table-column'>
          <Typography className='text-neutral-darker ml-2' variant='caption'>
            {label}
          </Typography>
        </div>
      </div>
      <div className='w-3/5 flex h-full'>
        <div className='w-6' />
        <div className='flex flex-1 flex-col h-full'>
          <div className={`grid grid-cols-${numberOfWeeks} h-full`}>
            {currentWeeksSlideArray.length > 0 && allocationsGrid}
          </div>
        </div>
        <div className='w-6' />
      </div>
    </div>
  );
};

export default EmptySection;
