import React, { useState, Dispatch, SetStateAction } from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'react-redux';
import { PickerFileMetadata } from 'filestack-js';
import { ProjectFile } from 'utils/customTypes';
import { FileUpload, Button } from '@getsynapse/design-system';
import config from 'config/Config';
import { selectUserId } from 'state/User/userSlice';

const AttachFile: React.FC<{
  onAttachFiles: (files: ProjectFile[]) => void;
  displayPicker: Dispatch<SetStateAction<string | null>>;
}> = ({ onAttachFiles, displayPicker }) => {
  const [displayCancelButton, setDisplayCancelButton] = useState(true);
  const currentUserId = useSelector(selectUserId);

  const handleUploadFiles = (files: PickerFileMetadata[]) => {
    if (files.length > 0) {
      const formattedFiles = files.map((file: PickerFileMetadata) => ({
        metadata: { ...file },
        uploadedBy: currentUserId!,
        uploadDate: new Date().toString(),
        linkedTasks: [],
      }));
      onAttachFiles(formattedFiles);
    }
  };

  return (
    <div className='w-full flex items-center'>
      <FileUpload
        className='mt-4 flex-1'
        config={config.get('fileStack')}
        displayUploadedFiles={false}
        onFileUploadHandle={handleUploadFiles}
        onFileDropHandle={() => setDisplayCancelButton(false)}
        onFileRejectHandle={() => setDisplayCancelButton(true)}
        hidePickerWhenUploading
        data-cy='project-file-picker'
      />
      {displayCancelButton && (
        <Button
          variant='tertiary'
          className='ml-6'
          onClick={() => displayPicker(null)}
          data-cy='cancel-file-attach-button'
        >
          {intl.get('PROJECT_DETAIL.FILES_TAB.CANCEL')}
        </Button>
      )}
    </div>
  );
};

export default AttachFile;
