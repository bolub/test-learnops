import React from 'react';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { Typography, Tooltip } from '@getsynapse/design-system';
import {
  ParticipanttAllocation,
  WeekTimeOffAndHolidays,
} from 'utils/customTypes';

export const UserAllocation: React.FC<{
  allocation: ParticipanttAllocation;
}> = ({ allocation }) => {
  const availability = allocation.capacity - allocation.allocatedHours;
  return (
    <div
      className={classnames('w-full h-6 flex justify-center items-center', {
        'bg-success-light': availability > 0,
        'bg-error-lighter': availability <= 0,
      })}
    >
      <Typography
        variant='label'
        className={classnames('font-semibold mr-1.5', {
          'text-success-dark': availability > 0,
          'text-error-dark': availability <= 0,
        })}
      >
        {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.ALLOCATION_TIME', {
          allocation: allocation.allocatedHours,
        })}
      </Typography>
      <Typography
        variant='caption'
        className={classnames({
          'text-success-dark': availability > 0,
          'text-error-dark': availability <= 0,
        })}
      >
        {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.ALLOCATION_AVAILABILITY', {
          availability,
        })}
      </Typography>
    </div>
  );
};

export const TimeOffAllocation: React.FC<{
  timeOff: WeekTimeOffAndHolidays;
}> = ({ timeOff }) => {
  const timeLabel = `${
    timeOff.weeklyTimeOffForUser + 8 * timeOff.holidaysWithinWeek.length
  }${intl.get(
    'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOUR_LABEL'
  )}`;
  return (
    <Tooltip
      className='flex w-full'
      trigger={
        <div className='w-full h-6 bg-warning-lighter flex justify-center items-center cursor-pointer'>
          <Typography
            className='text-warning-dark font-semibold'
            varian='caption'
          >
            {timeLabel}
          </Typography>
        </div>
      }
      ariaId='review-allocation-warning'
      openMode='hover2'
      timeout={0}
      position='topCenter'
      contentProps={{
        className: classnames(
          'bg-neutral-dark',
          'rounded px-4 py-3.5',
          'w-max absolute',
          'font-normal',
          'shadow-tooltip'
        ),
      }}
    >
      <div className='flex justify-between'>
        <Typography
          variant='caption'
          className='text-neutral-white font-semibold mr-4'
        >
          {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.TIME_OFF_TOOLTIP')}
        </Typography>
        <Typography variant='label' className='text-neutral-white'>
          {timeLabel}
        </Typography>
      </div>
    </Tooltip>
  );
};
