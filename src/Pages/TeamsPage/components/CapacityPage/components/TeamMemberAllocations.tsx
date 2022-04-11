import { Typography, tailwindOverride } from '@getsynapse/design-system';
import get from 'lodash/get';
import { RoleAllocation } from 'Organisms/CapacityAllocationTable/components/AllocatedWeeksTable';
import { Week } from 'Organisms/CapacityAllocationTable/helpers';
import { TeamMemberAllocation } from 'utils/customTypes';

type TeamMemberAllocationsProps = {
  numberOfWeeks: number;
  currentWeeksSlideArray: (Week | null)[];
  currentAllocations: Array<TeamMemberAllocation | null>;
  userId: string;
};

const TeamMemberAllocations = ({
  numberOfWeeks,
  currentWeeksSlideArray,
  userId,
  currentAllocations,
}: TeamMemberAllocationsProps) => {
  return (
    <div className={`mx-6 grid grid-cols-${numberOfWeeks}`}>
      {currentAllocations.map((allocation, i: number) => {
        return allocation !== null ? (
          <RoleAllocation
            key={`${userId}-${i}`}
            id={`${userId}-${i}`}
            displayContent
            content={
              <Allocation
                capacity={allocation.capacity}
                defaultCapacity={allocation.defaultCapacity}
              />
            }
            isCurrentWeek={get(
              currentWeeksSlideArray,
              `[${i}].isCurrentWeek`,
              false
            )}
            className='flex flex-1 py-2 z-10'
          />
        ) : (
          <div key={i} />
        );
      })}
    </div>
  );
};

export default TeamMemberAllocations;

const Allocation = ({
  capacity,
  defaultCapacity,
}: {
  capacity: number;
  defaultCapacity: number;
}) => {
  const allocation = defaultCapacity - capacity;
  const isOverAllocated = capacity <= 0;
  return (
    <div
      className={tailwindOverride(
        'w-full h-6 flex justify-center items-center',
        {
          'bg-success-light': !isOverAllocated,
          'bg-error-lighter': isOverAllocated,
        }
      )}
    >
      <Typography
        variant='body'
        className={tailwindOverride('font-semibold mr-1.5', {
          'text-success-dark': !isOverAllocated,
          'text-error-dark': isOverAllocated,
        })}
      >
        {`${Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
          (allocation * 100) / defaultCapacity
        )}%`}
      </Typography>
      <Typography
        variant='body2'
        className={tailwindOverride({
          'text-success-dark': !isOverAllocated,
          'text-error-dark': isOverAllocated,
        })}
      >
        {`(${allocation}/${defaultCapacity})`}
      </Typography>
    </div>
  );
};
