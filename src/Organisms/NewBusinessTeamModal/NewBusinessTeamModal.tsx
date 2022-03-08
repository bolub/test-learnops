import isEmpty from 'lodash/isEmpty';
import {
  Button,
  FormItem,
  Modal,
  TextArea,
  Typography,
} from '@getsynapse/design-system';
import { useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { createBusinessTeam } from 'state/BusinessTeams/businessTeamsSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';

const ADD_BUSINESS_TEAM_FORM = 'add_business_team_form';

const NewBusinessTeamModal = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setIsLoading(false);
  };

  const onSubmit = useCallback<
    (event: React.FormEvent<HTMLFormElement>) => void
  >(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      await dispatch(
        createBusinessTeam({
          title,
          description,
        })
      );
      dispatch(setNotificationText(intl.get('ADD_TEAM_MODAL.SUCCESS_MESSAGE')));
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
      onClose();
    },
    [description, dispatch, title]
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        data-testid='add-business-team_button'
      >
        {intl.get('ADD_A_TEAM')}
      </Button>

      <Modal
        actionButtons={[
          {
            children: intl.get('SAVE'),
            variant: 'primary',
            form: ADD_BUSINESS_TEAM_FORM,
            'data-cy': 'save-new-business-team',
            disabled: isEmpty(title),
            loading: isLoading,
          },
          {
            children: intl.get('CANCEL'),
            variant: 'tertiary',
            onClick: onClose,
            'data-cy': 'cancel-button',
          },
        ]}
        data-testid='add-business-team_modal'
        aria-label={intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM')}
        closeModal={onClose}
        isOpen={isOpen}
        size='large'
        title={intl.get('ADD_A_TEAM')}
      >
        <Typography className='text-neutral-black mb-4' variant='body'>
          {intl.get('ADD_TEAM_MODAL.FILL_DETAILS')}
        </Typography>

        <form
          className='grid grid-cols-2 gap-10'
          id={ADD_BUSINESS_TEAM_FORM}
          onSubmit={onSubmit}
        >
          <FormItem
            component='div'
            label={intl.get('TEAM_NAME', { num: 1 })}
            labelProps={{ required: true }}
          >
            <TextArea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              textAreaProps={{
                className: 'h-22',
                placeholder: intl.get('ADD_TEAM_MODAL.TEAM_NAME_PLACEHOLDER'),
                'data-testid': 'business-team_name',
              }}
            />
          </FormItem>

          <FormItem component='div' label={intl.get('DESCRIPTION', { num: 1 })}>
            <TextArea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              textAreaProps={{
                className: 'h-22',
                placeholder: intl.get('ADD_TEAM_MODAL.DESCRIPTION_PLACEHOLDER'),
                'data-testid': 'business-team_description',
              }}
            />
          </FormItem>
        </form>
      </Modal>
    </>
  );
};

export default NewBusinessTeamModal;
