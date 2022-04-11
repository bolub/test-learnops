import { useLink, InlineNotification } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { PATHS } from 'utils/constants';
import useAuthentication from 'Hooks/useAuthentication';
import RequestPage from 'Pages/RequestPage/RequestPage';
import RequestsListPage from 'Pages/RequestsListPage/RequestsListPage';
import Loader from 'Molecules/Loader/Loader';
import SideBar from 'Organisms/SideBar/SideBar';
import {
  hideNotification,
  selectNotificationText,
  selectShowNotification,
  selectNotificationTimeout,
  selectNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import { getOrganization } from 'state/Organization/organizationSlice';
import {
  selectOrganizationId,
  selectUserEmail,
  selectIsUserLd,
} from 'state/User/userSlice';
import { initPendo } from 'Services/pendo';
import InsightsPage from 'Pages/InsightsPage/InsightsPage';
import DesignPage from 'Pages/DesignPage';
import TeamsPage from 'Pages/TeamsPage/TeamsPage';
import ProjectsListPage from 'Pages/ProjectsListPage/ProjectsListPage';
import NewProjectPage from 'Pages/NewProjectPage/NewProjectPage';
import ProjectPage from 'Pages/ProjectPage/ProjectPage';
import Notifications from './Notifications';
import Header from 'Pages/Components/Header';
import SettingsPage from 'Pages/SettingsPage/SettingsPage';
import { useEffect } from 'react';
import TaskPage from 'Pages/ProjectPage/tabs/Tasks/TaskPage';
import UserPage from 'Pages/SettingsPage/AccountSettings/UsersListPage/UserPage/UserPage';
import EditTeam from 'Pages/SettingsPage/AccountSettings/OrganizationSettings/components/EditTeam/EditTeam';
import FormPage from 'Pages/SettingsPage/PlatformSettings/components/FormPage/FormPage';
import NewForm from 'Pages/SettingsPage/PlatformSettings/components/FormPage/NewForm';
import VendorPage from 'Pages/SettingsPage/AccountSettings/OrganizationSettings/Vendor/VendorPage';

const AppPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useAuthentication();
  const linkClassName = useLink();
  const showNotification = useSelector(selectShowNotification);
  const notificationMessage = useSelector(selectNotificationText);
  const timeout = useSelector(selectNotificationTimeout);
  const notificationVariant = useSelector(selectNotificationVariant);
  const currentUserEmail = useSelector(selectUserEmail);
  const organizationId = useSelector(selectOrganizationId);
  const isCurrentUserLD = useSelector(selectIsUserLd);

  useEffect(() => {
    if (organizationId) {
      dispatch(getOrganization(organizationId));
    }
  }, [organizationId, dispatch]);

  useEffect(() => {
    if (currentUserEmail && organizationId) {
      initPendo(currentUserEmail, organizationId);
    }
  }, [organizationId, currentUserEmail]);

  if (!isAuthenticated) {
    return (
      <div className='flex h-screen px-16'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex h-screen'>
      <SideBar />

      <div className='flex flex-col flex-grow w-11/12 relative'>
        {showNotification && (
          <InlineNotification
            variant={notificationVariant}
            timeout={timeout}
            onTimeout={() => dispatch(hideNotification())}
            className={classnames(
              'absolute',
              'top-0',
              'left-0',
              'z-40',
              'flex-grow',
              'w-full'
            )}
            hasCloseIcon={false}
            data-cy='app-inline-notification'
          >
            {() => <span>{notificationMessage}</span>}
          </InlineNotification>
        )}

        <Header />

        <Notifications />

        <div className='flex-grow overflow-y-auto bg-neutral-lightest'>
          <Switch>
            <Route exact path={PATHS.ROOT}>
              <Link
                to={PATHS.REQUEST_PAGE}
                className={classnames(linkClassName, 'mr-4')}
              >
                {intl.get('REQUEST_PAGE.PAGE_NAME')}
              </Link>
              <Link to={PATHS.REQUESTS_LIST_PAGE} className={linkClassName}>
                {intl.get('REQUESTS_LIST_PAGE.PAGE_NAME')}
              </Link>
            </Route>

            <Route
              path={[`${PATHS.REQUEST_PAGE}/:requestId`, PATHS.REQUEST_PAGE]}
            >
              <RequestPage />
            </Route>

            <Route path={PATHS.REQUESTS_LIST_PAGE}>
              <RequestsListPage />
            </Route>

            <Route path={PATHS.NEW_PROJECT_PAGE}>
              {isCurrentUserLD ? (
                <NewProjectPage />
              ) : (
                <Redirect to={PATHS.PROJECTS_LIST_PAGE} />
              )}
            </Route>

            <Route exact path={`${PATHS.PROJECT_PAGE}/:projectId`}>
              <ProjectPage />
            </Route>

            <Route
              exact
              path={`${PATHS.PROJECT_PAGE}/:projectId/tasks/:taskId`}
            >
              <TaskPage />
            </Route>

            <Route path={PATHS.INSIGHTS}>
              <InsightsPage />
            </Route>

            <Route path={PATHS.PROJECTS_LIST_PAGE}>
              <ProjectsListPage />
            </Route>

            <Route path={PATHS.DESIGN}>
              <DesignPage />
            </Route>

            <Route path={PATHS.TEAMS}>
              <TeamsPage />
            </Route>

            <Route path={PATHS.SETTINGS} exact>
              <SettingsPage />
            </Route>

            <Route path={`${PATHS.EDIT_TEAM}/:teamType/:teamId`}>
              <EditTeam />
            </Route>

            <Route path={`${PATHS.USER_PAGE}/:userId/:userType?`}>
              <UserPage />
            </Route>

            <Route path={`${PATHS.SETTINGS}${PATHS.FORM_PAGE}`} exact>
              <NewForm />
            </Route>

            <Route path={`${PATHS.VENDOR_PAGE}/:vendorId`}>
              <VendorPage />
            </Route>

            <Route path={`${PATHS.SETTINGS}${PATHS.FORM_PAGE}/:formId`}>
              <FormPage />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
