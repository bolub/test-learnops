import React from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { PROJECTS_BOARD_TABS } from 'utils/constants';
import {
  myBoard,
  myBoardSearchParam,
  myBoardFilters,
  myBoardProcess,
} from 'state/Projects/projectsSlice';
import BoardHeader from './BoardHeader';
import EmptyBoard from './EmptyBoard';
import StagesList from './StagesList';

const MyBoard = () => {
  const myBoardStagesList = useSelector(myBoard);
  const myBoardSearch = useSelector(myBoardSearchParam);
  const emptyMyBoardFilters = isEmpty(useSelector(myBoardFilters));
  const selectedProcessId = useSelector(myBoardProcess);

  return (
    <div data-cy='my-board'>
      <BoardHeader
        boardTab={PROJECTS_BOARD_TABS.MY_BOARD}
        selectedProcessId={selectedProcessId}
        searchParam={myBoardSearch}
      />
      <StagesList
        stages={myBoardStagesList}
        emptyComponent={
          <EmptyBoard
            isSearchEmpty={isEmpty(myBoardSearch)}
            isFiltersEmpty={emptyMyBoardFilters}
          />
        }
      />
    </div>
  );
};

export default MyBoard;
