import {
  tailwindOverride,
  Tooltip,
  Typography,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { RoleAllocation } from 'Organisms/CapacityAllocationTable/components/AllocatedWeeksTable';
import { Week } from 'Organisms/CapacityAllocationTable/helpers';
import { TeamMemberAllocation } from 'utils/customTypes';

type TeamTimeOffAllocationsProps = {
  numberOfWeeks: number;
  currentWeeksSlideArray: (Week | null)[];
  timeOffs: Array<Partial<TeamMemberAllocation> | null>;
};

const TeamTimeOffAllocations = ({
  timeOffs,
  numberOfWeeks,
  currentWeeksSlideArray,
}: TeamTimeOffAllocationsProps) => {
  return (
    <div className={`mx-6 grid grid-cols-${numberOfWeeks}`}>
      {timeOffs.map((timeOff: any, i: number) => {
        return timeOff !== null ? (
          <RoleAllocation
            key={`${timeOff.startDate}-${i}`}
            id={`${timeOff.startDate}-${i}`}
            displayContent
            content={
              <Tooltip
                trigger={
                  <div
                    className={tailwindOverride(
                      'w-full h-full bg-warning-lighter',
                      'flex items-center justify-center'
                    )}
                  >
                    <Typography variant='caption' className='text-warning-dark'>
                      {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.HOURS', {
                        hours: timeOff.capacity,
                      })}
                    </Typography>
                  </div>
                }
                openMode='hover1'
                className='w-full h-6'
                position='topCenter'
                contentProps={{ className: 'flex p-2 space-x-2' }}
              >
                <Typography variant='caption' className='text-neutral-white'>
                  {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.TIME_OFF_WEEK')}
                </Typography>

                <Typography variant='caption' className='text-neutral-white'>
                  {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.HOURS', {
                    hours: timeOff.capacity,
                  })}
                </Typography>
              </Tooltip>
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

export default TeamTimeOffAllocations;
