import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Table, Button } from '@getsynapse/design-system';
import { ProjectFile, LDUser } from 'utils/customTypes';
import {
  selectLDUsers,
  getLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import {
  readableFileSize,
  getFileTypeFromName,
} from 'Pages/ProjectPage/helpers/files';
import { DATE, PROJECT_LINK_FILE_TYPE } from 'utils/constants';

const LinkTaskFilesTable: React.FC<{
  files: Array<ProjectFile>;
  isViewOnly?: boolean;
  onUnlinkFile: (file: ProjectFile) => void;
}> = ({ files = [], isViewOnly = false, onUnlinkFile }) => {
  const dispatch = useDispatch();
  const ldUsers = useSelector(selectLDUsers);

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

  const getLDUserName = (userId: string) => {
    const foundUser = ldUsers.find((user: LDUser) => user.id === userId);
    return foundUser
      ? `${foundUser.data.firstName} ${foundUser.data.lastName}`
      : '';
  };

  return (
    <div className='w-full px-1'>
      <Table
        data-cy='linked-task-files-table'
        className='w-full px-1 mb-5'
        canSelectRows={false}
        emptyComponent={
          <div className='h-12 flex justify-center items-center text-neutral'>
            {intl.get('TASKS.TASK_DETAIL_PAGE.TASK_FILES.NO_FILES_ATTACHED')}
          </div>
        }
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
                content: <div></div>,
                className: 'w-20',
              },
            ],
          },
          rows: files.map((file: ProjectFile) => ({
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
                content: (
                  <Button
                    variant='tertiary'
                    size='small'
                    data-cy='unlink-file-button'
                    onClick={() => onUnlinkFile(file)}
                  >
                    {intl.get('PROJECT_DETAIL.FILES_TAB.TABLE.UNLINK')}
                  </Button>
                ),
                className: 'w-20 flex items-center justify-center',
              },
            ],
          })),
        }}
      />
    </div>
  );
};

export default LinkTaskFilesTable;
