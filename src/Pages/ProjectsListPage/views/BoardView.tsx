import { useEffect, useMemo } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from '@getsynapse/design-system';
import {
  setBoardProcess,
  setBoardFilters,
  projectsBoard,
  setProjectsBoard,
  teamBoardProcess,
  myBoardProcess,
} from 'state/Projects/projectsSlice';
import {
  getOrganizationProcesses,
  selectProjectProcesses,
} from 'state/Processes/processesSlice';
import { selectIsUserLd } from 'state/User/userSlice';
import { PROJECTS_BOARD_TABS } from 'utils/constants';
import TeamBoard from '../components/TeamBoard';
import MyBoard from '../components/MyBoard';

const BoardView = () => {
  const tabs = useMemo(
    () => [PROJECTS_BOARD_TABS.TEAM_BOARD, PROJECTS_BOARD_TABS.MY_BOARD],
    []
  );
  const dispatch = useDispatch();
  const organizationProjectProcesses = useSelector(selectProjectProcesses);
  const isLDUser = useSelector(selectIsUserLd);
  const selectedProjectsBoard = useSelector(projectsBoard);
  const defaultProcess =
    organizationProjectProcesses[organizationProjectProcesses.length - 1];
  const selectedTeamBoardProcess = useSelector(teamBoardProcess);
  const selectedMyBoardProcess = useSelector(myBoardProcess);

  useEffect(() => {
    if (defaultProcess && defaultProcess.id) {
      dispatch(
        setBoardProcess(
          selectedTeamBoardProcess || defaultProcess.id,
          PROJECTS_BOARD_TABS.TEAM_BOARD
        )
      );
      dispatch(
        setBoardProcess(
          selectedMyBoardProcess || defaultProcess.id,
          PROJECTS_BOARD_TABS.MY_BOARD
        )
      );
    }
  }, [
    dispatch,
    defaultProcess,
    selectedTeamBoardProcess,
    selectedMyBoardProcess,
  ]);

  useEffect(() => {
    dispatch(getOrganizationProcesses);
    return () => {
      dispatch(setBoardFilters([], PROJECTS_BOARD_TABS.TEAM_BOARD));
      dispatch(setBoardFilters([], PROJECTS_BOARD_TABS.MY_BOARD));
    };
  }, [dispatch]);

  const handleChangeTab = (index: number) => {
    const selectedTab = tabs[index];
    dispatch(setProjectsBoard(selectedTab));
  };

  const currentTabIndex = useMemo(() => {
    let response = 0;
    const index = tabs.findIndex(
      (tab: string) => tab === selectedProjectsBoard
    );
    if (index > -1) {
      response = index;
    }
    return response;
  }, [tabs, selectedProjectsBoard]);

  return (
    <div className='pt-4 px-6 min-h-full'>
      {isLDUser ? (
        <Tabs
          index={currentTabIndex}
          onChange={handleChangeTab}
          className='min-h-board'
          tabListProps={{ className: 'mb-4 w-58' }}
          type='tab'
          data={[
            {
              label: intl.get('PROJECTS_LIST_PAGE.BOARD.TEAM_BOARD'),
              content: <TeamBoard />,
            },
            {
              label: intl.get('PROJECTS_LIST_PAGE.BOARD.MY_BOARD'),
              content: <MyBoard />,
            },
          ]}
        />
      ) : (
        <div>
          <span className='text-neutral-dark font-semibold text-base'>
            {intl.get('PROJECTS_LIST_PAGE.BOARD.MY_BOARD')}
          </span>
          <MyBoard />
        </div>
      )}
    </div>
  );
};

export default BoardView;
