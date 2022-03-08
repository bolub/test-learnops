import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Button } from '@getsynapse/design-system';
import { Project, Request } from 'utils/customTypes';

import Autocomplete from 'Molecules/Autocomplete/Autocomplete';

const ProjectRequestsLinking: React.FC<{
  triggerTitle: string;
  availableItemsList?: Project[] | Request[];
  onLinkItem: (item: any) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({
  triggerTitle,
  availableItemsList = [],
  onLinkItem = () => {},
  placeholder,
  disabled = false,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAutocompleteDisplayed, setIsAutocompleteDisplayed] = useState(false);
  const toggleAutocomplete = () =>
    setIsAutocompleteDisplayed((prevState) => !prevState);
  const cancelButtonClickHandle = () => {
    setSelectedItem(null);
    toggleAutocomplete();
  };
  const linkRequestToProjectHandle = () => {
    if (selectedItem) {
      onLinkItem(selectedItem);
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
              onSelectOption={(option: Project | Request) =>
                setSelectedItem(option)
              }
              onClearSelectedOptions={() => setSelectedItem(null)}
              getOptionLabel={(option: Project | Request) => option.title!}
              filterOptions={(options: any[], filterValue: string) =>
                options.filter((option: Project | Request) =>
                  option.title
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
              data-cy='cancel-project-link-to-table'
            >
              {intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.CANCEL')}
            </Button>
            <Button
              variant='tertiary'
              disabled={!selectedItem}
              onClick={linkRequestToProjectHandle}
              data-cy='add-to-linked-projects-table'
            >
              {intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.LINK')}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleAutocomplete}
          iconName='add-circle'
          variant='tertiary'
          data-cy='request-search-projects-to-link'
          disabled={disabled}
        >
          {triggerTitle}
        </Button>
      )}
    </div>
  );
};

export default ProjectRequestsLinking;
