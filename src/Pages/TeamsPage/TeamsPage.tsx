import { useEffect, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import { Tabs } from '@getsynapse/design-system';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import Pagination from 'Organisms/Pagination';
import {
  getLDMembers,
  selectLearningTeamsForTable,
  updateLDTeamsPagination,
  setLDTeamsFilters,
} from 'state/Teams/teamsSlice';
import TeamsTable from './components/TeamsTable';

const TeamsPage = () => {
  const dispatch = useDispatch();
  const learningTeams = useSelector(selectLearningTeamsForTable);

  useEffect(() => {
    dispatch(getLDMembers());
    return () => {
      dispatch(setLDTeamsFilters([]));
    };
  }, [dispatch]);

  const setPagination = useCallback(
    (params) => {
      dispatch(updateLDTeamsPagination(params));
    },
    [dispatch]
  );

  return (
    <div className='flex flex-col h-full'>
      <PageTitle titleComponent={intl.get('SIDEBAR.TEAMS')} />
      <div className='mt-4 mb-16 px-6 flex-grow overflow-y-auto'>
        <Tabs
          tabListProps={{ className: 'max-w-sm mb-4' }}
          type='tab'
          data={[
            {
              label: intl.get('TEAMS.TEAM'),
              content: (
                <Fragment>
                  <TeamsTable learningTeamsRows={learningTeams.data} />
                  <Pagination
                    total={learningTeams.total}
                    onChange={setPagination}
                  />
                </Fragment>
              ),
            },
            {
              label: intl.get('TEAMS.ALLOCATION'),
              content: <div />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TeamsPage;
