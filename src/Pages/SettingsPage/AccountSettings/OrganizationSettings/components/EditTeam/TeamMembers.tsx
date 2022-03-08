import { BusinessUser, LDUser, objKeyAsString } from 'utils/customTypes';
import { Table, Tag, Typography } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { USER_STATUS } from 'utils/constants';
import get from 'lodash/get';
import TableAvatar from 'Molecules/TableAvatar';

const TeamMembers = ({
  data,
  isBusinessTeam,
}: {
  data: LDUser[] | BusinessUser[];
  isBusinessTeam: boolean;
}) => {
  const mapTagColor: objKeyAsString = {
    [USER_STATUS.REGISTERED]: { color: 'positive' },
    [USER_STATUS.REGISTERED_DISABLED]: {
      className: 'bg-neutral-lighter text-neutral-dark',
    },
    [USER_STATUS.INVITED_DISABLED]: {
      className: 'bg-neutral-lighter text-neutral-dark',
    },
  };

  const MembersTableHead = () => [
    {
      content: intl.get('USERS_PAGE.TABLE.HEAD.USER_NAME'),
      className: 'py-3',
    },
    {
      content: intl.get('USERS_PAGE.TABLE.HEAD.JOB_TITLE'),
      className: 'py-3',
    },
    {
      content:
        !isBusinessTeam && intl.get('USERS_PAGE.TABLE.HEAD.EMPLOYMENT_TYPE'),
      className: 'py-3',
    },

    {
      content: intl.get('USERS_PAGE.TABLE.HEAD.LOCATION'),
      className: 'py-3',
    },
    {
      content: intl.get('USERS_PAGE.TABLE.HEAD.ACCOUNT_STATUS'),
      className: 'py-3',
    },
  ];

  return (
    <div className='mb-12'>
      <Typography variant='h5' className='mt-8 mb-4 text-neutral-black'>
        {intl.get('TEAMS.TABLE.TEAM_MEMBERS')}
      </Typography>
      <Table
        className='w-full'
        data-cy='team-members_table'
        canSelectRows={false}
        emptyComponent={
          <Typography className='h-12 flex justify-center items-center text-neutral'>
            {intl.get('EDIT_TEAM.NO_TEAM_MEMBERS')}
          </Typography>
        }
        data={{
          headData: {
            headCells: MembersTableHead(),
          },
          rows: data.map((user) => {
            return {
              id: user.id,
              cells: [
                {
                  content: <TableAvatar user={user} />,
                  className: 'leading-6',
                },
                {
                  content: user.data.jobTitle,
                  className: 'leading-4',
                },
                {
                  content:
                    !isBusinessTeam &&
                    intl.get(
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
    </div>
  );
};

export default TeamMembers;
