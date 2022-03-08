import React from 'react';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { SortingType } from 'utils/customTypes';
import { IconButton } from '@getsynapse/design-system';
import upArrow from 'assets/icons/up-arrow.svg';
import downArrow from 'assets/icons/down-arrow.svg';

const SortingArrows: React.FC<{
  name: string;
  handleSort: (orderByParam: string, order: SortingType) => void;
  orderBy: string;
  order: SortingType;
}> = ({ name, handleSort, orderBy, order }) => {
  const isSorting = name && name === orderBy;
  const sortingAsc = isSorting && order === 'asc';
  const sortingDesc = isSorting && order === 'desc';
  return (
    <div className={classnames('flex', 'flex-col')}>
      <IconButton
        description={intl.get('PROJECTS_LIST_PAGE.TABLE.SORT.ASC')}
        iconClassname={classnames('w-1.5 h-1', {
          'text-primary-dark': sortingAsc,
        })}
        onClick={() => handleSort(name, 'asc')}
        hasASize={false}
        src={upArrow}
        className='mb-0.75'
      />
      <IconButton
        description={intl.get('PROJECTS_LIST_PAGE.TABLE.SORT.DESC')}
        iconClassname={classnames('w-1.5 h-1', {
          'text-primary-dark': sortingDesc,
        })}
        onClick={() => handleSort(name, 'desc')}
        hasASize={false}
        src={downArrow}
      />
    </div>
  );
};

export default SortingArrows;
