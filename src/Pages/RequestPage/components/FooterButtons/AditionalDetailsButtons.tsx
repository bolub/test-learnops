import { Fragment, useContext } from 'react';
import intl from 'react-intl-universal';
import { RequestPageTabs } from 'utils/customTypes';
import NavigationButton from './NavigationButton';
import ActionButton from './ActionButton';
import { RequestContext } from 'Pages/RequestPage/RequestPage';

export const AditionalDetailsButtons = ({
  onClickHandler,
  onCancel,
  onUpdate,
  hasErrors,
  isLDUser,
}: {
  onClickHandler: (value?: RequestPageTabs) => void;
  onCancel: () => void;
  onUpdate: () => Promise<void>;
  hasErrors: boolean;
  isLDUser: boolean;
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
        tabIndex={1}
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

        <ActionButton
          action={onUpdate}
          variant={isLDUser ? 'secondary' : 'primary'}
          hasErrors={hasErrors}
          testId='request_update-button'
          disabled={disableSaveButtons}
        >
          {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_EXIT')}
        </ActionButton>

        {isLDUser && (
          <NavigationButton
            onClickHandler={onClickHandler}
            variant='primary'
            tabIndex={3}
            label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.NEXT')}
            iconName='caret-forward-outline'
            iconPosition='right'
            testId='request_next-button'
          />
        )}
      </div>
    </Fragment>
  );
};

export default AditionalDetailsButtons;
