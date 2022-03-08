import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import intl from 'react-intl-universal';
import moment from 'moment';
import classnames from 'classnames';
import {
  Table,
  Typography,
  Button,
  Icon,
  Tooltip,
} from '@getsynapse/design-system';
import { DATE, PATHS, USER_TYPES } from 'utils/constants';
import { NewTeamType } from 'utils/customTypes';
import TableAvatar from 'Molecules/TableAvatar';
import {
  getLDUsers,
  selectLDUsersForDropdown,
} from 'state/UsersManagement/usersManagementSlice';
import { selectOrganizationId } from 'state/User/userSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import NewLDTeamModal from './NewLDTeamModal';
import { useHistory, Link } from 'react-router-dom';
import {
  addLDTeam,
  getLearningTeams,
  selectLearningTeamsForDropdown,
  selectLearningTeams,
} from 'state/LearningTeams/learningTeamsSlice';

const LearningTeams = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ldTeams = useSelector(selectLearningTeams);
  const ldUsers = useSelector(selectLDUsersForDropdown);
  const orgId = useSelector(selectOrganizationId);
  const learningTeamsOptions = useSelector(selectLearningTeamsForDropdown);
  const [newLDTeamIsOpen, setNewLDTeamIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getLDUsers());
    dispatch(getLearningTeams());
  }, [dispatch]);

  const onAddTeam = (team: NewTeamType) => {
    dispatch(addLDTeam({ ...team, organization_id: orgId }));
    dispatch(
      setNotificationText(
        intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM_MODAL.TEAM_ADDED')
      )
    );
    dispatch(setNotificationVariant('success'));
    dispatch(setNotificationTimeout(4000));
    dispatch(displayNotification());
  };

  return (
    <div className='px-4'>
      <NewLDTeamModal
        isOpen={newLDTeamIsOpen}
        setIsOpen={setNewLDTeamIsOpen}
        ldOptions={learningTeamsOptions}
        ldUsers={ldUsers}
        onAddTeam={onAddTeam}
      />
      <div className='flex justify-between items-baseline'>
        <Typography variant='h5' className='py-4'>
          {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.TITLE')}
        </Typography>
        <Button
          onClick={() => setNewLDTeamIsOpen(true)}
          data-testid='add-ld-team_button'
        >
          {intl.get('ORG_SETTINGS_PAGE.LEARNING_TEAMS.ADD_TEAM')}
        </Button>
      </div>

      <Table
        className='w-full mb-5'
        canSelectRows={false}
        data={{
          headData: {
            headCells: [
              {
                'data-testid': 'team-name',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.TEAM_NAME'
                ),
                className: 'font-semibold',
              },
              {
                'data-testid': 'team-manager',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.TEAM_MANAGER'
                ),
                className: 'font-semibold',
              },
              {
                'data-testid': 'team-reports-to',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.REPORTS_TO'
                ),
                className: 'font-semibold',
              },
              {
                'data-testid': 'team-create-date',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.CREATION_DATE'
                ),
                className: 'font-semibold',
              },
            ],
          },
          rows:
            ldTeams.length > 0
              ? ldTeams.map((team) => {
                  return {
                    id: team.id,
                    'data-testid': `ld-team_row-${team.id}`,
                    onClick: () =>
                      history.push(
                        `${PATHS.EDIT_TEAM}/${USER_TYPES.L_D}/${team.id}`
                      ),
                    className: 'cursor-pointer',
                    cells: [
                      {
                        content: (
                          <Link
                            to={`${PATHS.EDIT_TEAM}/${USER_TYPES.L_D}/${team.id}`}
                          >
                            {team.name}
                          </Link>
                        ),
                      },
                      {
                        content: team.teamManager ? (
                          <TableAvatar
                            user={{
                              ...team.teamManager,
                              data: {
                                ...team.teamManager.data,
                                email: '',
                              },
                            }}
                          />
                        ) : (
                          <div className='flex items-center'>
                            <Typography
                              variant='body2'
                              className='text-neutral-black'
                            >
                              {intl.get(
                                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.NO_MANAGER_ASSIGNED'
                              )}
                            </Typography>
                            <Tooltip
                              className='pl-2.5 flex'
                              trigger={
                                <Icon
                                  name='information-circle'
                                  className='text-2xl text-warning-dark'
                                />
                              }
                              openMode='hover1'
                              ariaId='manager-more-info'
                              position='topCenter'
                              contentProps={{
                                className: classnames(
                                  'bg-warning-lighter',
                                  'text-warning-dark',
                                  'rounded px-4 py-3.5',
                                  'w-max absolute',
                                  'font-normal'
                                ),
                              }}
                            >
                              <span>
                                {intl.get(
                                  'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.A_MANAGER_IS_NEEDED'
                                )}
                              </span>
                            </Tooltip>
                          </div>
                        ),
                        className: 'font-semibold',
                      },
                      { content: get(team, 'parentTeam.name', '-') },
                      {
                        content: team.createdAt
                          ? moment(team.createdAt).format(
                              DATE.MONTH_DATE_YEAR_FORMAT
                            )
                          : '-',
                      },
                    ],
                  };
                })
              : [
                  {
                    'data-testid': 'teams_table-empty',
                    id: '0',
                    cells: [
                      {
                        colSpan: '4',
                        content: (
                          <div className='flex justify-center'>
                            <Typography
                              variant='body2'
                              className='text-neutral'
                            >
                              {intl.get(
                                'ORG_SETTINGS_PAGE.LEARNING_TEAMS.TABLE.NO_TEAM_ADDED'
                              )}
                            </Typography>
                          </div>
                        ),
                      },
                    ],
                  },
                ],
        }}
      />
    </div>
  );
};

export default LearningTeams;
