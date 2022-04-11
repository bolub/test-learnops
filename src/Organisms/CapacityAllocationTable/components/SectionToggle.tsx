import React, { useMemo } from 'react';
import { Typography, Icon } from '@getsynapse/design-system';
import { Week } from '../helpers';
import { RoleAllocation } from './AllocatedWeeksTable';

const SectionToggle: React.FC<{
  onToggleSection: (event: React.MouseEvent<HTMLDivElement>) => void;
  label: string;
  currentWeeksSlideArray: (Week | null)[];
  numberOfWeeks: number;
  isSectionOpen?: boolean;
}> = ({
  label,
  onToggleSection,
  numberOfWeeks,
  currentWeeksSlideArray,
  isSectionOpen = false,
}) => {
  const allocationsGrid = useMemo(() => {
    return currentWeeksSlideArray.map((week, index: number) =>
      week !== null ? (
        <RoleAllocation
          id={index}
          key={index}
          displayContent={false}
          isCurrentWeek={week.isCurrentWeek || false}
          className='flex flex-1'
        />
      ) : (
        <div key={index} />
      )
    );
  }, [currentWeeksSlideArray]);
  return (
    <div
      className='h-full flex cursor-pointer bg-neutral-white'
      onClick={onToggleSection}
    >
      <div className='w-2/5 flex h-full shadow-allocation-table-inner'>
        <div className='w-12 h-full flex items-center justify-center'>
          <div
            className='flex'
            style={{
              transform: `${isSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
              transition: 'all 0.2s linear',
            }}
          >
            <Icon name='chevron-down' className='text-lg text-neutral-dark' />
          </div>
        </div>
        <div className='px-2 flex flex-1 items-center'>
          <Typography
            variant='caption'
            className='text-neutral-darker font-semibold'
          >
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

export default SectionToggle;
