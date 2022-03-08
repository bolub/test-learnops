import { NOTIFICATION_TYPE, REQUEST_STATUS } from 'utils/constants';
import { FormattedNotification, Notification } from 'utils/customTypes';
import intl from 'react-intl-universal';
import moment from 'moment';
import { PATHS } from 'utils/constants';
import get from 'lodash/get';
import approvedRequestIcon from 'assets/icons/approved-request.svg';
import declinedRequestIcon from 'assets/icons/declined-request.svg';
import projectUpdateIcon from 'assets/icons/project-update-icon.svg';
import statusUpdateIcon from 'assets/icons/status-update.svg';
import disableIcon from 'assets/icons/disable-icon.svg';
import enableIcon from 'assets/icons/enable-icon.svg';
import removeIcon from 'assets/icons/remove-icon.svg';
import dueDateIcon from 'assets/icons/due-date-icon.svg';
import pastDueDateIcon from 'assets/icons/past-due-date-icon.svg';

const renderContent = (
  triggererName: string,
  content: string,
  requestFormName: string
) => (
  <>
    {triggererName}
    {content}
    <span className='font-semibold'>{requestFormName}</span>
  </>
);

export const formatNotifications = (notificationsList: Notification[]) => {
  return notificationsList.map((notification) => {
    let formttedNotification: FormattedNotification = {
      id: '',
      link: '',
    };
    switch (notification.message) {
      case NOTIFICATION_TYPE.REQUEST_ATTRIBUTES_UPDATED:
      case NOTIFICATION_TYPE.REQUEST_QUESTIONS_UPDATED:
        formttedNotification.link = `${PATHS.REQUEST_PAGE}/${get(
          notification.data,
          'requestId'
        )}`;
        formttedNotification = {
          ...formttedNotification,
          content: renderContent(
            get(notification.data, 'triggererName'),
            intl.get('APP_NOTIFICATIONS.REQUEST_QUESTIONS_UPDATED'),
            get(notification.data, 'requestTitle')
          ),
          avatar: {
            iconName: 'hand-right',
            iconProps: {
              className: 'text-neutral-dark text-h3',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.REQUEST_STATUS_UPDATED:
        const previousStatus = get(notification.data, 'previousStatus');
        const currentStatus = get(notification.data, 'currentStatus');
        formttedNotification.link = `${PATHS.REQUEST_PAGE}/${get(
          notification.data,
          'requestId'
        )}`;
        if (
          previousStatus === REQUEST_STATUS.DRAFT &&
          currentStatus === REQUEST_STATUS.SUBMITTED
        ) {
          formttedNotification = {
            ...formttedNotification,
            content: renderContent(
              get(notification.data, 'triggererName'),
              intl.get('APP_NOTIFICATIONS.REQUEST_SUBMITTED'),
              get(notification.data, 'requestFormName')
            ),
            avatar: {
              iconName: 'hand-right',
              iconProps: {
                className: 'text-neutral-dark text-h3',
              },
            },
          };
        } else if (
          previousStatus === REQUEST_STATUS.APPROVED &&
          currentStatus === REQUEST_STATUS.PENDING_CANCEL
        ) {
          formttedNotification = {
            ...formttedNotification,
            content: renderContent(
              get(notification.data, 'triggererName'),
              intl.get('APP_NOTIFICATIONS.REQUEST_CANCELLED'),
              get(notification.data, 'requestTitle')
            ),
            avatar: {
              iconName: 'remove-circle',
              iconProps: {
                className: 'text-error-dark text-h3',
              },
            },
          };
        } else if (
          previousStatus === REQUEST_STATUS.SUBMITTED &&
          currentStatus === REQUEST_STATUS.APPROVED
        ) {
          formttedNotification = {
            ...formttedNotification,
            content: intl.getHTML('APP_NOTIFICATIONS.REQUEST_APPROVED', {
              requestTitle: get(notification.data, 'requestTitle'),
            }),
            avatar: {
              iconSrc: approvedRequestIcon,
              iconProps: {
                className: 'text-h3',
              },
            },
          };
        } else if (
          previousStatus === REQUEST_STATUS.SUBMITTED &&
          currentStatus === REQUEST_STATUS.REJECTED
        ) {
          formttedNotification = {
            ...formttedNotification,
            content: intl.getHTML('APP_NOTIFICATIONS.REQUEST_DECLINED', {
              requestTitle: get(notification.data, 'requestTitle'),
            }),
            avatar: {
              iconSrc: declinedRequestIcon,
              iconProps: {
                className: 'text-h3',
              },
            },
          };
        }
        break;
      case NOTIFICATION_TYPE.QUESTION_COMMENTED:
      case NOTIFICATION_TYPE.REQUEST_PROPERTY_COMMENTED:
        const queryString =
          notification.message === NOTIFICATION_TYPE.QUESTION_COMMENTED
            ? `questionId=${get(notification.data, 'questionId')}`
            : `propertyName=${get(notification.data, 'propertyName')}`;
        formttedNotification = {
          ...formttedNotification,
          content: renderContent(
            get(notification.data, 'triggererName'),
            intl.get('APP_NOTIFICATIONS.COMMENT_ADDED'),
            get(notification.data, 'requestTitle')
          ),
          link: `${PATHS.REQUEST_PAGE}/${get(
            notification.data,
            'requestId'
          )}?${queryString}`,
          avatar: {
            iconName: 'chatbox',
            iconProps: {
              className: 'text-neutral text-h3',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.ASSIGN_NEW_OWNER:
        formttedNotification = {
          ...formttedNotification,
          content: renderContent(
            get(notification.data, 'triggererName'),
            intl.get('APP_NOTIFICATIONS.ASSIGN_NEW_OWNER'),
            get(notification.data, 'requestTitle')
          ),
          link: `${PATHS.REQUEST_PAGE}/${get(notification.data, 'requestId')}`,
          avatar: {
            imageSrc: 'https://i.pravatar.cc/300',
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_USER_ASSIGNED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_USER_ASSIGNED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            imageSrc: 'https://i.pravatar.cc/300',
          },
        };
        break;
      case NOTIFICATION_TYPE.PROJECT_OWNER_ASSIGNED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.PROJECT_OWNER_ASSIGNED', {
            userName: get(notification, 'data.triggererName'),
            projectName: get(notification, 'data.projectTitle'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(notification, 'data.projectId')}`,
          avatar: {
            imageSrc: 'https://i.pravatar.cc/300',
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_USER_UNASSIGNED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_USER_UNASSIGNED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            imageSrc: 'https://i.pravatar.cc/300',
          },
        };
        break;
      case NOTIFICATION_TYPE.PROJECT_OWNER_UNASSIGNED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.PROJECT_OWNER_UNASSIGNED', {
            userName: get(notification, 'data.triggererName'),
            projectName: get(notification, 'data.projectTitle'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(notification, 'data.projectId')}`,
          avatar: {
            imageSrc: 'https://i.pravatar.cc/300',
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_UPDATED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_UPDATED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            iconSrc: projectUpdateIcon,
            iconProps: {
              className: 'w-6 h-6',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_STATUS_UPDATED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_STATUS_UPDATED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            iconSrc: statusUpdateIcon,
            iconProps: {
              className: 'w-5 h-5',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.PROJECT_STATUS_UPDATED', {
            userName: get(notification, 'data.triggererName'),
            projectName: get(notification, 'data.projectName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(notification, 'data.projectId')}`,
          avatar: {
            iconSrc: statusUpdateIcon,
            iconProps: {
              className: 'w-5 h-5',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_DISABLED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_DISABLED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
            enabled: get(notification, 'data.disabled') ? 0 : 1,
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            iconSrc: get(notification, 'data.disabled')
              ? disableIcon
              : enableIcon,
            iconProps: {
              className: 'w-6 h-6',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.PROJECT_UPDATED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.PROJECT_UPDATED', {
            userName: get(notification, 'data.triggererName'),
            projectName: get(notification, 'data.projectName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(notification, 'data.projectId')}`,
          avatar: {
            iconSrc: projectUpdateIcon,
            iconProps: {
              className: 'w-6 h-6',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_DELETED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.TASK_DELETED', {
            userName: get(notification, 'data.triggererName'),
            taskName: get(notification, 'data.taskName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}?tab=tasks`,
          avatar: {
            iconSrc: removeIcon,
            iconProps: {
              className: 'w-6 h-6',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.TASK_DUE_DATE:
        formttedNotification = {
          ...formttedNotification,
          content:
            get(notification, 'data.daysLeft') === 0
              ? intl.getHTML('APP_NOTIFICATIONS.TASK_PAST_DUE_DATE', {
                  taskName: get(notification, 'data.taskName'),
                })
              : intl.getHTML('APP_NOTIFICATIONS.TASK_DUE_DATE', {
                  taskName: get(notification, 'data.taskName'),
                  number: get(notification, 'data.daysLeft'),
                }),
          link: `${PATHS.PROJECT_PAGE}/${get(
            notification,
            'data.projectId'
          )}/tasks/${get(notification, 'data.taskId')}`,
          avatar: {
            iconSrc:
              get(notification, 'data.daysLeft') === 0
                ? pastDueDateIcon
                : dueDateIcon,
            iconProps: {
              className: 'w-6 h-6',
            },
          },
        };
        break;
      case NOTIFICATION_TYPE.PROJECT_COMMENTED:
        formttedNotification = {
          ...formttedNotification,
          content: intl.getHTML('APP_NOTIFICATIONS.PROJECT_COMMENTED', {
            userName: get(notification, 'data.triggererName'),
            projectName: get(notification, 'data.projectName'),
          }),
          link: `${PATHS.PROJECT_PAGE}/${get(notification, 'data.projectId')}`,
          avatar: {
            iconName: 'chatbox',
            iconProps: {
              className: 'text-neutral text-h3',
            },
          },
        };
        break;
    }

    if (formttedNotification.content) {
      formttedNotification = {
        ...formttedNotification,
        id: notification.id || '',
        time: notification.createdAt
          ? moment(notification.createdAt)?.fromNow()
          : '',
        status: notification.status,
        avatar: {
          ...formttedNotification.avatar,
          bgColorClass: 'bg-transparent',
          size: 'medium',
        },
      };
    }
    return formttedNotification;
  });
};
