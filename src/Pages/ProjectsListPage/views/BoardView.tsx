import { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from '@getsynapse/design-system';
import { setBoardProcess, setBoardFilters } from 'state/Projects/projectsSlice';
import {
  getOrganizationProcesses,
  selectProjectProcesses,
} from 'state/Processes/processesSlice';
import { PROJECTS_BOARD_TABS } from 'utils/constants';
import TeamBoard from '../components/TeamBoard';
import MyBoard from '../components/MyBoard';

const BoardView = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const dispatch = useDispatch();
  const organizationProjectProcesses = useSelector(selectProjectProcesses);
  const defaultProcess =
    organizationProjectProcesses[organizationProjectProcesses.length - 1];

  useEffect(() => {
    if (defaultProcess && defaultProcess.id) {
      dispatch(
        setBoardProcess(defaultProcess.id, PROJECTS_BOARD_TABS.TEAM_BOARD)
      );
      dispatch(
        setBoardProcess(defaultProcess.id, PROJECTS_BOARD_TABS.MY_BOARD)
      );
    }
  }, [organizationProjectProcesses, dispatch, defaultProcess]);

  useEffect(() => {
    dispatch(getOrganizationProcesses);
    return () => {
      dispatch(setBoardFilters([], PROJECTS_BOARD_TABS.TEAM_BOARD));
      dispatch(setBoardFilters([], PROJECTS_BOARD_TABS.MY_BOARD));
    };
  }, [dispatch]);

  return (
    <div className='pt-4 px-6 min-h-full'>
      <Tabs
        index={currentTabIndex}
        onChange={(index: number) => setCurrentTabIndex(index)}
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
    </div>
  );
};

export default BoardView;
