import React, { Dispatch, SetStateAction, useState, useRef } from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { selectUserId } from 'state/User/userSlice';
import { ProjectFile } from 'utils/customTypes';
import { PROJECT_LINK_FILE_TYPE } from 'utils/constants';
import { Button, TextField, FormItem } from '@getsynapse/design-system';

const LinkFile: React.FC<{
  onLinkFile: (files: ProjectFile[]) => void;
  displayPicker: Dispatch<SetStateAction<string | null>>;
}> = ({ onLinkFile, displayPicker }) => {
  const [fieldErrors, setFieldErrors] = useState<{
    fileName: string;
    fileUrl: string;
  }>({ fileName: '', fileUrl: '' });
  const fileNameInputRef = useRef<HTMLInputElement | null>(null);
  const fileUrlInputRef = useRef<HTMLInputElement | null>(null);
  const currentUserId = useSelector(selectUserId);

  const validateRequiredFields = (
    fileName: string | undefined,
    fileUrl: string | undefined
  ) => {
    let canSubmit = true;
    const errors = { fileName: '', fileUrl: '' };
    if (fileName?.length === 0) {
      errors.fileName = intl.get(
        'PROJECT_DETAIL.FILES_TAB.REQUIRED_INFORMATION'
      );
      canSubmit = false;
    }
    if (fileUrl?.length === 0) {
      errors.fileUrl = intl.get(
        'PROJECT_DETAIL.FILES_TAB.REQUIRED_INFORMATION'
      );
      canSubmit = false;
    }
    setFieldErrors(errors);
    return canSubmit;
  };

  const handleLinkFile = () => {
    const fileName = fileNameInputRef.current?.value;
    const fileUrl = fileUrlInputRef.current?.value;
    const canSubmit = validateRequiredFields(fileName, fileUrl);
    if (canSubmit) {
      const formattedFile = {
        metadata: {
          handle: uuidv4(),
          filename: fileName!,
          url: fileUrl!,
          mimetype: PROJECT_LINK_FILE_TYPE,
        },
        uploadedBy: currentUserId!,
        uploadDate: new Date().toString(),
        linkedTasks: [],
      };
      onLinkFile([formattedFile]);
    }
  };

  return (
    <div className='w-full flex items-center mt-4'>
      <div className='flex flex-1'>
        <FormItem
          data-cy='link-file-name'
          className='w-2/5 mr-4'
          helpText={fieldErrors.fileName}
          helpTextProps={{
            state: fieldErrors.fileName ? 'error' : 'default',
          }}
        >
          <TextField
            ref={fileNameInputRef}
            placeholder={intl.get(
              'PROJECT_DETAIL.FILES_TAB.FILE_NAME_PLACEHOLDER'
            )}
            state={fieldErrors.fileName ? 'error' : 'default'}
            data-cy='link-file-name-input'
          />
        </FormItem>
        <FormItem
          data-cy='link-file-url'
          className='w-3/5'
          helpText={fieldErrors.fileUrl}
          helpTextProps={{ state: fieldErrors.fileUrl ? 'error' : 'default' }}
        >
          <TextField
            ref={fileUrlInputRef}
            placeholder={intl.get(
              'PROJECT_DETAIL.FILES_TAB.FILE_URL_PLACEHOLDER'
            )}
            state={fieldErrors.fileUrl ? 'error' : 'default'}
            data-cy='link-file-url-input'
          />
        </FormItem>
      </div>
      <div className='flex'>
        <Button
          variant='tertiary'
          className='ml-6'
          onClick={handleLinkFile}
          data-cy='confirm-link-file-button'
        >
          {intl.get('PROJECT_DETAIL.FILES_TAB.LINK')}
        </Button>
        <Button
          variant='tertiary'
          className='ml-2'
          onClick={() => displayPicker(null)}
          data-cy='cancel-link-file-button'
        >
          {intl.get('PROJECT_DETAIL.FILES_TAB.CANCEL')}
        </Button>
      </div>
    </div>
  );
};

export default LinkFile;
