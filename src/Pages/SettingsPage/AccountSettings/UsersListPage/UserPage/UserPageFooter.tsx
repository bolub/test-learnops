import { Button, useElevation } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router';
import { PATHS } from 'utils/constants';

const UserPageFooter = ({
  disableSave,
  onUpdate,
  newUser,
}: {
  disableSave: boolean;
  onUpdate: () => void;
  newUser: boolean;
}) => {
  const elevationClass = useElevation(2);
  const history = useHistory();

  const onCancel = () => {
    history.push(PATHS.SETTINGS);
  };

  return (
    <div
      className={`${elevationClass} h-12 flex items-center justify-end bg-neutral-white pr-12 py-2 fixed bottom-0 left-0 right-0`}
    >
      <Button variant='tertiary' className='mr-4' onClick={onCancel}>
        {intl.get('CANCEL')}
      </Button>
      <Button
        disabled={disableSave}
        onClick={onUpdate}
        data-cy='update-user_button'
      >
        {newUser
          ? intl.get('SAVE')
          : intl.get('SETTINGS_PAGE.USER_PAGE.FOOTER.UPDATE_BUTTON')}
      </Button>
    </div>
  );
};

export default UserPageFooter;
