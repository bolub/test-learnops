import { Fragment, useContext } from 'react';
import intl from 'react-intl-universal';
import { RequestPageTabs } from 'utils/customTypes';
import NavigationButton from './NavigationButton';
import ActionButton from './ActionButton';
import { RequestContext } from 'Pages/RequestPage/RequestPage';

export const LDOnlyButton = ({
  onClickHandler,
  onUpdate,
  onCancel,
  hasErrors,
}: {
  onClickHandler: (value?: RequestPageTabs) => void;
  onUpdate: () => Promise<void>;
  onCancel: () => void;
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
        tabIndex={2}
        label={intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.BACK')}
        iconName='caret-back-outline'
        iconPosition='left'
      />
      <div className='flex space-x-4'>
        <NavigationButton
          onClickHandler={onCancel}
          variant='tertiary'
          label={intl.get('CANCEL')}
        />

        <ActionButton
          action={onUpdate}
          variant='primary'
          hasErrors={hasErrors}
          testId='request_update-button'
          disabled={disableSaveButtons}
        >
          {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_REQUEST')}
        </ActionButton>
      </div>
    </Fragment>
  );
};

export default LDOnlyButton;
