import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useElevation } from '@getsynapse/design-system';
import { Column, Section, getWeeksArray, AllocatedUser } from './helpers';
import {
  TableHeaders as UsersTableHeaders,
  AllocatedUserDetails,
  AllocatedUserAssignments,
} from './components/AllocatedUsersTable';
import {
  TableHeaders as WeeksTableHeaders,
  RoleAllocations,
  AssignmentsAllocations,
} from './components/AllocatedWeeksTable';
import EmptySection from './components/EmptySection';
import SectionToggle from './components/SectionToggle';

const CapacityAllocationTable: React.FC<{
  headers: Column[];
  sections: Section[];
  startDate: Date | string;
  endDate: Date | string;
  numberOfWeeks?: number;
}> = ({ headers, startDate, endDate, numberOfWeeks = 6, sections }) => {
  const tableElevation = useElevation(1);
  const weeksArray = useMemo(
    () => getWeeksArray(startDate, endDate, numberOfWeeks),
    [startDate, endDate, numberOfWeeks]
  );
  const weeksSlidesNumber = Math.ceil(weeksArray.length / numberOfWeeks);
  const [currentWeeksSlide, setCurrentWeeksSlide] = useState(1);
  const [openSections, setOpenSections] = useState<string[]>([sections[0].id!]);
  const [openUserAssignmentsList, setOpenUserAssignmentsList] = useState<
    string[]
  >([]);
  const currentWeeksSlideArray = useMemo(() => {
    const startIndex = (currentWeeksSlide - 1) * numberOfWeeks;
    const endIndex = startIndex + numberOfWeeks;
    return weeksArray.slice(startIndex, endIndex);
  }, [numberOfWeeks, currentWeeksSlide, weeksArray]);

  const handleToggleSection = (section: string) => {
    let updatedSections = [];
    const sectionIndex = openSections.findIndex((value) => value === section);
    if (sectionIndex > -1) {
      updatedSections = [
        ...openSections.slice(0, sectionIndex),
        ...openSections.slice(sectionIndex + 1),
      ];
    } else {
      updatedSections = openSections.concat(section);
    }
    setOpenSections(updatedSections);
  };

  const handleToggleUserAssignmentsList = (userId: string) => {
    let updatedUserAssigmentsList = [];
    const userAssigmentListIndex = openUserAssignmentsList.findIndex(
      (value) => value === userId
    );
    if (userAssigmentListIndex > -1) {
      updatedUserAssigmentsList = [
        ...openUserAssignmentsList.slice(0, userAssigmentListIndex),
        ...openUserAssignmentsList.slice(userAssigmentListIndex + 1),
      ];
    } else {
      updatedUserAssigmentsList = openUserAssignmentsList.concat(userId);
    }
    setOpenUserAssignmentsList(updatedUserAssigmentsList);
  };

  return (
    <div className={classnames('w-full h-auto', tableElevation)}>
      <table
        className='w-full h-full table-fixed shadow-allocation-table'
        cellPadding={0}
        cellSpacing={0}
      >
        <thead className='h-10 bg-primary-lightest font-semibold text-primary-dark border-b border-neutral-lighter'>
          <tr>
            <th className='w-2/5 shadow-allocation-table-inner'>
              <UsersTableHeaders headers={headers} />
            </th>
            <th className='w-3/5'>
              <WeeksTableHeaders
                currentWeeksSlideArray={currentWeeksSlideArray}
                weeksSlidesNumber={weeksSlidesNumber}
                onChangeWeeksSlide={setCurrentWeeksSlide}
                currentWeeksSlide={currentWeeksSlide}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section: Section) => {
            const isSectionOpen = openSections.includes(section.id);
            const isSectionEmpty = section.users.length === 0;
            return (
              <React.Fragment key={section.id}>
                <tr className='h-10 shadow-header border-b border-neutral-lighter'>
                  <td colSpan={2}>
                    <SectionToggle
                      label={section.label}
                      onToggleSection={() => handleToggleSection(section.id)}
                      numberOfWeeks={numberOfWeeks}
                      currentWeeksSlideArray={currentWeeksSlideArray}
                      isSectionOpen={isSectionOpen}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div
                      className={classnames(
                        'overflow-hidden',
                        'transition-height duration-300 easy',
                        { 'h-auto': isSectionOpen, 'h-0': !isSectionOpen }
                      )}
                    >
                      {!isSectionEmpty ? (
                        section.users.map(
                          (user: AllocatedUser, index: number) => {
                            const isOdd = index % 2;
                            const isUserAssigmentListOpen =
                              openUserAssignmentsList.includes(user.id);
                            return (
                              <React.Fragment key={user.id}>
                                <div
                                  className={classnames(
                                    'flex flex-1 h-full border-b border-neutral-lighter',
                                    {
                                      'bg-neutral-white': isOdd,
                                    }
                                  )}
                                >
                                  <div className='w-2/5'>
                                    <AllocatedUserDetails
                                      user={user}
                                      onToggleSection={
                                        handleToggleUserAssignmentsList
                                      }
                                      isSectionOpen={isUserAssigmentListOpen}
                                    />
                                  </div>
                                  <div className='w-3/5'>
                                    <RoleAllocations
                                      userId={user.id}
                                      roles={user.roles}
                                      currentWeeksSlideArray={
                                        currentWeeksSlideArray
                                      }
                                      numberOfWeeks={numberOfWeeks}
                                      timeOffs={user.timeOffs}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`h-${
                                    isUserAssigmentListOpen ? 'auto' : '0'
                                  } overflow-hidden transition-height duration-300 easy`}
                                >
                                  <div
                                    className={classnames(
                                      'flex flex-1 h-full border-b border-neutral-lighter',
                                      {
                                        'bg-neutral-white': isOdd,
                                      }
                                    )}
                                  >
                                    <div className='w-2/5'>
                                      <AllocatedUserAssignments
                                        assignments={user.assignments}
                                      />
                                    </div>
                                    <div className='w-3/5'>
                                      <AssignmentsAllocations
                                        assignments={user.assignments}
                                        currentWeeksSlideArray={
                                          currentWeeksSlideArray
                                        }
                                        numberOfWeeks={numberOfWeeks}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          }
                        )
                      ) : (
                        <EmptySection
                          label={section.emptyMessage}
                          currentWeeksSlideArray={currentWeeksSlideArray}
                          numberOfWeeks={numberOfWeeks}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CapacityAllocationTable;
