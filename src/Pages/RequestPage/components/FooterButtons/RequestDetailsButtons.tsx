import { Fragment, useContext } from 'react';
import intl from 'react-intl-universal';
import { REQUEST_STATUS } from 'utils/constants';
import { RequestPageTabs } from 'utils/customTypes';
import NavigationButton from './NavigationButton';
import ActionButton from './ActionButton';
import { RequestContext } from 'Pages/RequestPage/RequestPage';

const RequestDetailsButtons = ({
  requestStatus,
  onClickHandler,
  onCancel,
  onSubmit,
  onUpdate,
  hasErrors,
}: {
  requestStatus: string;
  onClickHandler: (value?: RequestPageTabs) => void;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
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
        onClickHandler={onClickHandler}
        variant='secondary'
        tabIndex={0}
        label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.BACK')}
        iconName='caret-back-outline'
        iconPosition='left'
      />

      <div className='flex space-x-4'>
        <NavigationButton
          onClickHandler={onCancel}
          variant='tertiary'
          label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.CANCEL')}
        />
        {requestStatus === REQUEST_STATUS.DRAFT ? (
          <Fragment>
            <ActionButton
              testId='request_save-exit-button'
              action={onUpdate}
              variant='secondary'
              hasErrors={hasErrors}
              disabled={disableSaveButtons}
            >
              {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.SAVE_EXIT')}
            </ActionButton>
            <ActionButton
              testId='request_submit-button'
              action={onSubmit}
              variant='primary'
              hasErrors={hasErrors}
              disabled={disableSaveButtons}
            >
              {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.SUBMIT')}
            </ActionButton>
          </Fragment>
        ) : (
          <Fragment>
            <ActionButton
              action={onUpdate}
              variant='secondary'
              hasErrors={hasErrors}
              testId='request_update-button'
              disabled={disableSaveButtons}
            >
              {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_EXIT')}
            </ActionButton>
            <NavigationButton
              onClickHandler={onClickHandler}
              variant='primary'
              tabIndex={2}
              label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.NEXT')}
              iconName='caret-forward-outline'
              iconPosition='right'
              testId='request_next-button'
            />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default RequestDetailsButtons;
