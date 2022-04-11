import { Dispatch, SetStateAction } from 'react';
import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import { TableHeaders as WeeksTableHeaders } from 'Organisms/CapacityAllocationTable/components/AllocatedWeeksTable';
import { Week } from 'Organisms/CapacityAllocationTable/helpers';

type TeamCapacityHeaderProps = {
  currentWeeksSlideArray: (Week | null)[];
  weeksSlidesNumber: number;
  setCurrentWeeksSlide: Dispatch<SetStateAction<number>>;
  currentWeeksSlide: number;
};

const TeamCapacityHeader = ({
  currentWeeksSlideArray,
  weeksSlidesNumber,
  setCurrentWeeksSlide,
  currentWeeksSlide,
}: TeamCapacityHeaderProps) => (
  <thead className='h-10 bg-primary-lightest font-semibold border-b border-neutral-lighter'>
    <tr>
      <th className='w-2/5 shadow-allocation-table-inner text-left'>
        <Typography
          variant='caption'
          weight='medium'
          className='text-primary-dark pl-4'
        >
          {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.TEAMS_&_MEMBERS')}
        </Typography>
      </th>
      <th className='w-3/5 text-primary-dark'>
        <WeeksTableHeaders
          currentWeeksSlideArray={currentWeeksSlideArray}
          weeksSlidesNumber={weeksSlidesNumber}
          onChangeWeeksSlide={setCurrentWeeksSlide}
          currentWeeksSlide={currentWeeksSlide}
        />
      </th>
    </tr>
  </thead>
);

export default TeamCapacityHeader;
