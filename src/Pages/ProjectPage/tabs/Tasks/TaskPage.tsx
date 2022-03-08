import { useEffect, useState, useMemo } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  Button,
  Typography,
  useElevation,
  Toggle,
} from '@getsynapse/design-system';
import { get, isEmpty, isEqual } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import {
  requiredFields,
  requiredFieldsErrorsMap,
  taskFields,
} from './helpers/constants';
import { OnHoldStatusBanner } from 'Pages/ProjectPage/components/Banners/Banners';
import {
  getAvailableProjectFiles,
  getLinkedTaskFiles,
  getUpdatedProjectFiles,
} from './helpers/files';
import { getDifference } from 'Pages/ProjectPage/helpers/updatedProjectData';
import { objKeyAsString, TaskDetailType, ProjectFile } from 'utils/customTypes';
import { PATHS, TASKS_MORE_ACTIONS, TASK_STATUS } from 'utils/constants';
import {
  fetchTask,
  getSingleTaskData,
  updateTask,
  updateTaskEnablement,
} from 'state/SingleTask/singleTaskSlice';
import {
  getProjectFiles,
  updateProjectFiles,
} from 'state/Project/projectSlice';
import useInlineNotification from 'Hooks/useInlineNotification';
import {
  fetchProject,
  getCurrentProjectData,
} from 'state/Project/projectSlice';
import MoreActionsDropdown from 'Pages/ProjectPage/tabs/Tasks/components/MoreActionsDropdown/MoreActionsDropdown';

import PageTitle from 'Molecules/PageTitle/PageTitle';
import TaskDetails from './components/TaskDetails';
import LinkTaskFilesTable from './components/LinkTaskFilesTable';
import TaskFilesLinking from './components/TaskFilesLinking';
import { deleteTask } from 'state/Tasks/taskSlice';

