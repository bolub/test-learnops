import React, { useState, Fragment, useMemo } from 'react';
import {
  Table,
  OverflowMenu,
  OverflowMenuItem,
  AvatarGroup,
} from '@getsynapse/design-system';
import { useHistory } from 'react-router-dom';
import HeadCell from 'Pages/ProjectsListPage/components/HeadCell';
import intl from 'react-intl-universal';
import { Task, TasksTableTab, AvatarUser } from 'utils/customTypes';
import AddTaskModal from '../../AddTaskModal';
import classnames from 'classnames';
import moment from 'moment';
import { Icon, Tooltip } from '@getsynapse/design-system';
import {
  DATE,
  TASKS_TABLE_TABS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { getStatusColumn } from 'Pages/ProjectsListPage/helpers/tableColumnsValues';
import RenderNoRecords from 'Pages/RequestsListPage/components/NoRecords';
import { useDispatch, useSelector } from 'react-redux';
import {
  teamSearchParam,
  mySearchParam,
  teamTasksTableFilters,
  myTasksTableFilters,
  teamTasksTableReorder,
  reorderRow,
} from 'state/Tasks/taskSlice';
import searchNoReturns from 'assets/icons/search-no-returns.svg';
import noFilterResults from 'assets/images/no-filter-results.svg';
import disabledTask from 'assets/icons/disabled.svg';
import {
  getCurrentProjectData,
  updateProject,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import ReorderIconArrow from './ReorderIcon';
import TaskModal from '../../components/TaskModal/TaskModal';
import { taskModalDefaultValues } from '../../helpers/constants';
import UserAvatar from 'Atoms/UserAvatar';

const TaskTable: React.FC<{
  tasksList: Task[];
  projectId: string;
  onSelectTasks: (tasks: string[]) => void;
  taskTable: TasksTableTab;
}> = ({ tasksList, projectId, onSelectTasks, taskTable }) => {
  const getStartedText = intl.get('TASKS.TABLE.GET_STARTED');
  const history = useHistory();
  const participantType = useSelector(getCurrentUserParticipantType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState<Task>(taskModalDefaultValues);
  const isUserProjectParticipant =
    participantType !== PROJECT_PARTICIPANT_TYPE.NOT_PARTICIPANT;

  const hasDisabledTask = useMemo(
    () => tasksList.some((task) => task.disabled),
    [tasksList]
  );

  const getAssignedUsers = (assignedUser: AvatarUser[] = []) => {
    if (isEmpty(assignedUser)) {
      return (
        <span className='text-neutral-dark'>
          {intl.get('TASKS.TABLE.NO_ASSIGNEE')}
        </span>
      );
    }
    if (assignedUser.length === 1) {
      return (
        <div className='flex items-center'>
          <UserAvatar user={assignedUser[0]} className='mr-2' />
          {`${get(assignedUser, '0.data.firstName')} ${get(
            assignedUser,
            '0.data.lastName'
          )}`}
        </div>
      );
    } else if (assignedUser.length > 1) {
      return (
        <div className='flex items-center'>
          <AvatarGroup
            avatars={assignedUser.map((user) => ({
              imageSrc: user.avatar_url,
              initial: get(get(user, 'data.firstName'), '[0]'),
            }))}
          />
        </div>
      );
    }
  };

  const searchParam = useSelector(
    taskTable === TASKS_TABLE_TABS.TEAM_TASKS ? teamSearchParam : mySearchParam
  );

  const appliedFilters = useSelector(
    taskTable === TASKS_TABLE_TABS.TEAM_TASKS
      ? teamTasksTableFilters
      : myTasksTableFilters
  );

  const appliedReorder =
    useSelector(teamTasksTableReorder) &&
    taskTable === TASKS_TABLE_TABS.TEAM_TASKS;

  let emptyTableImageSrc = null;
  if (!isEmpty(appliedFilters)) {
    emptyTableImageSrc = noFilterResults;
  }

  if (!isEmpty(searchParam)) {
    emptyTableImageSrc = searchNoReturns;
  }

  const dispatch = useDispatch();
  const projectData = useSelector(getCurrentProjectData);

  const reorderRowHandler = async (direction: string, taskId: string) => {
    if (!projectData?.tasksOrdering) {
      return;
    }
    const currentIndex = projectData?.tasksOrdering?.indexOf(taskId);
    if (currentIndex === 0 && direction === 'up') return;

    const moveUp = currentIndex - 1;
    const moveDown = currentIndex + 1;

    if (!projectData.tasksOrdering) return;

    let newTasksOrderingList =
      projectData?.tasksOrdering?.length > 0
        ? [...projectData?.tasksOrdering]
        : [];

    let newIndex = direction === 'up' ? moveUp : moveDown;
    [newTasksOrderingList[currentIndex], newTasksOrderingList[newIndex]] = [
      newTasksOrderingList[newIndex],
      newTasksOrderingList[currentIndex],
    ];

    await dispatch(
      updateProject({
        projectId: projectId,
        data: {
          tasksOrdering: newTasksOrderingList,
        },
      })
    );

    dispatch(reorderRow(newTasksOrderingList));
  };

  const getIsFirstTask = (taskId: string) => {
    if (!projectData?.tasksOrdering) {
      return true;
    }
    const currentIndex = projectData?.tasksOrdering?.indexOf(taskId);
    return currentIndex === 0;
  };

  const getIsLastTask = (taskId: string) => {
    if (!projectData?.tasksOrdering) {
      return true;
    }
    const currentIndex = projectData.tasksOrdering.indexOf(taskId);
    return currentIndex === projectData.tasksOrdering.length - 1;
  };

  const handleDuplicateModal = async (task: Task) => {
    setTaskData(task);
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <div className='w-full h-full'>
        <div className='max-h-full'>
          <Table
            className='h-full w-full table-fixed relative overflow-y-auto'
            canSelectRows={!appliedReorder}
            onSelectRows={onSelectTasks}
            data={{
              headData: {
                headCells: [
                  {
                    content: '',
                    className: classnames('w-20', !appliedReorder && 'hidden'),
                  },
                  {
                    content: '',
                    className: classnames('w-10', !hasDisabledTask && 'w-2'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-title'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.NAME')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-1/4'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-assignee'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.ASSIGNEE_UPDATE')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-1/6'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-type'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.TASK_TYPE')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-1/6'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-start-date'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.START_DATE')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-1/6'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-due-date'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.DUE_DATE')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-1/6'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__task-status'>
                        <React.Fragment>
                          {intl.get('TASKS.TABLE.HEAD.STATUS')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-28'),
                  },
                  {
                    content: <div></div>,
                    className: 'w-20',
                  },
                ],
              },

              rows: tasksList.map((task: Task, index: number) => {
                const isFirst = getIsFirstTask(task.id);
                const isLast = getIsLastTask(task.id);

                return {
                  'data-cy': `task-${task.id}`,
                  id: task.id,
                  className: 'cursor-pointer',
                  onClick: () => history.push(`${projectId}/tasks/${task.id}`),
                  cells: [
                    {
                      content: (
                        <div className='flex'>
                          <ReorderIconArrow
                            name='arrow-up'
                            className='mr-2'
                            isFirst={isFirst}
                            onClickHandler={() => {
                              if (isFirst) return;
                              reorderRowHandler('up', task.id);
                            }}
                            id={task.id}
                            dataCy={`task-reorder-up-${task.id}`}
                          />
                          <ReorderIconArrow
                            name='arrow-down'
                            isLast={isLast}
                            onClickHandler={() => {
                              if (isLast) return;
                              reorderRowHandler('down', task.id);
                            }}
                            id={task.id}
                            dataCy={`task-reorder-down-${task.id}`}
                          />
                        </div>
                      ),
                      className: !appliedReorder && 'hidden',
                    },
                    {
                      content: task.disabled && (
                        <Tooltip
                          data-cy={`task-disabled-tooltip-${task.id}`}
                          trigger={
                            <Icon src={disabledTask} className='h-5 w-5' />
                          }
                          openMode='hover2'
                          ariaId='task-disabled'
                          position='topCenter'
                          timeout={100}
                          contentProps={{
                            className: classnames(
                              'bg-neutral-dark',
                              'text-neutral-white',
                              'rounded',
                              'font-body px-3.5 py-2'
                            ),
                          }}
                        >
                          <span>{intl.get('TASKS.TABLE.INACTIVE')}</span>
                        </Tooltip>
                      ),
                      className: 'align-bottom',
                    },

                    {
                      content: task.name,
                    },
                    {
                      content: getAssignedUsers(task?.assignedUsers),
                    },
                    {
                      content: task?.type && <div>{task.type}</div>,
                    },
                    {
                      content:
                        task?.start_date &&
                        moment(new Date(task.start_date)).format(
                          DATE.TASK_TABLE_FORMAT
                        ),
                    },

                    {
                      content:
                        task?.due_date &&
                        moment(new Date(task.due_date)).format(
                          DATE.TASK_TABLE_FORMAT
                        ),
                    },
                    {
                      content: getStatusColumn(task.status),
                    },
                    {
                      content: (
                        <div
                          className='text-center'
                          onClick={(
                            event: React.MouseEvent<HTMLInputElement>
                          ) => event.stopPropagation()}
                        >
                          {isUserProjectParticipant && (
                            <OverflowMenu
                              menuButtonProps={{
                                className:
                                  'text-lg text-neutral focus:outline-none active:outline-none focus-visible:outline-none',
                                'data-cy': 'menu-button',
                              }}
                            >
                              <OverflowMenuItem
                                data-cy={`task-${task.id}-duplicate-option`}
                                onSelect={() => handleDuplicateModal(task)}
                              >
                                {intl.get('TASKS.TABLE.DUPLICATE')}
                              </OverflowMenuItem>
                            </OverflowMenu>
                          )}
                        </div>
                      ),
                      className: 'justify-center w-20',
                    },
                  ],
                };
              }),
            }}
            data-cy='tasks-table'
            emptyComponent={
              !isEmpty(appliedFilters) || !isEmpty(searchParam) ? (
                <RenderNoRecords
                  dataCy='no-task-found'
                  caption={intl.get('TASKS.TABLE.NO_RECORDS')}
                  imageSrc={emptyTableImageSrc}
                  className={!isEmpty(appliedFilters) ? 'h-58' : ''}
                />
              ) : (
                <RenderNoRecords
                  dataCy='no-task-found'
                  caption={intl.get('TASKS.TABLE.EMPTY')}
                >
                  <div className='mx-auto'>
                    <AddTaskModal
                      renderText={getStartedText}
                      componentType='table'
                    />
                  </div>
                </RenderNoRecords>
              )
            }
          />
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        taskData={taskData}
        duplicateTaskCheck={true}
      />
    </Fragment>
  );
};

export default TaskTable;
