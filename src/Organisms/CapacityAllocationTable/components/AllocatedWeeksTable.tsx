import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { IconButton, Typography } from '@getsynapse/design-system';
import get from 'lodash/get';
import {
  Allocation,
  Assignment,
  AllocatedUserRole,
  Estimation,
  generateGridColumnsArray,
} from '../helpers';
import {
  Week,
  confirmAllocationBetweenWeek,
  confirmAllocationBetweenWeeks,
  confirmAllocationOutOfWeeksRange,
} from '../helpers';

export const TableHeaders: React.FC<{
  currentWeeksSlideArray: (Week | null)[];
  currentWeeksSlide: number;
  onChangeWeeksSlide: (slide: number) => void;
  weeksSlidesNumber: number;
}> = ({
  currentWeeksSlideArray,
  currentWeeksSlide,
  onChangeWeeksSlide,
  weeksSlidesNumber,
}) => {
  const handleChangeSlide = (direction: 'prev' | 'next') => {
    let nextSlide = currentWeeksSlide;
    if (direction === 'prev' && currentWeeksSlide > 0) {
      nextSlide = currentWeeksSlide - 1;
    }

    if (direction === 'next' && currentWeeksSlide < weeksSlidesNumber) {
      nextSlide = currentWeeksSlide + 1;
    }
    onChangeWeeksSlide(nextSlide);
  };
  return (
    <div className='flex flex-1 h-10 relative'>
      <div className='w-6 h-full flex justify-center items-center absolute top-0 left-0'>
        <IconButton
          name='chevron-back'
          className='text-primary-dark text-lg'
          onClick={() => handleChangeSlide('prev')}
          disabled={currentWeeksSlide === 1}
        />
      </div>
      <div className='w-6 h-full flex justify-center items-center absolute top-0 right-0'>
        <IconButton
          name='chevron-forward'
          className='text-primary-dark text-lg'
          onClick={() => handleChangeSlide('next')}
          disabled={currentWeeksSlide === weeksSlidesNumber}
        />
      </div>
      <div className='px-6 h-full flex flex-1'>
        {currentWeeksSlideArray.map((week, index: number) => (
          <div
            key={index}
            className={classnames('flex flex-1 items-center justify-center', {
              'bg-primary-lighter border-b-2 boder-primary-dark': get(
                week,
                'isCurrentWeek',
                false
              ),
            })}
          >
            {week !== null && (
              <Typography
                variant='caption'
                className='font-semibold text-primary-dark'
              >
                {week.label}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AssignmentAllocation: React.FC<{
  bgColor: string;
  borderColor: string;
  textColor: string;
  name: string;
  time?: string;
  className?: string;
}> = ({ bgColor, borderColor, textColor, name, time, className }) => (
  <div
    className={classnames(
      'h-6 flex items-center border-b-2 justify-between',
      bgColor,
      borderColor,
      className
    )}
  >
    <Typography variant='caption' className={textColor}>
      {name}
    </Typography>
    {time && (
      <Typography variant='caption' className={textColor}>
        {time}
      </Typography>
    )}
  </div>
);

const EstimationAllocation: React.FC<{
  bgColor: string;
  textColor: string;
  onClickCallback: (id: string) => void;
  label?: string;
  userId: string;
  className?: string;
}> = ({ bgColor, textColor, className, label, userId, onClickCallback }) => {
  return (
    <div
      className={classnames('h-6 flex items-center', bgColor, className)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClickCallback(userId);
      }}
    >
      {label && (
        <Typography
          variant='label'
          className={classnames('font-semibold ml-2', textColor)}
        >
          {label}
        </Typography>
      )}
    </div>
  );
};

export const RoleAllocation: React.FC<{
  id: number | string;
  isCurrentWeek: boolean;
  displayContent: boolean;
  content?: ReactNode;
  className?: string;
}> = ({ isCurrentWeek, displayContent, content, className, id }) => (
  <div
    key={id}
    className={classnames('shadow-table-column', className, {
      'bg-primary-lightest': isCurrentWeek,
    })}
  >
    {displayContent ? content : <div className='h-6' />}
  </div>
);

const completeRoleAllocationsGrid = (
  start: number,
  currentWeeksSlideArray: Week[],
  className?: string,
  id?: string
) => {
  const allocationsGrid: ReactNode[] = [];
  for (let i = start; i < currentWeeksSlideArray.length; i++) {
    allocationsGrid.push(
      <RoleAllocation
        key={`${id}-${new Date(
          currentWeeksSlideArray[i].startWeekDate
        ).valueOf()}`}
        id={`${id}-${new Date(
          currentWeeksSlideArray[i].startWeekDate
        ).valueOf()}`}
        displayContent={false}
        isCurrentWeek={currentWeeksSlideArray[i].isCurrentWeek}
        className={className}
      />
    );
  }
  return allocationsGrid;
};

export const RoleAllocations: React.FC<{
  userId: string;
  roles: AllocatedUserRole[];
  currentWeeksSlideArray: Week[];
  numberOfWeeks: number;
  timeOffs?: Allocation[];
}> = ({
  userId,
  roles,
  currentWeeksSlideArray,
  numberOfWeeks,
  timeOffs = [],
}) => {
  const getRoleEstimationGrid = (estimation: Estimation, id: string) => {
    const allocationsGrid: ReactNode[] = [];
    const { startDate, endDate } = estimation;
    const gridsColumnsArray = generateGridColumnsArray(
      currentWeeksSlideArray,
      startDate,
      endDate
    );
    let labelDisplayed = false;
    for (let i = 0; i < gridsColumnsArray.length; i++) {
      const shouldDisplayContent = gridsColumnsArray[i];
      const { label, ...otherContentProps } = estimation.content;
      allocationsGrid.push(
        <RoleAllocation
          key={`${id}-${new Date(
            currentWeeksSlideArray[i].startWeekDate
          ).valueOf()}`}
          id={`${id}-${new Date(
            currentWeeksSlideArray[i].startWeekDate
          ).valueOf()}`}
          displayContent={shouldDisplayContent}
          isCurrentWeek={currentWeeksSlideArray[i].isCurrentWeek}
          className='col-span-1 py-2'
          content={
            <EstimationAllocation
              {...otherContentProps}
              label={!labelDisplayed ? label : ''}
            />
          }
        />
      );
      if (shouldDisplayContent && !labelDisplayed) {
        labelDisplayed = true;
      }
    }
    if (gridsColumnsArray.length < currentWeeksSlideArray.length) {
      const gridRemain = completeRoleAllocationsGrid(
        gridsColumnsArray.length,
        currentWeeksSlideArray,
        'col-span-1 py-2',
        `estimation-`
      );
      return allocationsGrid.concat(gridRemain);
    }
    return allocationsGrid;
  };

  const getRoleAllocationsGrid = (allocations: Allocation[], id?: string) => {
    let start = 0;
    const allocationsGrid: ReactNode[] = [];
    const isAllocationsOutOfCurrentWeeksRange =
      confirmAllocationOutOfWeeksRange(currentWeeksSlideArray, {
        weekEnd: allocations[0].weekEnd,
        weekStart: allocations[0].weekStart,
      });
    if (isAllocationsOutOfCurrentWeeksRange) {
      return completeRoleAllocationsGrid(
        start,
        currentWeeksSlideArray,
        'flex flex-1 py-2',
        id
      );
    }
    for (let allocation of allocations) {
      const isAllocationBetweenWeeks = confirmAllocationBetweenWeeks(
        currentWeeksSlideArray,
        { weekEnd: allocation.weekEnd, weekStart: allocation.weekStart }
      );
      if (!isAllocationBetweenWeeks) {
        continue;
      }
      if (start === currentWeeksSlideArray.length) {
        break;
      }
      for (let i = start; i < currentWeeksSlideArray.length; i++) {
        const isAllocationBetweenCurrentWeek = confirmAllocationBetweenWeek(
          currentWeeksSlideArray[i],
          allocation
        );
        if (isAllocationBetweenCurrentWeek) {
          start = i + 1;
          allocationsGrid.push(
            <RoleAllocation
              key={`${id}-${new Date(
                currentWeeksSlideArray[i].startWeekDate
              ).valueOf()}`}
              id={`${id}-${new Date(
                currentWeeksSlideArray[i].startWeekDate
              ).valueOf()}`}
              displayContent
              content={allocation.content}
              isCurrentWeek={currentWeeksSlideArray[i].isCurrentWeek}
              className='flex flex-1 py-2'
            />
          );
          break;
        } else {
          allocationsGrid.push(
            <RoleAllocation
              key={`${id}-${new Date(
                currentWeeksSlideArray[i].startWeekDate
              ).valueOf()}`}
              id={`${id}-${new Date(
                currentWeeksSlideArray[i].startWeekDate
              ).valueOf()}`}
              displayContent={false}
              isCurrentWeek={currentWeeksSlideArray[i].isCurrentWeek}
              className='flex flex-1 py-2'
            />
          );
        }
      }
    }
    if (start < currentWeeksSlideArray.length) {
      const gridRemain = completeRoleAllocationsGrid(
        start,
        currentWeeksSlideArray,
        'flex flex-1 py-2',
        id
      );
      return allocationsGrid.concat(gridRemain);
    }
    return allocationsGrid;
  };

  return (
    <div className='flex h-full'>
      <div className='w-6' />
      <div className='flex flex-1 flex-col h-full'>
        {roles.map(({ allocations = [], estimation }, index: number) => {
          const isUserParticipant =
            allocations && allocations.length > 0 && !estimation;
          return (
            <div
              key={`role-${index}`}
              className={`grid grid-cols-${numberOfWeeks} h-full`}
            >
              {isUserParticipant
                ? getRoleAllocationsGrid(allocations, `role-${index}`)
                : estimation &&
                  getRoleEstimationGrid(estimation, `role-${index}`)}
            </div>
          );
        })}
        {timeOffs.length > 0 && (
          <div
            key={`${userId}-time-offs`}
            className={`grid grid-cols-${numberOfWeeks} h-full`}
          >
            {getRoleAllocationsGrid(timeOffs, 'time-offs')}
          </div>
        )}
      </div>
      <div className='w-6' />
    </div>
  );
};

export const AssignmentsAllocations: React.FC<{
  assignments: Assignment[];
  numberOfWeeks: number;
  currentWeeksSlideArray: Week[];
}> = ({ assignments, numberOfWeeks, currentWeeksSlideArray }) => {
  const getAssigmentsAllocationGrid = (
    assigment: Assignment,
    index: number
  ) => {
    const allocationsGrid: ReactNode[] = [];
    const { startDate, endDate } = assigment;
    const gridsColumnsArray = generateGridColumnsArray(
      currentWeeksSlideArray,
      startDate,
      endDate
    );

    let labelDisplayed = false;
    for (let i = 0; i < gridsColumnsArray.length; i++) {
      const shouldDisplayContent = gridsColumnsArray[i];
      const isLastGridItem = i === gridsColumnsArray.length - 1;
      allocationsGrid.push(
        <RoleAllocation
          key={`assignment-${index}-${new Date(
            currentWeeksSlideArray[i].startWeekDate
          ).valueOf()}`}
          id={`assignment-${index}-${new Date(
            currentWeeksSlideArray[i].startWeekDate
          ).valueOf()}`}
          className='col-span-1 py-2'
          displayContent={shouldDisplayContent}
          isCurrentWeek={currentWeeksSlideArray[i].isCurrentWeek}
          content={
            <AssignmentAllocation
              bgColor={assigment.content.bgColor}
              borderColor={assigment.content.borderColor}
              textColor={assigment.content.textColor}
              name={!labelDisplayed ? assigment.content.name : ''}
              time={
                isLastGridItem && assigment.content.time
                  ? assigment.content.time
                  : ''
              }
              className='px-2'
            />
          }
        />
      );
      if (shouldDisplayContent && !labelDisplayed) {
        labelDisplayed = true;
      }
    }
    if (gridsColumnsArray.length < currentWeeksSlideArray.length) {
      const gridRemain = completeRoleAllocationsGrid(
        gridsColumnsArray.length,
        currentWeeksSlideArray,
        'col-span-1 py-2',
        `assignment-${index}`
      );
      return allocationsGrid.concat(gridRemain);
    }

    return allocationsGrid;
  };
  return (
    <div className='h-full flex flex-1'>
      <div className='w-6' />
      <div className='h-full flex flex-1 flex-col'>
        {assignments.map((assignment: Assignment, index: number) => {
          return (
            <div
              key={`assignment-${index}`}
              className={`grid grid-cols-${numberOfWeeks} h-full relative`}
            >
              {getAssigmentsAllocationGrid(assignment, index)}
            </div>
          );
        })}
      </div>
      <div className='w-6'></div>
    </div>
  );
};