const TaskPage = () => {
  const { projectId, taskId } =
    useParams<{ projectId: string; taskId: string }>();
  const originProjectFilesList = useSelector(getProjectFiles);
  const [updatedProjectFilesList, setUpdatedProjectFilesList] = useState<
    ProjectFile[]
  >(originProjectFilesList);
  const headerElevation = useElevation(2);
  const footerElevation = useElevation(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const { showInlineNotification } = useInlineNotification();
  const fetchedTaskData = useSelector(getSingleTaskData);
  const [taskData, setTaskData] = useState<TaskDetailType>(fetchedTaskData);
  const [isUpdating, setIsUpdating] = useState(false);
  const projectData = useSelector(getCurrentProjectData);
  const [requiredFieldsErrors, setRequiredFieldsErrors] =
    useState<objKeyAsString>(requiredFieldsErrorsMap);
  const [disableSave, setDisableSave] = useState(true);
  const [dataToCompare, setDataToCompare] = useState<TaskDetailType>();

  useEffect(() => {
    dispatch(fetchTask(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    setUpdatedProjectFilesList(originProjectFilesList);
  }, [originProjectFilesList]);

  const linkedTaskFilesChanged = useMemo(
    () => !isEqual(originProjectFilesList, updatedProjectFilesList),
    [originProjectFilesList, updatedProjectFilesList]
  );

  useEffect(() => {
    const { assignedUsers, ...remainingTaskData } = fetchedTaskData;
    if (assignedUsers) {
      const ownersIds = assignedUsers?.map((owner: any) => owner.id);
      setTaskData({ ...remainingTaskData, assignedUsers: ownersIds });
      setDataToCompare({ ...remainingTaskData, assignedUsers: ownersIds });
    } else {
      setTaskData({ ...fetchedTaskData });
    }
  }, [fetchedTaskData]);

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!isEqual(taskData, taskFields)) {
      const changesDetected = !isEqual(dataToCompare, taskData);
      if ((changesDetected || linkedTaskFilesChanged) && disableSave) {
        setDisableSave(false);
      }
      if (!changesDetected && !linkedTaskFilesChanged && !disableSave) {
        setDisableSave(true);
      }
    }
  }, [taskData, disableSave, dataToCompare, linkedTaskFilesChanged]);

  const saveTaskData = (item: string, value: string | string[]) => {
    const dataToUpdate = {
      [item]: value,
    };

    setTaskData((prevData: TaskDetailType) => ({
      ...prevData,
      ...dataToUpdate,
    }));
  };

  const handleCancel = () => {
    history.push(`${PATHS.PROJECT_PAGE}/${projectId}?tab=tasks`);
  };

  const handleDisableTask = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateTaskEnablement({
        taskId,
        disabled: !event.target.checked,
      })
    );
  };

  const handleUpdateTask = async () => {
    setIsUpdating(true);
    const updatedTaskData = getDifference(taskData, dataToCompare!);
    await dispatch(
      updateTask({
        taskId,
        data: { ...updatedTaskData },
      })
    );
    if (linkedTaskFilesChanged) {
      await dispatch(
        updateProjectFiles({
          projectId,
          data: {
            data: { files: updatedProjectFilesList },
          },
        })
      );
    }
    setIsUpdating(false);
  };

  const handleSave = async () => {
    let canSave = true;
    let errorsMap: objKeyAsString = { ...requiredFieldsErrorsMap };
    const dateFields = ['start_date', 'due_date'];

    requiredFields.forEach((field) => {
      if (!dateFields.includes(field) && isEmpty(taskData[field])) {
        canSave = false;
        errorsMap[field] = true;
      } else {
        if (!(taskData[field] instanceof Date) && isEmpty(taskData[field])) {
          errorsMap[field] = true;
          canSave = false;
        }
      }
    });
    setRequiredFieldsErrors(errorsMap);
    setDisableSave(true);
    if (!canSave) {
      showInlineNotification(
        'error',
        intl.get('TASKS.TASK_DETAIL_PAGE.TASK_UPDATE_ERROR')
      );
    } else {
      await handleUpdateTask();
      showInlineNotification(
        'success',
        intl
          .get('TASKS.TASK_DETAIL_PAGE.UPDATE_SUCCESSFUL')
          .replace('Task', taskData?.name)
      );
      history.push(`${PATHS.PROJECT_PAGE}/${projectId}?tab=tasks`);
    }
  };

  const isViewOnlyMode =
    taskData.status === TASK_STATUS.ON_HOLD ||
    (taskData.status === TASK_STATUS.COMPLETED &&
      fetchedTaskData.actual_hours !== null) ||
    taskData.disabled;

  const availableProjectFilesForLinking = useMemo(
    () => getAvailableProjectFiles(taskData.id, updatedProjectFilesList),
    [taskData.id, updatedProjectFilesList]
  );

  const linkedTaskFilesList = useMemo(
    () => getLinkedTaskFiles(taskData.id, updatedProjectFilesList),
    [taskData.id, updatedProjectFilesList]
  );

  const linkUnlinkFileToTask = (file: ProjectFile) => {
    const updatedList = getUpdatedProjectFiles(
      taskData.id,
      file.metadata.handle,
      updatedProjectFilesList
    );
    setUpdatedProjectFilesList(updatedList);
  };

  const handleUnlinkFilesFromTask = () => {
    let wasListUpdated = false;
    const updatedFilesList = updatedProjectFilesList.map(
      (file: ProjectFile) => {
        if (file?.linkedTasks?.includes(taskId)) {
          const updatedLinkedTasks = file?.linkedTasks?.filter(
            (value: string) => value !== taskId
          );
          wasListUpdated = true;
          return { ...file, linkedTasks: updatedLinkedTasks };
        }
        return file;
      }
    );
    return { wasListUpdated, updatedFilesList };
  };

  const handleDeleteTask = async () => {
    const { wasListUpdated, updatedFilesList } = handleUnlinkFilesFromTask();
    await dispatch(deleteTask(taskId));
    if (wasListUpdated) {
      await dispatch(
        updateProjectFiles({
          projectId,
          data: {
            data: { files: updatedFilesList },
          },
        })
      );
    }
    showInlineNotification(
      'success',
      intl
        .get('TASKS.NOTIFICATIONS.TASK_DELETION_SUCCESS')
        .replace('Task', taskData?.name)
    );
    history.push(`${PATHS.PROJECT_PAGE}/${projectId}?tab=tasks`);
  };

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={`${get(projectData, 'title', '')}/${taskData?.name}`}
        dataCy='task-title'
      />

      <div className='bg-neutral-white mx-6 mt-2 z-5'>
        <div
          className={classNames(
            'w-full p-2 flex',
            'justify-end items-center',
            headerElevation
          )}
        >
          <Toggle
            offText={intl.get('TASKS.TASK_DETAIL_PAGE.ENABLE_TASK')}
            onChange={handleDisableTask}
            onText={intl.get('TASKS.TASK_DETAIL_PAGE.DISABLE_TASK')}
            className='mr-1 my-auto'
            checked={!taskData.disabled}
            toggleTextPosition='left'
            inputProps={{
              'data-testid': 'task-toggle-enablement',
            }}
          />

          <MoreActionsDropdown
            moreActionsOptions={[
              {
                value: TASKS_MORE_ACTIONS.DELETE,
                label: intl.get(
                  'TASKS.TASK_DETAIL_PAGE.MORE_ACTIONS_DROPDOWN.DELETE'
                ),
                iconName: 'trash',
                dataCy: 'delete-task-button',
              },
            ]}
            deleteTaskCallback={handleDeleteTask}
          />
        </div>
      </div>

      <div
        className='bg-neutral-white flex-grow overflow-y-auto mx-6'
        data-cy='task-form-body'
      >
        <div className='w-full px-4 pb-6'>
          {taskData.disabled && (
            <OnHoldStatusBanner
              message={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_DISABLED_WARNING')}
            />
          )}
          {taskData.status === TASK_STATUS.ON_HOLD && !taskData.disabled && (
            <OnHoldStatusBanner
              message={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_ON_HOLD_WARNING')}
            />
          )}
          <TaskDetails
            requiredFieldsErrors={requiredFieldsErrors}
            setData={saveTaskData}
            data={taskData}
            isViewOnly={isViewOnlyMode}
          />

          <div className='mt-10'>
            <Typography variant='h5' className='mt-8 mb-4'>
              {intl.get('TASKS.TASK_DETAIL_PAGE.TASK_FILES.TITLE')}
            </Typography>

            <LinkTaskFilesTable
              files={linkedTaskFilesList}
              onUnlinkFile={linkUnlinkFileToTask}
            />
            <TaskFilesLinking
              isViewOnly={isViewOnlyMode}
              availableItemsList={availableProjectFilesForLinking}
              onLikFile={linkUnlinkFileToTask}
              placeholder={intl.get(
                'TASKS.TASK_DETAIL_PAGE.TASK_FILES.PLACEHOLDER'
              )}
              triggerTitle={intl.get(
                'TASKS.TASK_DETAIL_PAGE.TASK_FILES.LINK_A_FILE'
              )}
            />
          </div>
        </div>
      </div>

      <div
        className={`w-full bg-neutral-white py-2 flex justify-end z-5 ${footerElevation}`}
      >
        <div className='flex space-x-4 mr-12'>
          <Button
            variant='secondary'
            onClick={handleCancel}
            data-cy='task-cancel-button'
          >
            {intl.get('TASKS.TASK_DETAIL_PAGE.CANCEL_UPDATES_BUTTON')}
          </Button>

          <Button
            disabled={isUpdating || disableSave || taskData.disabled}
            onClick={handleSave}
            data-cy='task-save-button'
          >
            {intl.get('TASKS.TASK_DETAIL_PAGE.SAVE_UPDATES_BUTTON')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
