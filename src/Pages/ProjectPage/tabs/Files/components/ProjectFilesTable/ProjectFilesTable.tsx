import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Typography, Button } from '@getsynapse/design-system';
import {
  selectLDUsers,
  getLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { selectAllTasks, fetchTeamTasks } from 'state/Tasks/taskSlice';
import {
  readableFileSize,
  getFileTypeFromName,
} from 'Pages/ProjectPage/helpers/files';
import { ProjectFile, LDUser, Task } from 'utils/customTypes';
import { DATE, PROJECT_LINK_FILE_TYPE, PATHS } from 'utils/constants';

const ProjectFilesTable: React.FC<{
  files: ProjectFile[];
  onRemoveFile: (files: ProjectFile[], successMessage: string) => void;
  projectId: string;
}> = ({ files, onRemoveFile, projectId }) => {
  const dispatch = useDispatch();
  const ldUsers = useSelector(selectLDUsers);
  const projectTasks = useSelector(selectAllTasks);

  useEffect(() => {
    dispatch(getLDUsers());
    dispatch(fetchTeamTasks(projectId));
  }, [dispatch, projectId]);

  const getLDUserName = (userId: string) => {
    const foundUser = ldUsers.find((user: LDUser) => user.id === userId);
    return foundUser
      ? `${foundUser.data.firstName} ${foundUser.data.lastName}`
      : '';
  };

  const handleDeleteFile = (
    fileToRemove: ProjectFile,
    isLinkFileType: boolean
  ) => {
    const successMessage = isLinkFileType
      ? intl.get('PROJECT_DETAIL.FILES_TAB.FILE_UNLINK_SUCCESS')
      : intl.get('PROJECT_DETAIL.FILES_TAB.FILE_DELETE_SUCCESS');
    const updatedFilesList = files.filter(
      (file: ProjectFile) =>
        file.metadata.handle !== fileToRemove.metadata.handle
    );
    onRemoveFile(updatedFilesList, successMessage);
  };

  const getTaskTitle = (taskId: string) => {
    const foundTask = projectTasks.find((task: Task) => task.id === taskId);
    if (foundTask) {
      return foundTask.name;
    }
    return null;
  };

  const getLinkedTasksList = (linkedTasks: string[] = []) => {
    if (linkedTasks.length === 0) {
      return (
        <Typography variant='label' className='text-neutral'>
          {intl.get('PROJECT_DETAIL.FILES_TAB.TABLE.NO_TASKS')}
        </Typography>
      );
    }
    const taskNamesList = [];
    for (const taskId of linkedTasks) {
      const taskName = getTaskTitle(taskId);
      if (taskName !== null) {
        taskNamesList.push(
          <Typography variant='body2' className='text-primary mb-1 last:mb-0'>
            <Link to={`${PATHS.PROJECT_PAGE}/${projectId}/tasks/${taskId}`}>
              {taskName}
            </Link>
          </Typography>
        );
      }
    }
    return taskNamesList;
  };

  return (
    <Table
      data-cy='project-files-table'
      canSelectRows={false}
      className='w-full mt-4'
      data={{
        headData: {
          headCells: [
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.FILE_SIZE'
              ),
            },
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.FILE_TYPE'
              ),
            },
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.FILE_NAME'
              ),
            },
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.UPLOADED_BY'
              ),
            },
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.UPLOADED_DATE'
              ),
            },
            {
              content: intl.get(
                'PROJECT_DETAIL.FILES_TAB.TABLE.COLUMNS.TASKS_LINKED'
              ),
            },
            {
              content: <div></div>,
              className: 'w-20',
            },
          ],
        },
        rows: files.map((file: ProjectFile) => {
          return {
            className: 'text-neutral-black',
            cells: [
              {
                content:
                  file.metadata.mimetype !== PROJECT_LINK_FILE_TYPE &&
                  file.metadata?.size &&
                  readableFileSize(file.metadata.size),
              },
              {
                content:
                  file.metadata.mimetype === PROJECT_LINK_FILE_TYPE
                    ? intl
                        .get('PROJECT_DETAIL.FILES_TAB.LINK')
                        .toLocaleLowerCase()
                    : getFileTypeFromName(file.metadata.filename),
                className: 'font-semibold',
              },
              {
                content:
                  file.metadata.mimetype === PROJECT_LINK_FILE_TYPE ? (
                    <a
                      href={file.metadata.url}
                      target='_blank'
                      className='text-primary'
                      rel='noreferrer'
                    >
                      {file.metadata.filename}
                    </a>
                  ) : (
                    file.metadata.filename
                  ),
              },
              {
                content: getLDUserName(file.uploadedBy),
                className: 'font-semibold',
              },
              {
                content:
                  file.uploadDate &&
                  moment(new Date(file.uploadDate)).format(DATE.SHORT_FORMAT),
              },
              {
                content: getLinkedTasksList(file.linkedTasks),
              },
              {
                content: (
                  <Button
                    variant='tertiary'
                    size='small'
                    data-cy='delete-file-button'
                    onClick={() =>
                      handleDeleteFile(
                        file,
                        file.metadata.mimetype === PROJECT_LINK_FILE_TYPE
                      )
                    }
                  >
                    {file.metadata.mimetype === PROJECT_LINK_FILE_TYPE
                      ? intl.get('PROJECT_DETAIL.FILES_TAB.TABLE.UNLINK')
                      : intl.get('PROJECT_DETAIL.FILES_TAB.TABLE.DELETE')}
                  </Button>
                ),
                className: 'w-20',
              },
            ],
          };
        }),
      }}
      emptyComponent={
        <div className='flex items-center justify-center bg-neutral-white h-12'>
          <Typography variant='label' className='text-neutral'>
            {intl.get('PROJECT_DETAIL.FILES_TAB.NO_FILES')}
          </Typography>
        </div>
      }
    />
  );
};

export default ProjectFilesTable;
