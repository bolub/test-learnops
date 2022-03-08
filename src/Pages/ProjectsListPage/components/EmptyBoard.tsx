import React from 'react';
import { useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Typography, Button } from '@getsynapse/design-system';
import { PATHS } from 'utils/constants';
import emptyBoard from 'assets/images/empty-board.svg';
import noSearchResults from 'assets/images/no-search-results.svg';
import noFilterResults from 'assets/images/no-filter-results.svg';

const EmptyBoard: React.FC<{
  isSearchEmpty: boolean;
  isFiltersEmpty: boolean;
}> = ({ isSearchEmpty, isFiltersEmpty }) => {
  const history = useHistory();
  let imageSrc = emptyBoard;
  let message = intl.get('PROJECTS_LIST_PAGE.TABLE.EMPTY');
  if (!isSearchEmpty) {
    imageSrc = noSearchResults;
    message = intl.get('PROJECTS_LIST_PAGE.BOARD.NO_RESULTS_FOUND');
  }
  if (!isFiltersEmpty) {
    imageSrc = noFilterResults;
    message = intl.get('PROJECTS_LIST_PAGE.BOARD.NO_RESULTS_FOUND');
  }
  return (
    <div
      data-cy='empty-board'
      className='absolute flex flex-col items-center min-w-50 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    >
      <img src={imageSrc} alt='No projects found' />
      <Typography variant='body' className='mt-4 text-neutral-black'>
        {message}
      </Typography>
      {isSearchEmpty && isFiltersEmpty && (
        <Button
          className='mt-2 mx-auto'
          size='small'
          onClick={() => history.push(PATHS.NEW_PROJECT_PAGE)}
          data-cy='get-started-button'
        >
          {intl.get('PROJECTS_LIST_PAGE.TABLE.GET_STARTED')}
        </Button>
      )}
    </div>
  );
};

export default EmptyBoard;
