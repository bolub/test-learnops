import { AllUsersType, LDTeam, objKeyAsString } from 'utils/customTypes';
import { Table, Tag } from '@getsynapse/design-system';
import UsersTableHead from './UsersTableHead';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { USER_STATUS, USER_ROLES, PATHS, USER_TYPES } from 'utils/constants';
import { useHistory, Link } from 'react-router-dom';
import { Fragment } from 'react';
import UserAvatar from 'Atoms/UserAvatar';

type UsersTableProps = {
  data: AllUsersType[];
  handleSort: (orderByParam: string[], order: 'desc' | 'asc') => void;
};

const UsersTable = ({ data, handleSort }: UsersTableProps) => {
  const history = useHistory();
  const mapTagColor: objKeyAsString = {
    [USER_STATUS.REGISTERED]: { color: 'positive' },
    [USER_STATUS.INVITED]: {
      color: 'warning',
    },
    [USER_STATUS.REGISTERED_DISABLED]: {
      className: 'bg-neutral-lighter text-neutral-dark',
    },
    [USER_STATUS.INVITED_DISABLED]: {
      className: 'bg-neutral-lighter text-neutral-dark',
    },
  };

  const getLDTeams = (user: AllUsersType) => {
    const registeredTeams = get(user, 'registeredLearningTeams');
    const teamsArray = registeredTeams.map((team: LDTeam) => team.name);
    return teamsArray.join(', ');
  };

  return (
    <Table
      className='w-full'
      canSelectRows={false}
      data={{
        headData: {
          headCells: UsersTableHead({
            handleSort,
          }),
        },
        rows: data.map((user) => {
          return {
            id: user.id,
            className: 'cursor-pointer',
            onClick: () => history.push(`${PATHS.USER_PAGE}/${user.id}`),
            'data-testid': `table-row-${user.id}`,
            cells: [
              {
                content: <Fragment></Fragment>,
              },
              {
                content: (
                  <Link
                    to={`${PATHS.USER_PAGE}/${user.id}`}
                    className='flex items-start w-full relative'
                  >
                    <UserAvatar user={user} />
                    <div className='ml-2.5'>
                      <div className='font-semibold'>{`${user.data.firstName} ${user.data.lastName}`}</div>
                      <div className='text-neutral'>{user.data.email}</div>
                    </div>
                    {user.role === USER_ROLES.ADMIN && (
                      <Tag
                        label={intl.get(
                          `USERS_PAGE.TABLE.USER_ROLE.${user.role.toUpperCase()}`
                        )}
                        className='bg-secondary-lighter text-secondary-darker absolute right-0'
                      />
                    )}
                  </Link>
                ),
                className: 'leading-6',
              },
              {
                content: intl.get(
                  `USERS_PAGE.TABLE.USER_TYPE.${user.type.toUpperCase()}`
                ),
                className: 'leading-4',
              },
              {
                content:
                  user.type === USER_TYPES.BUSINESS
                    ? get(user, 'businessTeams.title')
                    : user.type === USER_TYPES.L_D
                    ? getLDTeams(user)
                    : '-',
                className: 'leading-4',
              },
              {
                content: user.data.jobTitle,
                className: 'leading-4',
              },
              {
                content: intl.get(
                  `TEAMS.EMPLOYMENT_TYPE.${get(
                    user,
                    'data.employmentType',
                    'UNDEFINED'
                  ).toUpperCase()}`
                ),
                className: 'leading-4',
              },
              {
                content: `${
                  user.data.province ? user.data.province + ',' : ''
                } ${intl.get(
                  `COUNTRIES.${user.country_iso_3166_1_alpha_2_code}`
                )}`,
                className: 'leading-4',
              },
              {
                content: get(user, 'data.rateHour')
                  ? `${get(user, 'data.rateHour')} ${intl.get(
                      'TEAMS.CURRENCY'
                    )}`
                  : '-',
                className: 'leading-4',
              },
              {
                content: (
                  <Tag
                    label={intl.get(
                      `USERS_PAGE.TABLE.USER_STATUS.${user.status.toUpperCase()}`
                    )}
                    {...mapTagColor[user.status]}
                  />
                ),
              },
            ],
          };
        }),
      }}
    />
  );
};

export default UsersTable;
