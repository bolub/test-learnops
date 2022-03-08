import { Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import {
  Icon,
  useElevation,
  Typography,
  NotificationPopup,
  StaticNotification,
} from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import isEmpty from 'lodash/isEmpty';
import {
  PATHS,
  NOTIFICATION_STATUS,
  UPDATE_PROJECT_TABS,
} from 'utils/constants';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'state/User/userSlice';
import {
  getNotifications,
  selectNotifications,
  markAllAsRead,
  updateNotification,
  markAllAsSeen,
} from 'state/Notifications/notificationsSlice';
import { Notification, FormattedNotification } from 'utils/customTypes';
import { formatNotifications } from 'utils/notificationsHelper';
import UserAvatar from 'Atoms/UserAvatar';

interface taskPageMatchParams {
  projectId: string;
}

const Header = () => {
  const dispatch = useDispatch();
  const requestPage = useRouteMatch(PATHS.REQUEST_PAGE);
  const newProjectPage = useRouteMatch(PATHS.NEW_PROJECT_PAGE);
  const projectPage = useRouteMatch(`${PATHS.PROJECT_PAGE}/:projectId`);
  const singleTaskPage = useRouteMatch<taskPageMatchParams>(
    `${PATHS.PROJECT_PAGE}/:projectId/tasks/:taskId`
  );
  const editTeamPage = useRouteMatch<taskPageMatchParams>(
    `${PATHS.EDIT_TEAM}/:teamType/:teamId`
  );
  const userPage = useRouteMatch(PATHS.USER_PAGE);
  const vendorPage = useRouteMatch(PATHS.VENDOR_PAGE);
  const user = useSelector(selectUser);
  const skimClass = useElevation(1);
  const [notificationsList, setNotificationsList] = useState<
    FormattedNotification[]
  >([]);

  const { linkTo, linkText } = useMemo<{
    linkTo?: string;
    linkText?: string;
  }>(() => {
    if (projectPage || newProjectPage) {
      if (singleTaskPage && singleTaskPage.isExact) {
        return {
          linkTo: `${PATHS.PROJECT_PAGE}/${singleTaskPage.params.projectId}?tab=${UPDATE_PROJECT_TABS.TASKS}`,
          linkText: intl.get('TASKS.TASK_DETAIL_PAGE.SINGULAR_TITLE'),
        };
      } else
        return {
          linkTo: PATHS.PROJECTS_LIST_PAGE,
          linkText: intl.get('NEW_PROJECT_PAGE.ALL_PROJECTS_LINK'),
        };
    } else if (requestPage) {
      return {
        linkTo: PATHS.REQUESTS_LIST_PAGE,
        linkText: intl.get('REQUEST_PAGE.LEARNING_REQUESTS_PORTAL'),
      };
    } else if (editTeamPage) {
      return {
        linkTo: PATHS.SETTINGS,
        linkText: intl.get('ENTITIES.ORGANIZATION', { num: 1 }),
      };
    } else if (userPage || vendorPage) {
      return {
        linkTo: PATHS.SETTINGS,
        linkText: intl.get('SIDEBAR.SETTINGS'),
      };
    }

    return {
      linkTo: undefined,
      linkText: undefined,
    };
  }, [
    newProjectPage,
    projectPage,
    requestPage,
    singleTaskPage,
    userPage,
    vendorPage,
    editTeamPage,
  ]);

  const notificationsListSelector = useSelector(selectNotifications);

  const hasNewNotifications = useMemo(
    () =>
      notificationsListSelector.some(
        (notification: Notification) =>
          notification.status === NOTIFICATION_STATUS.NEW
      ),
    [notificationsListSelector]
  );

  const hasUnreadNotications = useMemo(
    () =>
      notificationsListSelector.some(
        (notification: Notification) =>
          notification.status !== NOTIFICATION_STATUS.READ
      ),
    [notificationsListSelector]
  );

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (notificationsListSelector.length > 0) {
      setNotificationsList(formatNotifications(notificationsListSelector));
    }
  }, [notificationsListSelector]);

  const markAllAsReadHandle = () => {
    dispatch(markAllAsRead());
  };

  const markAsRead = (id: string) => {
    dispatch(
      updateNotification({ id, newData: { status: NOTIFICATION_STATUS.READ } })
    );
  };

  const markAllAsSeenHandle = () => {
    if (hasNewNotifications) {
      dispatch(markAllAsSeen());
    }
  };

  return (
    <header
      className={classnames(
        skimClass,
        'h-10',
        'flex-shrink-0',
        'flex',
        'w-full',
        'justify-between',
        'items-center',
        'px-6'
      )}
    >
      <div className='flex items-center space-x-2'>
        {linkTo && (
          <Link
            to={linkTo}
            className='flex font-body text-body2-sm lg:text-body2 font-normal text-neutral-dark'
          >
            <Icon
              name='arrow-back-outline'
              className='py-1.5 mr-2 font-body font-normal lg:text-body2 text-body2-sm'
            />
            {linkText}
          </Link>
        )}
      </div>

      <div className='flex space-x-4 items-center' data-cy='notifications-list'>
        <NotificationPopup
          hasNewNotifications={hasNewNotifications}
          hasUnreadNotications={hasUnreadNotications}
          markAllHandle={markAllAsReadHandle}
          openNotificationHandle={markAllAsSeenHandle}
          triggerProps={{ 'data-cy': 'notification_bell-button' }}
        >
          {!isEmpty(notificationsList) &&
            notificationsList.map((notification) => (
              <Link to={notification.link} key={notification.id}>
                <StaticNotification
                  avatar={notification.avatar}
                  time={notification.time}
                  unread={notification.status !== 'read'}
                  data-cy={`notification-${notification.id}`}
                  onClick={() => markAsRead(notification.id || '')}
                >
                  {notification.content}
                </StaticNotification>
              </Link>
            ))}
        </NotificationPopup>
        <div className='flex space-x-2 items-center'>
          <UserAvatar
            size='small'
            user={{
              avatar_url: user.avatar_url,
              data: {
                firstName: user.firstName!,
                lastName: user.lastName!,
              },
            }}
          />
          <Typography variant='body2' className='text-neutral-black'>
            {user.full_name}
          </Typography>
        </div>
      </div>
    </header>
  );
};

export default Header;
