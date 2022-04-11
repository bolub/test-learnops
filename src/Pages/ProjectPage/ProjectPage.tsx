import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import {
  fetchProject,
  resetProject,
  getCurrentProjectData,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import {
  getAllUsers,
  getLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { ProjectTab } from 'utils/customTypes';
import {
  UPDATE_PROJECT_TABS,
  PROJECT_PARTICIPANT_TYPE,
  PATHS,
} from 'utils/constants';
import useHasUserAccess from './hooks/useHasUserAccess';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import TabLink from './components/TabLink/TabLink';
import Overview from './tabs/Overview/Overview';
import Files from './tabs/Files/Files';
import Tasks from './tabs/Tasks/Tasks';
import Budget from './tabs/Budget/Budget';
import People from './tabs/People/People';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const hasUserAccess = useHasUserAccess();
  const { projectId } = useParams<{ projectId: string }>();
  const projectData = useSelector(getCurrentProjectData);
  const participantType = useSelector(getCurrentUserParticipantType);
  const isUserCollaborator =
    participantType === PROJECT_PARTICIPANT_TYPE.COLLABORATOR;
  const [currentTab, setCurrentTab] = useState<ProjectTab>(
    UPDATE_PROJECT_TABS.OVERVIEW
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const defaultTabString = queryParams.get('tab');

  const init = useCallback(async () => {
    await Promise.all([
      dispatch(fetchProject(projectId)),
      dispatch(getAllUsers()),
      dispatch(getLDUsers()),
    ]);
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectId) {
      init();
    }
    return () => {
      dispatch(resetProject());
    };
  }, [projectId, init, dispatch]);

  const notAvailableTabsForCollaborators = useMemo(
    () => [UPDATE_PROJECT_TABS.PEOPLE, UPDATE_PROJECT_TABS.BUDGET],
    []
  );
  const availableTabs = useMemo(() => {
    let tabs: string[] = [];
    for (let value of Object.values(UPDATE_PROJECT_TABS)) {
      if (
        isUserCollaborator &&
        notAvailableTabsForCollaborators.includes(value)
      ) {
        continue;
      }
      tabs.push(value);
    }
    return tabs;
  }, [notAvailableTabsForCollaborators, isUserCollaborator]);

  useEffect(() => {
    if (defaultTabString && availableTabs.includes(defaultTabString)) {
      setCurrentTab(defaultTabString);
    }
  }, [defaultTabString, availableTabs]);

  return hasUserAccess ? (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={get(projectData, 'title', '')}
        headerChildren={
          <div className='flex'>
            {availableTabs.map((tab) => {
              return (
                <TabLink
                  key={tab}
                  tabKey={tab}
                  isActive={currentTab === tab}
                  setCurrentTab={setCurrentTab}
                />
              );
            })}
          </div>
        }
      />
      {currentTab === UPDATE_PROJECT_TABS.OVERVIEW && (
        <Overview projectId={projectId} />
      )}
      {currentTab === UPDATE_PROJECT_TABS.TASKS && <Tasks />}
      {currentTab === UPDATE_PROJECT_TABS.BUDGET && <Budget />}
      {currentTab === UPDATE_PROJECT_TABS.PEOPLE && (
        <People projectId={projectId} />
      )}
      {currentTab === UPDATE_PROJECT_TABS.FILES && (
        <Files projectId={projectId} />
      )}
    </div>
  ) : (
    <Redirect to={PATHS.PROJECTS_LIST_PAGE} />
  );
};

export default ProjectPage;
