import { MouseEvent, Fragment } from 'react';
import intl from 'react-intl-universal';
import { tailwindOverride, Button } from '@getsynapse/design-system';

type FormFooterButtonsProps = {
  onTabChange?: (currentIndex: number) => void;
  currentTab?: number;
  onSave: () => void;
  onCancel: () => void;
  canSubmit: boolean;
  saveButtonLabel?: string;
  isNew?: boolean;
};

const FormFooterButtons = ({
  currentTab = 0,
  onTabChange = () => {},
  onSave,
  onCancel,
  canSubmit,
  saveButtonLabel = intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.SAVE_EXIT'),
  isNew = false,
}: FormFooterButtonsProps) => {
  return (
    <div
      className={tailwindOverride(
        'h-12 z-5 px-8 w-full',
        'flex-shrink-0 space-x-4',
        'bg-neutral-white',
        'flex items-center',
        'shadow-lifted',
        'absolute bottom-0 z-50',
        { 'justify-end': currentTab === 0 },
        { 'justify-between': currentTab === 1 }
      )}
    >
      {currentTab === 0 && (
        <Fragment>
          <Button
            variant='tertiary'
            size='small'
            type='button'
            onClick={onCancel}
          >
            {intl.get('CANCEL')}
          </Button>
          {!isNew && (
            <Button
              variant='secondary'
              type='button'
              disabled={!canSubmit}
              onClick={onSave}
              data-cy='from-save-exit_button'
            >
              {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_EXIT')}
            </Button>
          )}
          <Button
            type='button'
            iconName='caret-forward-outline'
            iconPosition='right'
            onClick={(event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
              event.preventDefault();
              onTabChange(currentTab + 1);
            }}
            data-cy='from-next_button'
          >
            {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.NEXT')}
          </Button>
        </Fragment>
      )}

      {currentTab === 1 && (
        <Fragment>
          <Button
            variant='secondary'
            type='button'
            iconName='caret-back-outline'
            iconPosition='left'
            onClick={(event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
              event.preventDefault();
              onTabChange(currentTab - 1);
            }}
          >
            {intl.get('REQUEST_PAGE.REQUEST_DETAILS.BUTTON.BACK')}
          </Button>
          <div className='flex space-x-4'>
            <Button variant='tertiary' type='button' onClick={onCancel}>
              {intl.get('CANCEL')}
            </Button>

            <Button
              type='button'
              disabled={!canSubmit}
              onClick={onSave}
              data-cy='from-save-exit_button'
            >
              {saveButtonLabel}
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default FormFooterButtons;
