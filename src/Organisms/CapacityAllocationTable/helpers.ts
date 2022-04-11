import { ReactNode, MouseEvent } from 'react';
import moment, { Moment } from 'moment';
import { ParticipanttAllocation } from 'utils/customTypes';

export interface Column {
  id?: string;
  className?: string;
  content?: ReactNode | string;
}

export interface Allocation {
  weekStart: Date | string;
  weekEnd: Date | string;
  content: ReactNode;
}

export interface Estimation {
  startDate: Date | string;
  endDate: Date | string;
  content: {
    bgColor: string;
    textColor: string;
    onClickCallback: (id: string) => void;
    label: string;
    userId: string;
  };
}

export interface Assignment {
  columns: Column[];
  startDate: Date | string;
  endDate: Date | string;
  content: {
    bgColor: string;
    borderColor: string;
    textColor: string;
    name: string;
    time?: string;
  };
}

export interface AllocatedUserColumn {
  className?: string;
  children: (params?: {
    toggleSection?: (event: MouseEvent<HTMLElement>) => void;
    isOpen?: boolean;
  }) => ReactNode | string;
}

export interface AllocatedUserRole {
  allocations?: Allocation[];
  estimation?: Estimation;
}

export interface AllocatedUser {
  id: string;
  columns: AllocatedUserColumn[];
  roles: AllocatedUserRole[];
  assignments: Assignment[];
  timeOffs?: Allocation[];
}

export interface Section {
  id: string;
  label: string;
  users: AllocatedUser[];
  emptyMessage: string;
}
export interface Week {
  label: string;
  startWeekDate: Date;
  endWeekDate: Date;
  isCurrentWeek: boolean;
}

const getWeek: (date: Moment) => Week = (date) => {
  const currentWeekStart = moment().startOf('isoWeek');
  const currentWeekEnd = moment().endOf('isoWeek');

  const monday = date.clone().startOf('isoWeek');
  const friday = monday.clone().weekday(5);
  const sunday = date.clone().endOf('isoWeek');
  const weekRange = `${monday.format('MMM D')} - ${friday.format('MMM D')}`;
  return {
    label: weekRange,
    startWeekDate: monday.toDate(),
    endWeekDate: sunday.toDate(),
    isCurrentWeek:
      currentWeekStart.isSame(monday) && currentWeekEnd.isSame(sunday),
  };
};

export const getWeeksArray: (
  startDate: string | Date,
  endDate: string | Date,
  numberOfWeeks: number
) => Week[] = (startDate, endDate, numberOfWeeks) => {
  const weeksArray = [];
  const start = moment(new Date(startDate));
  const end = moment(new Date(endDate));

  let pivotWeek = start;
  while (moment(pivotWeek).isBefore(end)) {
    const week = getWeek(pivotWeek);
    weeksArray.push(week);
    pivotWeek = pivotWeek.add(7, 'days');
  }
  if (weeksArray.length % numberOfWeeks !== 0) {
    while (weeksArray.length % numberOfWeeks !== 0) {
      const week = getWeek(pivotWeek);
      weeksArray.push(week);
      pivotWeek = pivotWeek.add(7, 'days');
    }
  }
  return weeksArray;
};

export const confirmAllocationBetweenWeek = (
  week: Week,
  allocation: Omit<Allocation, 'content'>
) => {
  const { startWeekDate, endWeekDate } = week;
  const { weekEnd, weekStart } = allocation;
  return (
    moment(weekStart).isSameOrAfter(startWeekDate) &&
    moment(weekEnd).isSameOrBefore(endWeekDate)
  );
};

export const confirmAllocationBetweenWeeks = (
  weeks: Week[],
  allocation: Omit<Allocation, 'content'>
) => {
  const { weekStart, weekEnd } = allocation;
  const firstWeek = weeks[0];
  const lastWeek = weeks[weeks.length - 1];
  return (
    moment(weekStart).isSameOrAfter(firstWeek.startWeekDate) &&
    moment(weekEnd).isSameOrBefore(lastWeek.endWeekDate)
  );
};

export const confirmAllocationOutOfWeeksRange = (
  weeks: Week[],
  allocation: Omit<Allocation, 'content'>
) => {
  const { weekStart } = allocation;
  const lastWeek = weeks[weeks.length - 1];
  return moment(weekStart).isAfter(lastWeek.endWeekDate);
};

export const generateGridColumnsArray = (
  currentWeeksSlideArray: Week[],
  startDate: Date | string,
  endDate: Date | string
) => {
  const estimationStartWeek = moment(startDate).startOf('isoWeek');
  const estimationEndWeek = moment(endDate).endOf('isoWeek');
  let gridColumnsArray: boolean[] = Array.from(
    Array.of(currentWeeksSlideArray.length),
    () => false
  );
  const isEstimationOutOfWeeksArray = confirmAllocationOutOfWeeksRange(
    currentWeeksSlideArray,
    {
      weekStart: estimationStartWeek.clone().toDate(),
      weekEnd: estimationEndWeek.clone().toDate(),
    }
  );
  if (isEstimationOutOfWeeksArray) {
    return gridColumnsArray;
  } else {
    for (let i = 0; i < currentWeeksSlideArray.length; i++) {
      const week = currentWeeksSlideArray[i];
      if (moment(estimationStartWeek).isAfter(week.endWeekDate)) {
        gridColumnsArray[i] = false;
        continue;
      }
      const isEstimationBetweenWeek = confirmAllocationBetweenWeek(week, {
        weekStart: estimationStartWeek.clone().toDate(),
        weekEnd: estimationEndWeek.clone().toDate(),
      });
      if (isEstimationBetweenWeek) {
        gridColumnsArray[i] = true;
        break;
      }

      if (moment(estimationEndWeek).isSameOrAfter(week.endWeekDate)) {
        gridColumnsArray[i] = true;
        let pivot = i + 1;
        while (
          pivot < currentWeeksSlideArray.length &&
          moment(estimationEndWeek).isSameOrAfter(
            currentWeeksSlideArray[pivot].endWeekDate
          )
        ) {
          gridColumnsArray[pivot] = true;
          pivot += 1;
        }
        i = pivot;
        break;
      }
    }
  }
  return gridColumnsArray;
};

export const recalculateTotalAllocatedHours = (
  startDate: Date | string,
  endDate: Date | string,
  allocationsArray: ParticipanttAllocation[]
) => {
  const firstAllocation = allocationsArray[0];
  const lastAllocation = allocationsArray[allocationsArray.length - 1];
  const startWeek = moment(startDate).startOf('isoWeek');
  const endWeek = moment(endDate).endOf('isoWeek');

  if (moment(startWeek).isAfter(lastAllocation.weekEnd)) {
    return 0;
  }

  if (moment(endWeek).isBefore(firstAllocation.weekStart)) {
    return 0;
  }

  let totalAllocations = 0;
  for (let allocation of allocationsArray) {
    if (moment(startWeek).isAfter(allocation.weekEnd)) {
      continue;
    }

    if (moment(allocation.weekEnd).isAfter(endWeek)) {
      break;
    }

    totalAllocations += allocation.allocatedHours;
  }

  return totalAllocations;
};
