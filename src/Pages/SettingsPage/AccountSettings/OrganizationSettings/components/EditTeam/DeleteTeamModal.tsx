import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import { BusinessTeam, LearningTeam } from 'utils/customTypes';
import { Modal } from '@getsynapse/design-system';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { deleteBusinessTeam } from 'state/BusinessTeams/businessTeamsSlice';
import { deleteLearningTeam } from 'state/LearningTeams/learningTeamsSlice';
import get from 'lodash/get';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'utils/constants';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';

const DeleteTeamModal = ({
  isBusinessTeam,
  team,
  isOpen,
  setIsOpen,
}: {
  isBusinessTeam: boolean;
  team: Partial<BusinessTeam> | Partial<LearningTeam>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const teamId = get(team, 'id', '');

  const deleteTeam = async () => {
    if (isBusinessTeam) {
      await dispatch(deleteBusinessTeam(teamId));
    } else {
      await dispatch(deleteLearningTeam(teamId));
    }
    history.push(PATHS.SETTINGS);
    dispatch(setNotificationTimeout(4000));
    dispatch(setNotificationVariant('success'));
    dispatch(
      setNotificationText(
        intl.get('EDIT_TEAM.DELETE_TEAM_MODAL.SUCCESS_NOTIFICATION')
      )
    );
    dispatch(displayNotification());
  };

  return (
    <Modal
      data-cy='delete-team_modal'
      title={intl.get('EDIT_TEAM.DELETE_TEAM_MODAL.TITLE')}
      closeModal={() => setIsOpen(false)}
      isOpen={isOpen}
      aria-label={intl.get('EDIT_TEAM.DELETE_TEAM_MODAL.TITLE')}
      size='medium'
      actionButtons={[
        {
          children: intl.get('EDIT_TEAM.DELETE_TEAM_MODAL.DELETE_BUTTON'),
          variant: 'primary',
          color: 'danger',
          onClick: deleteTeam,
          'data-cy': 'delete-team_button',
        },
        {
          children: intl.get('CANCEL'),
          variant: 'tertiary',
          onClick: () => setIsOpen(false),
          'data-cy': 'cancel-delete-team_button',
        },
      ]}
    >
      <Fragment>
        <Typography variant='body' className='mb-6 text-neutral-black'>
          {intl.getHTML('EDIT_TEAM.DELETE_TEAM_MODAL.BODY_FIRST_LINE')}
        </Typography>
        <Typography variant='body' className='text-neutral-black'>
          {intl.getHTML('EDIT_TEAM.DELETE_TEAM_MODAL.BODY_SECOND_LINE')}
        </Typography>
      </Fragment>
    </Modal>
  );
};

export default DeleteTeamModal;
