import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Table, Typography } from '@getsynapse/design-system';
import { DATE, PATHS, USER_TYPES } from 'utils/constants';
import {
  getBusinessTeams,
  selectBussinessTeams,
} from 'state/BusinessTeams/businessTeamsSlice';
import NewBusinessTeamModal from 'Organisms/NewBusinessTeamModal/NewBusinessTeamModal';
import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

const BusinessTeams = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const businessTeams = useSelector(selectBussinessTeams);

  useEffect(() => {
    dispatch(getBusinessTeams());
  }, [dispatch]);

  return (
    <div className='px-4'>
      <div className='flex justify-between items-baseline'>
        <Typography variant='h5' className='py-4'>
          {intl.get('ORG_SETTINGS_PAGE.BUSINESS_TEAMS.TITLE')}
        </Typography>

        <NewBusinessTeamModal />
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
                'data-testid': 'team-description',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.BUSINESS_TEAMS.TABLE.DESCRIPTION'
                ),
                className: 'font-semibold',
              },
              {
                'data-testid': 'team-create-date',
                content: intl.get(
                  'ORG_SETTINGS_PAGE.BUSINESS_TEAMS.TABLE.CREATION_DATE'
                ),
                className: 'font-semibold',
              },
            ],
          },
          rows:
            businessTeams.length > 0
              ? businessTeams.map((team) => {
                  return {
                    id: team.id,
                    'data-testid': `business-team_row-${team.id}`,
                    className: 'cursor-pointer',
                    onClick: () =>
                      history.push(
                        `${PATHS.EDIT_TEAM}/${USER_TYPES.BUSINESS}/${team.id}`
                      ),
                    cells: [
                      {
                        content: (
                          <Link
                            to={`${PATHS.EDIT_TEAM}/${USER_TYPES.BUSINESS}/${team.id}`}
                          >
                            {get(team, 'title', '-')}
                          </Link>
                        ),
                        className: 'w-2/5',
                      },
                      {
                        content: get(team, 'description', '-'),
                        className: 'w-2/5',
                      },
                      {
                        content: team.createdAt
                          ? moment(team.createdAt).format(
                              DATE.MONTH_DATE_YEAR_FORMAT
                            )
                          : '-',
                        className: 'w-1/5',
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
                        colSpan: '3',
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

export default BusinessTeams;
