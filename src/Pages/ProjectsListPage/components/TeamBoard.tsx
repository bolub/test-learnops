import React from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {
  teamBoard,
  teamBoardSearchParam,
  teamBoardFilters,
  teamBoardProcess,
} from 'state/Projects/projectsSlice';
import { PROJECTS_BOARD_TABS } from 'utils/constants';
import BoardHeader from './BoardHeader';
import EmptyBoard from './EmptyBoard';
import StagesList from './StagesList';

const TeamBoard = () => {
  const teamBoardStagesList = useSelector(teamBoard);
  const teamBoardSearch = useSelector(teamBoardSearchParam);
  const emptyTeamBoardFilters = isEmpty(useSelector(teamBoardFilters));
  const selectedProcessId = useSelector(teamBoardProcess);

  return (
    <div data-cy='team-board'>
      <BoardHeader
        boardTab={PROJECTS_BOARD_TABS.TEAM_BOARD}
        selectedProcessId={selectedProcessId}
        searchParam={teamBoardSearch}
      />
      <StagesList
        stages={teamBoardStagesList}
        emptyComponent={
          <EmptyBoard
            isSearchEmpty={isEmpty(teamBoardSearch)}
            isFiltersEmpty={emptyTeamBoardFilters}
          />
        }
      />
    </div>
  );
};

export default TeamBoard;
