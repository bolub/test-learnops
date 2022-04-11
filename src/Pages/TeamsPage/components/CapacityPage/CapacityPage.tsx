import { useEffect, useMemo, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { tailwindOverride } from '@getsynapse/design-system';
import { getCapacity, selectCapacity } from 'state/Capacity/capacitySlice';
import { formatResourceAllocationSections } from './helpers';
import { ResourceAllocationSectionsType } from 'utils/customTypes';
import SectionToggle from 'Organisms/CapacityAllocationTable/components/SectionToggle';
import { getWeeksArray, Week } from 'Organisms/CapacityAllocationTable/helpers';
import TeamCapacityHeader from './components/TeamCapacityHeader';
import TeamMemberRow from './components/TeamMemberRow';

const CapacityPage = () => {
  const dispatch = useDispatch();
  const numberOfWeeks = 7;
  const capacity = useSelector(selectCapacity);
  const formattedSections = useMemo(
    () => formatResourceAllocationSections(capacity),
    [capacity]
  );

  const [currentWeeksSlide, setCurrentWeeksSlide] = useState(1);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const generateCompleteWeekSets = (allWeeks: Week[]) => {
    let firstRemaining, secondRemaining;
    const currentWeekIndex = allWeeks.findIndex((week) => week.isCurrentWeek);
    const firstPart = allWeeks.slice(0, currentWeekIndex);
    const secondPart = allWeeks.slice(
      currentWeekIndex - 1,
      allWeeks.length - 1
    );

    firstRemaining =
      Math.ceil(firstPart.length / numberOfWeeks) * numberOfWeeks;
    firstRemaining = firstRemaining - (firstRemaining % numberOfWeeks);

    secondRemaining =
      Math.ceil(secondPart.length / numberOfWeeks) * numberOfWeeks;
    secondRemaining = secondRemaining - (secondRemaining % numberOfWeeks);

    const firstPartFiller = new Array(firstRemaining - firstPart.length).fill(
      null
    );
    const secondPartFiller = new Array(
      secondRemaining - secondPart.length
    ).fill(null);
    return [firstPartFiller, secondPartFiller];
  };

  const weeksArray = useMemo(() => {
    if (!isEmpty(formattedSections)) {
      const start = get(
        formattedSections,
        '[0].users[0].allocations[0].weekStart'
      );
      const end = get(
        formattedSections,
        `[0].users[0].allocations[${
          get(formattedSections, '[0].users[0].allocations.length', 1) - 1
        }].weekEnd`
      );

      const allWeeks = getWeeksArray(start, end, numberOfWeeks);

      const weekFillers = generateCompleteWeekSets(allWeeks);

      return [...weekFillers[0], ...allWeeks, ...weekFillers[1]];
    } else {
      return [];
    }
  }, [formattedSections]);

  const weeksSlidesNumber = Math.ceil(weeksArray.length / numberOfWeeks);

  const currentWeeksSlideArray = useMemo(() => {
    const startIndex = (currentWeeksSlide - 1) * numberOfWeeks;
    const endIndex = startIndex + numberOfWeeks;
    return weeksArray.slice(startIndex, endIndex);
  }, [numberOfWeeks, currentWeeksSlide, weeksArray]);

  const handleToggleSection = (sectionId: string) => {
    let updatedSections = [];
    const sectionIndex = openSections.findIndex((value) => value === sectionId);
    if (sectionIndex !== -1) {
      updatedSections = [
        ...openSections.slice(0, sectionIndex),
        ...openSections.slice(sectionIndex + 1),
      ];
    } else {
      updatedSections = openSections.concat(sectionId);
    }
    setOpenSections(updatedSections);
  };

  useEffect(() => {
    dispatch(getCapacity());
  }, [dispatch]);

  useEffect(() => {
    const currentWeekIndex = weeksArray.findIndex((week) =>
      get(week, 'isCurrentWeek', false)
    );
    if (currentWeekIndex !== -1) {
      setCurrentWeeksSlide(currentWeekIndex / numberOfWeeks + 1);
    }
  }, [weeksArray]);

  return (
    <table
      className='w-full h-full table-fixed shadow-allocation-table'
      cellPadding={0}
      cellSpacing={0}
    >
      <TeamCapacityHeader
        currentWeeksSlideArray={currentWeeksSlideArray}
        weeksSlidesNumber={weeksSlidesNumber}
        setCurrentWeeksSlide={setCurrentWeeksSlide}
        currentWeeksSlide={currentWeeksSlide}
      />

      <tbody>
        {formattedSections.map((section: ResourceAllocationSectionsType) => {
          const isSectionOpen = openSections.includes(section.id);
          return (
            <Fragment key={section.id}>
              <tr className='h-10 shadow-header border-b border-neutral-lighter'>
                <td colSpan={2} className='h-full'>
                  <SectionToggle
                    label={section.label}
                    onToggleSection={() => handleToggleSection(section.id)}
                    numberOfWeeks={numberOfWeeks}
                    currentWeeksSlideArray={currentWeeksSlideArray}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div
                    className={tailwindOverride(
                      'overflow-hidden',
                      'transition-height duration-300 easy',
                      { 'h-auto': isSectionOpen, 'h-0': !isSectionOpen }
                    )}
                  >
                    {section.users.map((userData, index: number) => (
                      <TeamMemberRow
                        key={userData.id}
                        userData={userData}
                        index={index}
                        numberOfWeeks={numberOfWeeks}
                        currentWeeksSlideArray={currentWeeksSlideArray}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default CapacityPage;
