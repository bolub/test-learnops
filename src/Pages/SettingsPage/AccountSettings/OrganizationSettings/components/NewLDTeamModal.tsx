import { FormEvent, useState, ChangeEvent } from 'react';
import intl from 'react-intl-universal';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import {
  Modal,
  Typography,
  FormItem,
  Input,
  Dropdown,
  TextArea,
  UsersPicker,
} from '@getsynapse/design-system';
import { CREATE_TEAM_FORM } from 'utils/constants';
import {
  FormOption,
  NewTeamType,
  Option,
  UserAvatars,
  UserOption,
} from 'utils/customTypes';

type NewLDTeamModalProps = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
  ldOptions: FormOption[];
  ldUsers: UserAvatars[];
  onAddTeam: (team: NewTeamType) => void;
};

const NewLDTeamModal = ({
  isOpen = false,
  setIsOpen,
  ldOptions,
  ldUsers,
  onAddTeam,
}: NewLDTeamModalProps) => {
  const initialState: NewTeamType = {
    name: '',
    description: '',
    parent_id: null,
    team_manager_id: null,
  };
  const [newTeam, setNewTeam] = useState(initialState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onAddTeam(newTeam);
    handleClose();
  };

  const handleClose = () => {
    setNewTeam(initialState);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={handleClose}
      aria-label='add-ld-team'
      data-testid='add-ld-team_modal'
      title={intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM')}
      size='large'
      actionButtons={[
        {
          children: intl.get('SAVE'),
          variant: 'primary',
          'data-cy': 'confirm-button',
          type: 'submit',
          form: CREATE_TEAM_FORM,
          disabled: isEmpty(newTeam.name),
        },
        {
          children: intl.get('CANCEL'),
          variant: 'tertiary',
          onClick: handleClose,
          'data-cy': 'cancel-button',
        },
      ]}
    >
      <Typography>
        {intl.get(
          'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.FILL_DETAILS'
        )}
      </Typography>
      <form
        id={CREATE_TEAM_FORM}
        className='grid grid-cols-2 gap-x-9 mt-4'
        onSubmit={handleSubmit}
      >
        <FormItem
          className='h-16'
          labelProps={{ required: true }}
          label={intl.get(
            'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.TEAM_NAME'
          )}
        >
          <Input
            data-testid='team-name_input'
            className='h-10'
            placeholder={intl.get(
              'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.ENTER_TEAM_NAME'
            )}
            value={newTeam.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setNewTeam((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </FormItem>
        <FormItem
          className='row-span-2'
          label={intl.get('DESCRIPTION', { num: 1 })}
        >
          <TextArea
            value={newTeam.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setNewTeam((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            textAreaProps={{
              'data-testid': 'team-description_input',
              className: 'h-30',
              placeholder: intl.get(
                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.ENTER_DESCRIPTION'
              ),
            }}
          />
        </FormItem>
        <FormItem
          className='h-16'
          label={intl.get(
            'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.REPORTS_TO'
          )}
        >
          <Dropdown
            onChange={(option: Option) =>
              setNewTeam((prev) => ({ ...prev, parent_id: option.value }))
            }
            options={ldOptions}
            values={[]}
            triggerProps={{
              'data-testid': 'team-parent_dropdown',
              className: 'h-10',
              placeholder: intl.get(
                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.SELECT_TEAM'
              ),
            }}
          />
        </FormItem>
        <FormItem label={intl.get('ENTITIES.TEAM_MANAGER')}>
          <UsersPicker
            usersList={ldUsers}
            selectedUsersList={[]}
            onChange={(user: UserOption[]) =>
              setNewTeam((prev) => ({
                ...prev,
                team_manager_id: get(user, '[0].value'),
              }))
            }
            triggerText={intl.get(
              'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.ADD_MANAGER'
            )}
            noSelectedUsersText={intl.get(
              'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.NO_MANAGER_ASSIGNED'
            )}
            maxLimit={1}
            triggerProps={{
              type: 'button',
              'data-testid': 'team-manager_dropdown',
            }}
          />
        </FormItem>
      </form>
    </Modal>
  );
};

export default NewLDTeamModal;
