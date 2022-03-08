import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Button } from '@getsynapse/design-system';
import { ProjectFile } from 'utils/customTypes';
import Autocomplete from 'Molecules/Autocomplete/Autocomplete';

const TaskFilesLinking: React.FC<{
  availableItemsList: ProjectFile[];
  onLikFile: (file: ProjectFile) => void;
  triggerTitle: string;
  placeholder?: string;
  isViewOnly?: boolean;
}> = ({
  triggerTitle,
  placeholder,
  onLikFile,
  availableItemsList,
  isViewOnly = false,
}) => {
  const [selectedItem, setSelectedItem] = useState<ProjectFile | null>(null);
  const [isAutocompleteDisplayed, setIsAutocompleteDisplayed] = useState(false);

  const toggleAutocomplete = () =>
    setIsAutocompleteDisplayed((prevState) => !prevState);

  const cancelButtonClickHandle = () => {
    setSelectedItem(null);
    toggleAutocomplete();
  };
  const linkFileToTask = async () => {
    if (selectedItem) {
      onLikFile(selectedItem);
      cancelButtonClickHandle();
    }
  };
  return (
    <div className='pb-1 px-1'>
      {isAutocompleteDisplayed ? (
        <div className='flex items-center justify-between'>
          <div className='flex-1 mr-4'>
            <Autocomplete
              className='w-full'
              options={availableItemsList}
              values={selectedItem ? [selectedItem] : []}
              placeholder={placeholder}
              onSelectOption={(file: ProjectFile) => setSelectedItem(file)}
              onClearSelectedOptions={() => setSelectedItem(null)}
              getOptionLabel={(option: ProjectFile) => option.metadata.filename}
              filterOptions={(options: ProjectFile[], filterValue: string) =>
                options.filter((option: ProjectFile) =>
                  option.metadata.filename
                    ?.toLowerCase()
                    .includes(filterValue.toLowerCase())
                )
              }
            />
          </div>
          <div className='flex'>
            <Button
              className='mr-4'
              variant='tertiary'
              onClick={toggleAutocomplete}
              data-cy='cancel-link-files-to-task'
            >
              {intl.get('TASKS.TASK_DETAIL_PAGE.CANCEL_LINK_FILE_TO_TASK')}
            </Button>
            <Button
              variant='tertiary'
              disabled={!selectedItem}
              onClick={linkFileToTask}
              data-cy='add-to-linked-files-table'
            >
              {intl.get('TASKS.TASK_DETAIL_PAGE.LINK_FILE_TO_TASK')}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          disabled={isViewOnly}
          onClick={toggleAutocomplete}
          iconName='add-circle'
          variant='tertiary'
          data-cy='search-files-to-link'
        >
          {triggerTitle}
        </Button>
      )}
    </div>
  );
};

export default TaskFilesLinking;
