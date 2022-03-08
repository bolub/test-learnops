import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import {
  Table,
  OverflowMenu,
  OverflowMenuItem,
  Typography,
  Button,
  Checkbox,
} from '@getsynapse/design-system';
import { Project, SortingType } from 'utils/customTypes';
import {
  DATE,
  PATHS,
  PROJECTS_TABLE_FILTER_OPTIONS,
  PROJECTS_TABLE_TABS,
} from 'utils/constants';
import {
  getHealthColumn,
  getStatusColumn,
  getOwnerColumn,
  getValueById,
} from '../helpers/tableColumnsValues';
import { teamSorting, setSortingOrders } from 'state/Projects/projectsSlice';
import {
  selectBussinessTeams,
  selectProjectCategories,
} from 'state/Organization/organizationSlice';
import {
  selectProjectProcesses,
  getOrganizationProcesses,
} from 'state/Processes/processesSlice';
import SortingArrows from 'Molecules/SortingArrows';
import { useDispatch, useSelector } from 'react-redux';
import emptyProjectsTable from 'assets/icons/empty-projects.svg';
import HeadCell from './HeadCell';

const TeamProjectsTable: React.FC<{
  projectsList: Project[];
  addNewProject?: () => void;
  onSelectProjects: (projects: string[]) => void;
}> = ({ projectsList, addNewProject, onSelectProjects }) => {
  const history = useHistory();
  const isProjectsListEmpty = projectsList.length === 0;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const bussinessTeams = useSelector(selectBussinessTeams);
  const projectProcesses = useSelector(selectProjectProcesses);
  const projectCategories = useSelector(selectProjectCategories);

  useEffect(() => {
    onSelectProjects(selectedRows);
  }, [selectedRows, onSelectProjects]);

  const allRowsSelected = useMemo(() => {
    return projectsList.length > 0
      ? selectedRows.length === projectsList.length
      : false;
  }, [selectedRows, projectsList]);

  const handleSelectAllRows = () => {
    const idsArray: string[] = [];
    if (!allRowsSelected) {
      for (const project of projectsList) {
        if (project.id) {
          idsArray.push(project.id);
        }
      }
    }
    setSelectedRows(idsArray);
  };
  const { order, orderBy } = useSelector(teamSorting);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganizationProcesses());
  }, [dispatch]);

  const handleSort = (orderByParam: string, order: SortingType) => {
    dispatch(
      setSortingOrders(
        { order, orderBy: orderByParam },
        PROJECTS_TABLE_TABS.TEAM_PROJECTS
      )
    );
  };

  const getSortingActiveStyle = (name: string) =>
    name === orderBy ? 'bg-primary-lighter' : 'bg-primary-lightest';

  const handleSelectRow = (id: string) => {
    const alreadyOnArray = selectedRows.includes(id);
    let updatedSelectedRows = [];
    if (!alreadyOnArray) {
      updatedSelectedRows = selectedRows.concat(id);
    } else {
      updatedSelectedRows = selectedRows.filter((row) => row !== id);
    }
    setSelectedRows(updatedSelectedRows);
  };

  return (
    <div className='w-full relative overflow-hidden'>
      <div
        className={classnames('whitespace-nowrap', {
          'max-w-table overflow-x-auto ml-148': !isProjectsListEmpty,
          'w-full': isProjectsListEmpty,
        })}
      >
        <Table
          canSelectRows={false}
          className={classnames({
            'w-full table-fixed': !isProjectsListEmpty,
          })}
          data={{
            headData: {
              headCells: [
                {
                  content: (
                    <Checkbox
                      value=''
                      label=''
                      onChange={handleSelectAllRows}
                      className='justify-end'
                      inputProps={{ className: '-mr-px' }}
                      checked={allRowsSelected}
                    />
                  ),
                  className: classnames('w-12', {
                    'absolute left-0 h-10 z-5 bg-primary-lightest shadow-table-column':
                      !isProjectsListEmpty,
                  }),
                },
                {
                  content: (
                    <HeadCell
                      testId='t-header__project-number'
                      className='mt-1'
                    >
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_NUMBER'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_NUMBER.value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-36',
                    {
                      'absolute left-12 h-10 z-5 shadow-table-column':
                        !isProjectsListEmpty,
                    },
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_NUMBER.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__project-name' className='mt-1'>
                      {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_NAME')}
                    </HeadCell>
                  ),
                  className: classnames('w-72', {
                    'absolute left-48 h-10 bg-primary-lightest z-5 shadow-table-column':
                      !isProjectsListEmpty,
                  }),
                },
                {
                  content: (
                    <HeadCell testId='t-header__status' className='mt-1'>
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
                    'w-28',
                    {
                      'absolute left-120 h-10 z-5 shadow-table-column':
                        !isProjectsListEmpty,
                    },
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.STATUS.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__business-unit'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.BUSINESS_UNIT'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.BUSINESS_UNIT.value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-56',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.BUSINESS_UNIT.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__category'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_CATEGORY'
                        )}
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
                    'w-48',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_CATEGORY.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__priority'>
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
                    'w-36',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.PRIORITY.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__owner'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.PROJECT_OWNER'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_OWNER.value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-44',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_OWNER.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__start-date'>
                      <React.Fragment>
                        {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.START_DATE')}
                        <SortingArrows
                          name={PROJECTS_TABLE_FILTER_OPTIONS.START_DATE.value}
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-32',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.START_DATE.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__target-completion-date'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.TARGET_COMPLETION_DATE'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.TARGET_COMPLETION_DATE
                              .value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-36',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.TARGET_COMPLETION_DATE.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__actual-completion-date'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.ACTUAL_COMPLETION_DATE'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.ACTUAL_COMPLETION_DATE
                              .value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-40',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.ACTUAL_COMPLETION_DATE.value
                    )
                  ),
                },
                {
                  content: (
                    <div data-cy='t-header__resourcing-type'>
                      {intl.get(
                        'PROJECTS_LIST_PAGE.TABLE.HEAD.RESOURCING_TYPE'
                      )}
                    </div>
                  ),
                  className: 'w-36',
                },
                {
                  content: (
                    <div data-cy='t-header__budget-source'>
                      {intl.get('PROJECTS_LIST_PAGE.TABLE.HEAD.BUGGET_SOURCE')}
                    </div>
                  ),
                  className: 'w-36',
                },
                {
                  content: (
                    <HeadCell testId='t-header__process-stage'>
                      <React.Fragment>
                        {intl.get(
                          'PROJECTS_LIST_PAGE.TABLE.HEAD.PROCESS_STAGE'
                        )}
                        <SortingArrows
                          name={
                            PROJECTS_TABLE_FILTER_OPTIONS.PROCESS_STAGE.value
                          }
                          handleSort={handleSort}
                          order={order}
                          orderBy={orderBy}
                        />
                      </React.Fragment>
                    </HeadCell>
                  ),
                  className: classnames(
                    'w-36',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.PROCESS_STAGE.value
                    )
                  ),
                },
                {
                  content: (
                    <HeadCell testId='t-header__health'>
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
                    'w-36',
                    getSortingActiveStyle(
                      PROJECTS_TABLE_FILTER_OPTIONS.HEALTH.value
                    )
                  ),
                },
                {
                  content: <div></div>,
                  className: classnames('w-20', {
                    'absolute right-0 z-5 bg-primary-lightest h-10':
                      !isProjectsListEmpty,
                  }),
                },
              ],
            },
            rows: projectsList.map((project: Project, index: number) => {
              const isOdd = index % 2;
              const isSelected = selectedRows.includes(project.id);
              return {
                'data-cy': `project-${project.id}`,
                className: 'group cursor-pointer',
                onClick: () =>
                  history.push(`${PATHS.PROJECT_PAGE}/${project.id}`),
                cells: [
                  {
                    content: (
                      <div
                        onClick={(event: React.MouseEvent<HTMLInputElement>) =>
                          event.stopPropagation()
                        }
                      >
                        <Checkbox
                          value={project.id}
                          label=''
                          className='justify-end'
                          inputProps={{ className: '-mr-px' }}
                          checked={isSelected}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => handleSelectRow(event.target.value)}
                        />
                      </div>
                    ),
                    className: classnames('w-12', {
                      'absolute z-5 left-0 group-hover:bg-primary-lighter shadow-table-column':
                        !isProjectsListEmpty,
                      'bg-primary-lighter shadow-inner-l': isSelected,
                      'bg-neutral-white': !isOdd && !isSelected,
                      'bg-neutral-lightest': isOdd && !isSelected,
                    }),
                  },
                  {
                    content: project.projectNumber,
                    className: classnames('w-36', {
                      'absolute left-12 z-5 group-hover:bg-primary-lighter shadow-table-column':
                        !isProjectsListEmpty,
                      'bg-primary-lighter': isSelected,
                      'bg-neutral-white': !isOdd && !isSelected,
                      'bg-neutral-lightest': isOdd && !isSelected,
                    }),
                  },
                  {
                    content: (
                      <Link to={`${PATHS.PROJECT_PAGE}/${project.id}`}>
                        {project.title}
                      </Link>
                    ),
                    className: classnames('w-72', {
                      'absolute left-48 z-5 group-hover:bg-primary-lighter shadow-table-column':
                        !isProjectsListEmpty,
                      'bg-primary-lighter': isSelected,
                      'bg-neutral-white': !isOdd && !isSelected,
                      'bg-neutral-lightest': isOdd && !isSelected,
                    }),
                    'data-cy': `project-${project.id}-title`,
                  },
                  {
                    content: getStatusColumn(project.status),
                    className: classnames('w-28', {
                      'absolute left-120 z-5 group-hover:bg-primary-lighter shadow-table-column':
                        !isProjectsListEmpty,
                      'bg-primary-lighter': isSelected,
                      'bg-neutral-white': !isOdd && !isSelected,
                      'bg-neutral-lightest': isOdd && !isSelected,
                    }),
                  },
                  {
                    content: getValueById(
                      bussinessTeams,
                      'title',
                      project.businessUnitId
                    ),
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: getValueById(
                      projectCategories,
                      'categoryName',
                      project.category_id
                    ),
                  },
                  {
                    content: intl.get(
                      `PROJECT_DETAIL.PRIORITY_OPTIONS.${project.priority.toUpperCase()}`
                    ),
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: project.owners && getOwnerColumn(project.owners),
                    className: classnames('w-40', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content:
                      project.startDate &&
                      moment(new Date(project.startDate)).format(
                        DATE.SHORT_FORMAT
                      ),
                    className: classnames('w-32', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content:
                      project.targetCompletionDate &&
                      moment(new Date(project.targetCompletionDate)).format(
                        DATE.SHORT_FORMAT
                      ),
                    className: classnames('w-32', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content:
                      project?.actualDate &&
                      moment(new Date(project.actualDate)).format(
                        DATE.SHORT_FORMAT
                      ),
                    className: classnames('w-32', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: 'Resourcing Type',
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: project?.budget_source,
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: getValueById(
                      projectProcesses,
                      'processName',
                      project.process_id!
                    ),
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: getHealthColumn(project?.health),
                    className: classnames('w-36', {
                      'bg-primary-lighter': isSelected,
                    }),
                  },
                  {
                    content: (
                      <div
                        className='w-full h-full text-center relative'
                        onClick={(event: React.MouseEvent<HTMLInputElement>) =>
                          event.stopPropagation()
                        }
                      >
                        <OverflowMenu
                          menuButtonProps={{
                            className:
                              'text-lg text-neutral focus:outline-none active:outline-none focus-visible:outline-none',
                          }}
                          menuListProps={{
                            className: 'absolute right-0 -mr-5 z-10',
                          }}
                        >
                          <OverflowMenuItem onSelect={() => {}}>
                            Action 1
                          </OverflowMenuItem>
                        </OverflowMenu>
                      </div>
                    ),
                    className: classnames('w-20 justify-center items-center', {
                      'absolute right-0 z-5 group-hover:bg-primary-lighter':
                        !isProjectsListEmpty,
                      'bg-primary-lighter': isSelected,
                      'bg-neutral-white': !isOdd && !isSelected,
                      'bg-neutral-lightest': isOdd && !isSelected,
                    }),
                  },
                ],
              };
            }),
          }}
          data-cy='team-projects-table'
          emptyComponent={
            <div
              data-cy='team-projects-empty'
              className='flex items-center justify-center bg-neutral-white h-88'
            >
              <div className='flex-col justify-center items-center'>
                <img src={emptyProjectsTable} alt='No projects found' />
                <Typography variant='body' className='mt-4 neutral-black'>
                  {intl.get('PROJECTS_LIST_PAGE.TABLE.EMPTY')}
                </Typography>
                <Button
                  className='mt-2 mx-auto'
                  size='small'
                  onClick={addNewProject}
                >
                  {intl.get('PROJECTS_LIST_PAGE.TABLE.GET_STARTED')}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TeamProjectsTable;
