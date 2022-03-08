import React, { useEffect, useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Icon } from '@getsynapse/design-system';
import {
  projectsListViewMode,
  setProjectsListViewMode,
  fetchProjects,
  fetchUserProjects,
} from 'state/Projects/projectsSlice';
import { PATHS, PROJECTS_LIST_VIEW_MODE } from 'utils/constants';
import { ProjectsListViewMode } from 'utils/customTypes';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import ToggleButtonGroup from 'Molecules/ToggleButtonGroup/ToggleButtonGroup';
import TableView from './views/TableView';
import BoardView from './views/BoardView';
import boardView from 'assets/icons/board-view.svg';
import tableView from 'assets/icons/table-view.svg';

const ProjectsListPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const viewMode = useSelector(projectsListViewMode);
  const handleAddProject = () => history.push(PATHS.NEW_PROJECT_PAGE);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUserProjects());
  }, [dispatch]);

  const handleToggleViewMode = (viewMode: ProjectsListViewMode) => {
    dispatch(setProjectsListViewMode(viewMode));
  };

  const viewModeOptions = useMemo(
    () => [
      {
        children: (isSelected: boolean) => (
          <Icon src={tableView} className='h-4' />
        ),
        key: PROJECTS_LIST_VIEW_MODE.TABLE,
        'data-cy': 'list-view-switch-button',
      },
      {
        children: (isSelected: boolean) => <Icon src={boardView} />,
        key: PROJECTS_LIST_VIEW_MODE.BOARD,
        'data-cy': 'board-view-switch-button',
      },
    ],
    []
  );

  return (
    <div className='flex flex-col h-full'>
      <PageTitle
        titleComponent={intl.get('PROJECTS_LIST_PAGE.TITLE')}
        headerChildren={
          <Button onClick={handleAddProject} data-cy='add-project-button'>
            {intl.get('PROJECTS_LIST_PAGE.ADD_PROJECT_BUTTON')}
          </Button>
        }
      />
      <div className='relative w-full h-full'>
        <ToggleButtonGroup
          buttonsList={viewModeOptions}
          className='absolute top-0 right-0 mt-4 mr-6 z-10'
          onChange={handleToggleViewMode}
          defaultSelected={viewMode}
        />
        {viewMode === PROJECTS_LIST_VIEW_MODE.TABLE && <TableView />}
        {viewMode === PROJECTS_LIST_VIEW_MODE.BOARD && <BoardView />}
      </div>
    </div>
  );
};

export default ProjectsListPage;
