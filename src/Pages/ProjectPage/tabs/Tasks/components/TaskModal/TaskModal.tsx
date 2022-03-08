import { Fragment, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';

import { Task, ProjectFile } from 'utils/customTypes';
import { useParams } from 'react-router-dom';
import useModal from 'Hooks/useModal';
import { createNewTask } from 'state/Tasks/taskSlice';
import {
  getProjectFiles,
  updateProjectFiles,
} from 'state/Project/projectSlice';
import { get } from 'lodash';
import TaskForm from './TaskForm';
import { taskModalFields } from '../../helpers/constants';
import useInlineNotification from 'Hooks/useInlineNotification';

const TaskModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskData: Task;
  duplicateTaskCheck: boolean;
}> = ({ isOpen, setIsOpen, taskData, duplicateTaskCheck }) => {
  const { Modal, modalProps } = useModal();
  const dispatch = useDispatch();
  const { showInlineNotification } = useInlineNotification();
  const { projectId } = useParams<{ projectId: string }>();
  const originProjectFilesList = useSelector(getProjectFiles);
  const [updatedProjectFilesList, setUpdatedProjectFilesList] = useState<
    ProjectFile[]
  >(originProjectFilesList);
  const [canCreateTask, setCanCreateTask] = useState(false);
  const [taskFields, setTaskFields] = useState(taskModalFields);

  useEffect(() => {
    if (duplicateTaskCheck) {
      setUpdatedProjectFilesList(originProjectFilesList);
    }
  }, [originProjectFilesList, duplicateTaskCheck]);

  const handleAddTaskIdToFile = (newTaskId: any) => {
    let wasListUpdated = false;
    const updatedFilesList = updatedProjectFilesList.map(
      (file: ProjectFile) => {
        if (file?.linkedTasks?.includes(taskData.id)) {
          const updatedLinkedTasks = file?.linkedTasks?.concat(newTaskId);
          wasListUpdated = true;
          return { ...file, linkedTasks: updatedLinkedTasks };
        }
        return file;
      }
    );
    return { wasListUpdated, updatedFilesList };
  };

  const addTask = async () => {
    let taskData = { ...taskFields };
    const duplicatedTaskData = await dispatch(createNewTask(taskData));
    if (duplicateTaskCheck) {
      const duplicatedTaskId = get(duplicatedTaskData, 'payload.id', '');
      if (duplicatedTaskId != null) {
        const { wasListUpdated, updatedFilesList } =
          handleAddTaskIdToFile(duplicatedTaskId);
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
          intl.get('TASKS.NOTIFICATIONS.TASK_DUPLICATION_SUCCESS')
        );
      }
    } else {
      showInlineNotification(
        'success',
        intl.get('TASKS.NOTIFICATIONS.TASK_CREATION_SUCCESS')
      );
    }
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Modal
        {...modalProps}
        aria-label={intl.get('TASKS.ADD_TASK_MODAL.TITLE')}
        closeModal={() => setIsOpen(false)}
        data-cy='add-tasks-modal'
        title={intl.get('TASKS.ADD_TASK_MODAL.TITLE')}
        size='large'
        className='h-full'
        isOpen={isOpen}
        actionButtons={[
          {
            children: intl.get('TEAMS.SAVE'),
            variant: 'primary',
            'data-cy': 'confirm-button',
            disabled: !canCreateTask,
            onClick: addTask,
          },
          {
            children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.CANCEL'),
            variant: 'tertiary',
            onClick: () => setIsOpen(false),
            'data-cy': 'cancel-button',
          },
        ]}
      >
        <TaskForm
          taskData={taskData}
          canCreateTask={canCreateTask}
          duplicateTaskCheck={duplicateTaskCheck}
          projectId={projectId}
          setCanCreateTask={setCanCreateTask}
          setTaskFields={setTaskFields}
        />
      </Modal>
    </Fragment>
  );
};

export default TaskModal;
