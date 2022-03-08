import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@getsynapse/design-system';
import { updateProjectFiles } from 'state/Project/projectSlice';
import { ProjectFile } from 'utils/customTypes';
import { PROJECT_FILES_PICKER } from 'utils/constants';
import { getProjectFiles } from 'state/Project/projectSlice';
import useInlineNotification from 'Hooks/useInlineNotification';
import AttachFile from './components/AttachFile/AttachFile';
import LinkFile from './components/LinkFile/LinkFile';
import ProjectFilesTable from './components/ProjectFilesTable/ProjectFilesTable';

const Files: React.FC<{ projectId: string }> = ({ projectId }) => {
  const dispatch = useDispatch();
  const projectFiles = useSelector(getProjectFiles);
  const [uploadedFiles, setUploadedFiles] = useState<ProjectFile[]>([]);
  const [picker, setPicker] = useState<string | null>(null);
  const { showInlineNotification } = useInlineNotification();

  const handleUpdateProjectFiles = async (
    files: ProjectFile[],
    successMessage: string
  ) => {
    await dispatch(
      updateProjectFiles({
        projectId,
        data: {
          data: { files },
        },
      })
    );
    setPicker(null);
    showInlineNotification('success', successMessage);
  };

  const handleUploadOrLinkFiles = (files: ProjectFile[]) => {
    const successMessage =
      picker === PROJECT_FILES_PICKER.ATTACH_FILE
        ? intl.get('PROJECT_DETAIL.FILES_TAB.FILE_UPLOAD_SUCCESS')
        : intl.get('PROJECT_DETAIL.FILES_TAB.FILE_LINK_SUCCESS');
    setUploadedFiles((prevFiles: ProjectFile[]) => {
      const updatedFilesArray = prevFiles.concat(files);
      handleUpdateProjectFiles(updatedFilesArray, successMessage);
      return updatedFilesArray;
    });
  };

  useEffect(() => {
    setUploadedFiles(projectFiles);
  }, [projectFiles]);

  return (
    <div className='h-full py-4 px-6'>
      <div className='h-full bg-neutral-white px-4 py-6 flex flex-col'>
        <Typography variant='h5' className='text-neutral-black'>
          {intl.get('PROJECT_DETAIL.FILES_TAB.TITLE')}
        </Typography>
        <ProjectFilesTable
          projectId={projectId}
          files={uploadedFiles}
          onRemoveFile={handleUpdateProjectFiles}
        />
        {picker === null && (
          <div className='mt-4 flex'>
            <Button
              className='mr-2'
              onClick={() => setPicker(PROJECT_FILES_PICKER.ATTACH_FILE)}
              data-cy='attach-file-button'
            >
              {intl.get('PROJECT_DETAIL.FILES_TAB.ATTACH_FILE')}
            </Button>
            <Button
              variant='secondary'
              onClick={() => setPicker(PROJECT_FILES_PICKER.LINK_FILE)}
              data-cy='link-file-button'
            >
              {intl.get('PROJECT_DETAIL.FILES_TAB.LINK_FILE')}
            </Button>
          </div>
        )}
        {picker === PROJECT_FILES_PICKER.ATTACH_FILE && (
          <AttachFile
            onAttachFiles={handleUploadOrLinkFiles}
            displayPicker={setPicker}
          />
        )}
        {picker === PROJECT_FILES_PICKER.LINK_FILE && (
          <LinkFile
            onLinkFile={handleUploadOrLinkFiles}
            displayPicker={setPicker}
          />
        )}
      </div>
    </div>
  );
};

export default Files;
