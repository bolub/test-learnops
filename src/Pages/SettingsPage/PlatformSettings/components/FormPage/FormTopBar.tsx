import { ChangeEvent, useMemo } from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { Toggle, tailwindOverride } from '@getsynapse/design-system';
import { Form, MoreActionsOption } from 'utils/customTypes';
import { FORMS_TABLE_OPTIONS } from 'utils/constants';
import MoreActions from 'Organisms/MoreActions/MoreActions';

type FormTopBarProps = {
  handlePublishUnpublish: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  formObj: Form;
};
const FormTopBar = ({
  formObj,
  handlePublishUnpublish,
  onDelete,
}: FormTopBarProps) => {
  const isChecked = useMemo(
    () => get(formObj, 'data.published', false),
    [formObj]
  );

  const moreOptions = useMemo(
    () => [
      {
        value: FORMS_TABLE_OPTIONS[1],
        label: intl.get('SETTINGS_PAGE.FORMS.DELETE.DELETE_FORM'),
        iconName: 'trash',
      },
    ],
    []
  );

  const handleActions = (option: MoreActionsOption) => {
    switch (option.value) {
      case FORMS_TABLE_OPTIONS[1]:
        onDelete();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={tailwindOverride(
        'mx-6 mt-2 p-2',
        'bg-neutral-white relative',
        'z-5 shadow-lifted h-12',
        'flex items-center justify-end'
      )}
    >
      <Toggle
        label={intl.get('SETTINGS_PAGE.FORMS.PUBLISH')}
        labelProps={{ className: 'mb-0 mr-2 font-normal' }}
        inputProps={{ 'data-cy': 'form_publish-unpublish' }}
        className='flex items-center mr-4'
        isSmall
        checked={isChecked}
        onChange={handlePublishUnpublish}
      />

      <MoreActions options={moreOptions} onSelectOption={handleActions} />
    </div>
  );
};

export default FormTopBar;
