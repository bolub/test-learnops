import { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import {
  FormItem,
  Typography,
  TextField,
  TextArea,
  Dropdown,
  UsersPicker,
} from '@getsynapse/design-system';
import {
  Option,
  BusinessTeam,
  LearningTeam,
  UserOption,
} from 'utils/customTypes';
import get from 'lodash/get';
import { selectLearningTeamsForDropdown } from 'state/LearningTeams/learningTeamsSlice';
import { selectLDUsersForDropdown } from 'state/UsersManagement/usersManagementSlice';
import { useState } from 'react';

const BasicInformation = ({
  team,
  isBusinessTeam,
  handleChangeField,
  hasError,
}: {
  team: Partial<BusinessTeam> | Partial<LearningTeam>;
  isBusinessTeam: boolean;
  handleChangeField: (eventTargetValue: string, pathToUpdate: string) => void;
  hasError: boolean;
}) => {
  const allLearningTeams = useSelector(selectLearningTeamsForDropdown);
  const ldUsers = useSelector(selectLDUsersForDropdown);
  const learningTeamsOptions = useMemo(
    () => allLearningTeams.filter((ldTeam) => ldTeam.value !== team.id),
    [allLearningTeams, team.id]
  );
  const teamName = isBusinessTeam ? get(team, 'title') : get(team, 'name');
  const managerId = get(team, 'team_manager_id');
  const [selectedManager, setSelectedManager] = useState(
    managerId
      ? [
          {
            label: `${get(team, 'teamManager.data.firstName')} ${get(
              team,
              'teamManager.data.lastName'
            )}`,
            avatar: {
              initial: `${get(team, 'teamManager.data.firstName[0]')}${get(
                team,
                'teamManager.data.lastName[0]'
              )}`,
              imageSrc: get(team, 'teamManager.avatar_url'),
            },
            value: managerId,
          },
        ]
      : []
  );

  const changeManager = (user: UserOption[]) => {
    setSelectedManager(
      user.length
        ? [
            {
              label: get(user, '[0].label'),
              avatar: {
                initial: get(user, '[0].avatar.initial'),
                imageSrc: get(user, '[0].avatar.imageSrc'),
              },
              value: get(user, '[0].value'),
            },
          ]
        : []
    );
    handleChangeField(get(user, '[0].value', null), 'team_manager_id');
  };

  return (
    <div className='grid grid-cols-2 gap-x-20 gap-y-4'>
      <div className='col-span-2'>
        <Typography variant='h5' className='mt-8 text-neutral-black'>
          {intl.get('TITLES.BASIC_INFORMATION_TITLE')}
        </Typography>
      </div>
      <FormItem
        label={intl.get('TEAM_NAME', { num: 1 })}
        labelProps={{
          required: true,
          state: hasError ? 'error' : 'default',
        }}
        helpText={hasError && intl.get('ERRORS.MISSING_INFORMATION')}
        helpTextProps={{ state: hasError ? 'error' : 'default' }}
      >
        <TextField
          variant='text'
          length='medium'
          data-cy='team-name_input'
          placeholder={intl.get('ADD_TEAM_MODAL.TEAM_NAME_PLACEHOLDER')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChangeField(
              e.target.value,
              isBusinessTeam ? 'title' : 'name'
            );
          }}
          defaultValue={teamName}
          state={hasError ? 'error' : 'default'}
        />
      </FormItem>
      <TextArea
        className='row-span-2 flex flex-col'
        label={intl.get('DESCRIPTION', { num: 1 })}
        textAreaProps={{
          className: 'h-30 flex-grow',
          placeholder: intl.get('ADD_TEAM_MODAL.DESCRIPTION_PLACEHOLDER'),
          defaultValue: get(team, 'description'),
        }}
        onChange={(e) => {
          handleChangeField(e.target.value, 'description');
        }}
      />
      {!isBusinessTeam && (
        <Fragment>
          <FormItem
            label={intl.get(
              'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.REPORTS_TO'
            )}
            className='mt-1 col-start-1 col-end-1 col-span-2'
          >
            <Dropdown
              options={learningTeamsOptions}
              values={[
                {
                  label: get(team, 'parentTeam.name'),
                  value: get(team, 'parent_id'),
                },
              ]}
              triggerProps={{
                className: 'h-6',
                placeholder: intl.get(
                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.SELECT_TEAM'
                ),
              }}
              onChange={(option: Option) => {
                handleChangeField(option.value, 'parent_id');
              }}
            />
          </FormItem>
          <FormItem label={intl.get('ENTITIES.TEAM_MANAGER')}>
            <UsersPicker
              usersList={ldUsers}
              selectedUsersList={selectedManager}
              onChange={(user: UserOption[]) => changeManager(user)}
              triggerText={intl.get(
                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.ADD_MANAGER'
              )}
              noSelectedUsersText={intl.get(
                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.NO_MANAGER_ASSIGNED'
              )}
              maxLimit={1}
            />
          </FormItem>
        </Fragment>
      )}
    </div>
  );
};

export default BasicInformation;
