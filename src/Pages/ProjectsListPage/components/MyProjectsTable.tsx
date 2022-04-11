import React from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { useHistory, Link } from 'react-router-dom';
import {
  Table,
  OverflowMenu,
  OverflowMenuItem,
  Typography,
  Button,
} from '@getsynapse/design-system';
import { Project } from 'utils/customTypes';
import { setSortingOrders, mySorting } from 'state/Projects/projectsSlice';
import { selectUserId, selectIsUserLd } from 'state/User/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  PATHS,
  PROJECTS_TABLE_FILTER_OPTIONS,
  PROJECTS_TABLE_TABS,
  PROJECT_STATUS,
} from 'utils/constants';
import { SortingType } from 'utils/customTypes';
import {
  getStatusColumn,
  getProjectRoleColumn,
  getValueById,
  getProjectNumberColumn,
} from '../helpers/tableColumnsValues';
import SortingArrows from 'Molecules/SortingArrows';
import HeadCell from './HeadCell';
import {
  selectBussinessTeams,
  selectProjectCategories,
} from 'state/Organization/organizationSlice';
import emptyProjectsTable from 'assets/icons/empty-projects.svg';
import HealthLabel from 'Molecules/HealthLabel';

const MyProjectsTable: React.FC<{
  projectsList: Project[];
  addNewProject?: () => void;
  onSelectProjects: (projects: string[]) => void;
}> = ({ projectsList, addNewProject, onSelectProjects }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const bussinessTeams = useSelector(selectBussinessTeams);
  const projectCategories = useSelector(selectProjectCategories);
  const isLDUser = useSelector(selectIsUserLd);

  const handleSort = (orderByParam: string, order: SortingType) => {
    dispatch(
      setSortingOrders(
        { order, orderBy: orderByParam },
        PROJECTS_TABLE_TABS.MY_PROJECTS
      )
    );
  };
  const currentUserId = useSelector(selectUserId);
  const { order, orderBy } = useSelector(mySorting);
  const getSortingActiveStyle = (name: string) =>
    name === orderBy ? 'bg-primary-lighter' : 'bg-primary-lightest';

  return (
    <Table
      onSelectRows={onSelectProjects}
      className='w-full table-fixed'
      bodyProps={{ className: 'shadow-table-row' }}
      data={{
        headData: {
          headCells: [
            {
              content: (
                <HeadCell testId='m-header__project-number'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_NUMBER')}
                    <SortingArrows
                      name={PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_NUMBER.value}
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: getSortingActiveStyle(
                PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_NUMBER.value
              ),
            },
            {
              content: (
                <div data-cy='m-header__project-name'>
                  {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_NAME')}
                </div>
              ),
              className: classnames(
                'w-1/4',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_NAME.value
                )
              ),
            },
            {
              content: (
                <HeadCell testId='m-header__category'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_CATEGORY')}
                    <SortingArrows
                      name={
                        PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_CATEGORY.value
                      }
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: classnames(
                'min-w-40',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_CATEGORY.value
                )
              ),
            },
            {
              content: (
                <HeadCell testId='m-header__business-unit'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.BUSINESS_UNIT')}
                    <SortingArrows
                      name={PROJECTS_TABLE_FILTER_OPTIONS.BUSINESS_UNIT.value}
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: classnames(
                'min-w-40',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.BUSINESS_UNIT.value
                )
              ),
            },
            {
              content: (
                <HeadCell testId='m-header__project-role'>
                  {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_ROLE')}
                </HeadCell>
              ),
              className: 'min-w-28',
            },
            {
              content: (
                <HeadCell testId='m-header__priority'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PRIORITY')}
                    <SortingArrows
                      name={PROJECTS_TABLE_FILTER_OPTIONS.PRIORITY.value}
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: classnames(
                'min-w-28',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.PRIORITY.value
                )
              ),
            },
            {
              content: (
                <HeadCell testId='m-header__status'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.STATUS')}
                    <SortingArrows
                      name={PROJECTS_TABLE_FILTER_OPTIONS.STATUS.value}
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: classnames(
                'min-w-28',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.STATUS.value
                )
              ),
            },
            {
              content: (
                <HeadCell testId='m-header__health'>
                  <React.Fragment>
                    {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.HEALTH')}
                    <SortingArrows
                      name={PROJECTS_TABLE_FILTER_OPTIONS.HEALTH.value}
                      handleSort={handleSort}
                      order={order}
                      orderBy={orderBy}
                    />
                  </React.Fragment>
                </HeadCell>
              ),
              className: classnames(
                'min-w-28',
                getSortingActiveStyle(
                  PROJECTS_TABLE_FILTER_OPTIONS.HEALTH.value
                )
              ),
            },
            {
              content: <div></div>,
              className: 'w-20',
            },
          ],
        },
        rows: projectsList.map((project: Project) => {
          const isInProgressOrCompleted =
            project.status === PROJECT_STATUS.IN_PROGRESS ||
            project.status === PROJECT_STATUS.COMPLETED;

          return {
            'data-cy': `project-${project.id}`,
            id: project.id,
            className: 'cursor-pointer',
            onClick: () => history.push(`${PATHS.PROJECT_PAGE}/${project.id}`),
            cells: [
              {
                content: getProjectNumberColumn(project.projectNumber),
              },
              {
                content: (
                  <Link to={`${PATHS.PROJECT_PAGE}/${project.id}`}>
                    {project.title}
                  </Link>
                ),
                className: 'w-1/4',
              },
              {
                content: getValueById(
                  projectCategories,
                  'categoryName',
                  project.category_id
                ),
                className: 'min-w-40',
              },
              {
                content: getValueById(
                  bussinessTeams,
                  'title',
                  project.businessUnitId
                ),
                className: 'min-w-40',
              },
              {
                content: getProjectRoleColumn(currentUserId, project),
                className: 'min-w-28',
              },
              {
                content:
                  project.priority &&
                  intl.get(
                    `PROJECT_DETAIL.PRIORITY_OPTIONS.${project.priority.toUpperCase()}`
                  ),
                className: 'min-w-28',
              },
              {
                content: getStatusColumn(project.status),
                className: 'min-w-28',
              },
              {
                content: isInProgressOrCompleted && (
                  <HealthLabel health={project?.health} />
                ),
                className: 'min-w-28',
              },
              {
                content: (
                  <div
                    className='text-center'
                    onClick={(event: React.MouseEvent<HTMLInputElement>) =>
                      event.stopPropagation()
                    }
                  >
                    <OverflowMenu
                      menuButtonProps={{
                        className:
                          'text-lg text-neutral focus:outline-none active:outline-none focus-visible:outline-none',
                      }}
                    >
                      <OverflowMenuItem onSelect={() => {}}>
                        Action 1
                      </OverflowMenuItem>
                    </OverflowMenu>
                  </div>
                ),
                className: 'justify-center w-20',
              },
            ],
          };
        }),
      }}
      data-cy='projects-table'
      emptyComponent={
        <div
          data-cy='my-projects-empty'
          className='flex items-center justify-center bg-neutral-white h-88'
        >
          <div className='flex-col justify-center items-center'>
            <img src={emptyProjectsTable} alt='No projects found' />
            <Typography variant='body' className='mt-4 neutral-black'>
              {intl.get('PROJECTS_LIST_PAGE.TABLE.EMPTY')}
            </Typography>
            {isLDUser && (
              <Button
                className='mt-2 mx-auto'
                size='small'
                onClick={addNewProject}
              >
                {intl.get('PROJECTS_LIST_PAGE.TABLE.GET_STARTED')}
              </Button>
            )}
          </div>
        </div>
      }
    />
  );
};

export default MyProjectsTable;
