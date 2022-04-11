import intl from 'react-intl-universal';
import classnames from 'classnames';
import { Button, useElevation } from '@getsynapse/design-system';

interface Props {
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
  saveDisabled: boolean;
}

const GeneralSettingsFooter = ({
  isLoading,
  saveDisabled,
  onCancel,
  onSave,
}: Props) => {
  const footerElevation = useElevation(2);

  return (
    <div
      className={classnames(
        footerElevation,
        'bg-neutral-white',
        'fixed bottom-0 left-0 right-0',
        'flex justify-end',
        'py-2 pr-12 space-x-4'
      )}
    >
      <Button onClick={onCancel} variant='tertiary'>
        {intl.get('CANCEL')}
      </Button>

      <Button
        disabled={saveDisabled}
        loading={isLoading}
        onClick={onSave}
        variant='primary'
      >
        {intl.get('SAVE')}
      </Button>
    </div>
  );
};

export default GeneralSettingsFooter;
