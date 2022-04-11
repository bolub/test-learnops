import { FormItem, FileUpload } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import { useState } from 'react';
import config from 'config/Config';
import { PickerFileMetadata } from 'filestack-js';
import get from 'lodash/get';

const FileUploadQuestion = ({
  question,
  className,
  handler,
  isEditing,
  disabled,
}: intakeQuestionWrapper) => {
  const [currentFiles, setCurrentFiles] = useState<Array<PickerFileMetadata>>(
    question.data.value || []
  );

  return (
    <>
      {question.data.label?.trim() && (
        <FormItem
          label={!isEditing ? question.data.label : undefined}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <FileUpload
            uploadInstructions={get(question, 'data.placeholder')}
            config={config.get('fileStack')}
            onFileUploadHandle={(files: Array<PickerFileMetadata>) => {
              setCurrentFiles((prevFiles: Array<PickerFileMetadata>) => {
                const newFiles = prevFiles.concat(files);
                handler(question, newFiles, 'data.value');

                return newFiles;
              });
            }}
            onFileRemoveHandle={(handle: string) => {
              setCurrentFiles((prevFiles: Array<PickerFileMetadata>) => {
                const newFiles = prevFiles.filter(
                  (file: PickerFileMetadata) => file.handle !== handle
                );
                handler(question, newFiles, 'data.value');

                return newFiles;
              });
            }}
            files={currentFiles}
            disabled={disabled}
          />
        </FormItem>
      )}
    </>
  );
};

export default FileUploadQuestion;
