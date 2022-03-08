import { RequestContext } from 'Pages/RequestPage/RequestPage';
import { Fragment, useContext } from 'react';
import intl from 'react-intl-universal';
import { REQUEST_STATUS } from 'utils/constants';
import { RequestPageTabs } from 'utils/customTypes';
import ActionButton from './ActionButton';
import NavigationButton from './NavigationButton';

const BasicDetailsButtons = ({
  requestStatus,
  onClickHandler,
  onCancel,
  onUpdate,
  hasErrors,
}: {
  requestStatus: string;
  onClickHandler: (value?: RequestPageTabs) => void;
  onCancel: () => void;
  onUpdate: () => Promise<void>;
  hasErrors: boolean;
}) => {
  const { areBasicAndRequestDisabled, isAdditionalDisabled, isLDDisabled } =
    useContext(RequestContext);
  const disableSaveButtons =
    areBasicAndRequestDisabled && isAdditionalDisabled && isLDDisabled;

  return (
    <Fragment>
      <NavigationButton
        onClickHandler={onCancel}
        variant='tertiary'
        label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.CANCEL')}
      />

      <div className='flex space-x-4'>
        <ActionButton
          action={onUpdate}
          variant='secondary'
          hasErrors={hasErrors}
          testId='request_update-button'
          disabled={disableSaveButtons}
        >
          {requestStatus === REQUEST_STATUS.DRAFT
            ? intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.SAVE_EXIT')
            : intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_EXIT')}
        </ActionButton>

        <NavigationButton
          onClickHandler={onClickHandler}
          variant='primary'
          tabIndex={1}
          label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.NEXT')}
          iconName='caret-forward-outline'
          iconPosition='right'
          testId='request_next-button'
          disabled={!requestStatus}
        />
      </div>
    </Fragment>
  );
};

export default BasicDetailsButtons;
