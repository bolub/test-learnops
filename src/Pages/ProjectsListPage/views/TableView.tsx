import React, { useState, useCallback, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Tabs } from '@getsynapse/design-system';
import isEmpty from 'lodash/isEmpty';
import {
  PROJECTS_TABLE_TABS,
  TEAM_PROJECTS_TABLE_COLUMNS,
  USER_PROJECTS_TABLE_COLUMNS,
  PATHS,
} from 'utils/constants';
import {
  selectTeamProjects,
  selectUserProjects,
  updatePagination,
  setFilters,
  exportCsv,
} from 'state/Projects/projectsSlice';
import { selectUserId } from 'state/User/userSlice';
import { ProjectsTableTab, filter, Project } from 'utils/customTypes';
import {
  generateCsvHeaders,
  generateCsvData,
  getCsvFileName,
} from '../helpers/export';
import MyProjectsTable from '../components/MyProjectsTable';
import TeamProjectsTable from '../components/TeamProjectsTable';
import Pagination from 'Organisms/Pagination';
import TableHeaderFilters from '../components/TableHeaderFilters';

const TableView = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const teamProjectsList = useSelector(selectTeamProjects);
  const userProjectsList = useSelector(selectUserProjects);
  const currentUserId = useSelector(selectUserId);

  const handleAddProject = () => history.push(PATHS.NEW_PROJECT_PAGE);

  useEffect(() => {
    return () => {
      dispatch(setFilters([], PROJECTS_TABLE_TABS.TEAM_PROJECTS));
      dispatch(setFilters([], PROJECTS_TABLE_TABS.MY_PROJECTS));
    };
  }, [dispatch]);

  const handleUpdatePagination = useCallback(
    (pagination) => {
      const table: ProjectsTableTab =
        currentTabIndex === 0
          ? PROJECTS_TABLE_TABS.TEAM_PROJECTS
          : PROJECTS_TABLE_TABS.MY_PROJECTS;
      dispatch(updatePagination(pagination, table));
    },
    [currentTabIndex, dispatch]
  );

  const handleUpdateFilters = (filters: filter[], table: ProjectsTableTab) => {
    dispatch(setFilters(filters, table));
  };

  const handleExportProjectsToCsv = () => {
    const projects: Project[] =
      currentTabIndex === 0 ? teamProjectsList.data : userProjectsList.data;
    const tableColumns =
      currentTabIndex === 0
        ? TEAM_PROJECTS_TABLE_COLUMNS
        : USER_PROJECTS_TABLE_COLUMNS;
    const filteredProjects = projects.filter((project: Project) =>
      selectedProjects.includes(project.id)
    );
    const csvHeaders = generateCsvHeaders(tableColumns);
    const csvData = generateCsvData(
      tableColumns,
      filteredProjects,
      currentUserId
    );
    const csvFileName = getCsvFileName();
    dispatch(exportCsv({ csvHeaders, csvData, fileName: csvFileName }));
  };

  const handleSelectProjects = useCallback((projects: string[]) => {
    setSelectedProjects(projects);
  }, []);

  return (
    <div className='relative w-full h-full'>
      <div className='py-4 px-6 max-h-table overflow-y-auto'>
        <Tabs
          index={currentTabIndex}
          onChange={(index: number) => setCurrentTabIndex(index)}
          tabListProps={{ className: 'w-58 mb-4' }}
          type='tab'
          data={[
            {
              label: intl.get('PROJECTS_LIST_PAGE.TEAM_PROJECTS'),
              content: (
                <div className='mt-4'>
                  <TableHeaderFilters
                    headerColumns={TEAM_PROJECTS_TABLE_COLUMNS}
                    table={PROJECTS_TABLE_TABS.TEAM_PROJECTS}
                    onExport={handleExportProjectsToCsv}
                    exportEnabled={!isEmpty(selectedProjects)}
                    onUpdateFilters={(filters: filter[]) =>
                      handleUpdateFilters(
                        filters,
                        PROJECTS_TABLE_TABS.TEAM_PROJECTS
                      )
                    }
                  />
                  <TeamProjectsTable
                    projectsList={teamProjectsList.data}
                    addNewProject={handleAddProject}
                    onSelectProjects={handleSelectProjects}
                  />
                  <Pagination
                    total={teamProjectsList.total}
                    onChange={handleUpdatePagination}
                    className='z-10 z-10 max-w-full'
                  />
                </div>
              ),
            },
            {
              label: intl.get('PROJECTS_LIST_PAGE.MY_PROJECTS'),
              content: (
                <div className='mt-4'>
                  <TableHeaderFilters
                    headerColumns={USER_PROJECTS_TABLE_COLUMNS}
                    table={PROJECTS_TABLE_TABS.MY_PROJECTS}
                    onExport={handleExportProjectsToCsv}
                    exportEnabled={!isEmpty(selectedProjects)}
                    onUpdateFilters={(filters: filter[]) =>
                      handleUpdateFilters(
                        filters,
                        PROJECTS_TABLE_TABS.MY_PROJECTS
                      )
                    }
                  />
                  <MyProjectsTable
                    onSelectProjects={handleSelectProjects}
                    projectsList={userProjectsList.data}
                    addNewProject={handleAddProject}
                  />
                  <Pagination
                    total={userProjectsList.total}
                    onChange={handleUpdatePagination}
                    className='z-10 max-w-full'
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TableView;
