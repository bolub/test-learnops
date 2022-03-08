import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import {
  fetchProject,
  resetProject,
  getCurrentProjectData,
} from 'state/Project/projectSlice';
import { ProjectTab } from 'utils/customTypes';
import { UPDATE_PROJECT_TABS } from 'utils/constants';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import TabLink from './components/TabLink/TabLink';
import Overview from './tabs/Overview/Overview';
import Files from './tabs/Files/Files';
import Tasks from './tabs/Tasks/Tasks';
import Budget from './tabs/Budget/Budget';
import People from './tabs/People/People';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const projectData = useSelector(getCurrentProjectData);
  const [currentTab, setCurrentTab] = useState<ProjectTab>(
    UPDATE_PROJECT_TABS.OVERVIEW
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const defaultTabString = queryParams.get('tab');

  useEffect(() => {
    dispatch(fetchProject(projectId));
    return () => {
      dispatch(resetProject());
    };
  }, [dispatch, projectId]);

  const availableTabs = Object.values(UPDATE_PROJECT_TABS);

  useEffect(() => {
    if (availableTabs.includes(defaultTabString)) {
      setCurrentTab(defaultTabString);
    }
  }, [defaultTabString, availableTabs]);

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={get(projectData, 'title', '')}
        headerChildren={
          <div className='flex'>
            {Object.keys(UPDATE_PROJECT_TABS).map((key) => (
              <TabLink
                key={key}
                tabKey={UPDATE_PROJECT_TABS[key]}
                isActive={currentTab === UPDATE_PROJECT_TABS[key]}
                setCurrentTab={setCurrentTab}
              />
            ))}
          </div>
        }
      />
      {currentTab === UPDATE_PROJECT_TABS.OVERVIEW && (
        <Overview projectId={projectId} />
      )}
      {currentTab === UPDATE_PROJECT_TABS.TASKS && <Tasks />}
      {currentTab === UPDATE_PROJECT_TABS.BUDGET && <Budget />}
      {currentTab === UPDATE_PROJECT_TABS.PEOPLE && <People />}
      {currentTab === UPDATE_PROJECT_TABS.FILES && (
        <Files projectId={projectId} />
      )}
    </div>
  );
};

export default ProjectPage;
