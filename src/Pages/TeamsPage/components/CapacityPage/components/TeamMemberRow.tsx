import { useState, useMemo } from 'react';
import { tailwindOverride } from '@getsynapse/design-system';
import moment from 'moment';
import get from 'lodash/get';
import findLastIndex from 'lodash/findLastIndex';
import {
  SectionUserType,
  TeamMemberProject as TeamMemberProjectType,
} from 'utils/customTypes';
import TeamMemberCell from './TeamMemberCell';
import TeamMemberAllocations from './TeamMemberAllocations';
import TeamMemberProject from './TeamMemberProject';
import TeamProjectAllocation from './TeamProjectAllocation';
import TeamTimeOffAllocations from './TeamTimeOffAllocations';
import { RoleAllocation } from 'Organisms/CapacityAllocationTable/components/AllocatedWeeksTable';
import { Week } from 'Organisms/CapacityAllocationTable/helpers';

type TeamMemberRowProps = {
  userData: SectionUserType;
  index: number;
  numberOfWeeks: number;
  currentWeeksSlideArray: (Week | null)[];
};

const TeamMemberRow = ({
  userData,
  index,
  numberOfWeeks,
  currentWeeksSlideArray,
}: TeamMemberRowProps) => {
  const isOdd = index % 2;
  const [showProjects, setShowProjects] = useState(false);

  const currentAllocations = useMemo(() => {
    return currentWeeksSlideArray.map((week) => {
      if (week !== null) {
        const allocationId = userData.allocations.findIndex((item) => {
          return moment(week.startWeekDate).isBetween(
            item.weekStart,
            item.weekEnd,
            undefined,
            '[]'
          );
        });
        if (allocationId !== -1) {
          const capacity = userData.allocations[allocationId].capacity;
          const defaultCapacity =
            userData.allocations[allocationId].defaultCapacity;
          return defaultCapacity - capacity !== 0
            ? userData.allocations[allocationId]
            : null;
        } else {
          return null;
        }
      } else return null;
    });
  }, [userData.allocations, currentWeeksSlideArray]);

  const getProjectAllocations = (project: TeamMemberProjectType) => {
    const projectStartDate = moment(
      new Date(project.roles.startDate),
      'M/D/YYYY'
    );
    const projectEndDate = moment(new Date(project.roles.endDate), 'M/D/YYYY');

    return currentAllocations.map((week) => {
      if (week !== null) {
        const weekStart = moment(
          week.weekStart.toLocaleDateString(),
          'M/D/YYYY'
        );
        const weekEnd = moment(week.weekEnd.toLocaleDateString(), 'M/D/YYYY');
        if (
          projectStartDate.isSameOrAfter(weekStart) ||
          weekEnd.isSameOrBefore(projectEndDate) ||
          moment(projectEndDate).isBetween(weekStart, weekEnd)
        ) {
          return week;
        } else return null;
      } else return null;
    });
  };

  const timeOffAllocation = useMemo(() => {
    return currentAllocations.map((week) => {
      if (week !== null) {
        const allocationId = userData.timeOffs.findIndex((item) => {
          return moment(week.weekStart).isSame(item.weekStart);
        });
        if (allocationId !== -1) {
          return userData.timeOffs[allocationId];
        } else {
          return null;
        }
      } else return null;
    });
  }, [currentAllocations, userData.timeOffs]);

  return (
    <div
      className={tailwindOverride(
        'flex flex-row h-full border-b border-neutral-lighter w-full',
        {
          'bg-neutral-white': isOdd,
        }
      )}
    >
      <span className='w-4-percent' />
      <div className='flex flex-col w-full'>
        <div className='flex w-full'>
          <div className='w-37-percent shadow-allocation-table-inner'>
            <TeamMemberCell
              user={userData.user}
              projects={userData.projects}
              setShowProjects={setShowProjects}
              showProjects={showProjects}
            />
          </div>
          <div className='relative w-62-percent border-b border-neutral-lighter'>
            <div
              className={`absolute top-0 mx-6 grid grid-cols-${numberOfWeeks} h-full w-93-percent`}
            >
              {currentAllocations.map((_, i: number) => {
                return (
                  <div
                    key={i}
                    className={tailwindOverride('z-0', {
                      'bg-primary-lightest': get(
                        currentWeeksSlideArray,
                        `[${i}].isCurrentWeek`,
                        false
                      ),
                    })}
                  />
                );
              })}
            </div>
            <TeamMemberAllocations
              numberOfWeeks={numberOfWeeks}
              currentWeeksSlideArray={currentWeeksSlideArray}
              currentAllocations={currentAllocations}
              userId={userData.id}
            />
            <TeamTimeOffAllocations
              numberOfWeeks={numberOfWeeks}
              currentWeeksSlideArray={currentWeeksSlideArray}
              timeOffs={timeOffAllocation}
            />
          </div>
        </div>

        {showProjects &&
          userData.projects.map((project) => {
            const projectAllocations = getProjectAllocations(project);
            const first = projectAllocations.findIndex(
              (allocation) => allocation !== null
            );
            const last = findLastIndex(
              projectAllocations,
              (allocation) => allocation !== null
            );
            return (
              <div className='flex flex-row' key={project.id}>
                <TeamMemberProject project={project} />
                <div
                  className={tailwindOverride(
                    'w-62-percent px-6 grid',
                    `grid-cols-${numberOfWeeks}`,
                    'h-full border-b border-neutral-lighter'
                  )}
                >
                  {projectAllocations.map((allocation, i: number) =>
                    allocation !== null ? (
                      <RoleAllocation
                        key={`${userData.id}-${i}-${project.roles.role}`}
                        id={`${userData.id}-${i}-${project.roles.role}`}
                        displayContent
                        content={
                          <TeamProjectAllocation
                            isFirst={i === first}
                            isLast={i === last}
                            status={project.status}
                            hours={project.hours}
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
                      <div
                        key={`${userData.id}-${i}-${project.roles.role}`}
                        className={tailwindOverride({
                          'bg-primary-lightest': get(
                            currentWeeksSlideArray,
                            `[${i}].isCurrentWeek`,
                            false
                          ),
                        })}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TeamMemberRow;
