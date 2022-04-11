import { useState, useEffect, useCallback } from 'react';
import AddTaskModal from './AddTaskModal';
import intl from 'react-intl-universal';
import { Tabs, ProgressBar } from '@getsynapse/design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeamTasks,
  fetchUserTasks,
  selectMyTasks,
  selectTeamTasks,
  getTeamTasksAssigneesList,
  getUserTasksAssigneesList,
  setSearchParam,
  setFilters,
  getTeamTasksCompletionProgress,
  getUserTasksCompletionProgress,
  updatePagination,
} from 'state/Tasks/taskSlice';
import Pagination from 'Organisms/Pagination';
import { exportCsv } from 'state/Projects/projectsSlice';
import { getCurrentUserParticipantType } from 'state/Project/projectSlice';
import {
  generateCsvHeaders,
  generateCsvData,
  getCsvFileName,
} from './helpers/export';
import isEmpty from 'lodash/isEmpty';
import { Task, TasksTableTab } from 'utils/customTypes';
import {
  TASKS_TABLE_TABS,
  TASKS_TABLE_COLUMNS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import { useParams } from 'react-router-dom';
import TaskTable from './TasksListPage/components/TasksTable';
import TasksTableFilters from './TasksListPage/components/TasksTableFilters';

const Tasks = () => {
  const participantType = useSelector(getCurrentUserParticipantType);
  const dispatch = useDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const addTaskButtonText = intl.get('TASKS.ADD_TASK_BUTTON_TITLE');
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const canAddTask = [
    PROJECT_PARTICIPANT_TYPE.OWNER,
    PROJECT_PARTICIPANT_TYPE.MEMBER,
  ].includes(participantType);

  useEffect(() => {
    dispatch(fetchUserTasks(projectId));
    dispatch(fetchTeamTasks(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    return () => {
      dispatch(setFilters([], TASKS_TABLE_TABS.TEAM_TASKS));
      dispatch(setFilters([], TASKS_TABLE_TABS.MY_TASKS));
      dispatch(setSearchParam('', TASKS_TABLE_TABS.MY_TASKS));
      dispatch(setSearchParam('', TASKS_TABLE_TABS.TEAM_TASKS));
    };
  }, [dispatch]);

  const teamTasksList = useSelector(selectTeamTasks);
  const userTasksList = useSelector(selectMyTasks);

  const teamTasksAssignees = useSelector(getTeamTasksAssigneesList);
  const userTasksAssignees = useSelector(getUserTasksAssigneesList);

  const teamTasksCompletionProgress = useSelector(
    getTeamTasksCompletionProgress
  );
  const userTasksCompletionProgress = useSelector(
    getUserTasksCompletionProgress
  );

  const handleExportTasksToCsv = () => {
    const tasks: Task[] =
      currentTabIndex === 0 ? teamTasksList.data : userTasksList.data;
    const tableColumns = TASKS_TABLE_COLUMNS;
    const filteredProjects = tasks.filter((task: Task) =>
      selectedTasks.includes(task.id)
    );
    const csvHeaders = generateCsvHeaders(tableColumns);
    const csvData = generateCsvData(tableColumns, filteredProjects);
    const csvFileName = getCsvFileName();

    dispatch(exportCsv({ csvHeaders, csvData, fileName: csvFileName }));
  };

  const handleUpdatePagination = useCallback(
    (pagination) => {
      const table: TasksTableTab =
        currentTabIndex === 0
          ? TASKS_TABLE_TABS.TEAM_TASKS
          : TASKS_TABLE_TABS.MY_TASKS;
      dispatch(updatePagination(pagination, table));
    },
    [currentTabIndex, dispatch]
  );

  return (
    <div className='w-full h-full relative'>
      <div className='absolute left-64 top-0 ml-4 mt-4 h-8 flex items-center'>
        <ProgressBar
          maxValue={
            currentTabIndex === 0
              ? teamTasksCompletionProgress.available
              : userTasksCompletionProgress.available
          }
          currentValue={
            currentTabIndex === 0
              ? teamTasksCompletionProgress.completed
              : userTasksCompletionProgress.completed
          }
          label={intl.get('TASKS.COMPLETED_PROGRESS_BAR_LABEL')}
          barClassName='max-w-35'
          containerClassName='w-80'
        />
      </div>
      {canAddTask && (
        <div className='absolute top-0 right-0 w-28'>
          <AddTaskModal renderText={addTaskButtonText} componentType='header' />
        </div>
      )}
      <div className='pt-4 px-6 flex-grow'>
        <Tabs
          index={currentTabIndex}
          onChange={(index: number) => setCurrentTabIndex(index)}
          tabListProps={{
            className: 'mb-4 w-58',
          }}
          type='tab'
          data={[
            {
              label: intl.get('TASKS.TEAM_TASKS'),
              content: (
                <div className=''>
                  <TasksTableFilters
                    taskTable={TASKS_TABLE_TABS.TEAM_TASKS}
                    assignees={teamTasksAssignees}
                    onExport={handleExportTasksToCsv}
                    exportEnabled={!isEmpty(selectedTasks)}
                  />
                  <TaskTable
                    tasksList={teamTasksList.data}
                    projectId={projectId}
                    taskTable={TASKS_TABLE_TABS.TEAM_TASKS}
                    onSelectTasks={setSelectedTasks}
                  />
                  <Pagination
                    total={teamTasksList.total}
                    onChange={handleUpdatePagination}
                    className='z-10 max-w-full'
                  />
                </div>
              ),
            },
            {
              label: intl.get('TASKS.MY_TASKS'),
              content: (
                <div className=''>
                  <TasksTableFilters
                    taskTable={TASKS_TABLE_TABS.MY_TASKS}
                    assignees={userTasksAssignees}
                    onExport={handleExportTasksToCsv}
                    exportEnabled={!isEmpty(selectedTasks)}
                  />
                  <TaskTable
                    tasksList={userTasksList.data}
                    projectId={projectId}
                    taskTable={TASKS_TABLE_TABS.MY_TASKS}
                    onSelectTasks={setSelectedTasks}
                  />
                  <Pagination
                    total={userTasksList.total}
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

export default Tasks;
