import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import CryptoJS from 'crypto-js';
import get from 'lodash/get';
import { selectUserId } from 'state/User/userSlice';
import config from 'config/Config';
import { FormattedNotification, NotificationType } from 'utils/customTypes';
import { NOTIFICATION_TYPE } from 'utils/constants';
import { formatNotifications } from 'utils/notificationsHelper';
import {
  getPropertiesComments,
  getQuestionComments,
} from 'state/RequestComments/requestCommentsSlice';
import { getRequest } from 'state/ActiveRequest/activeRequestSlice';
import { getNotifications } from 'state/Notifications/notificationsSlice';
import { fetchTask } from 'state/SingleTask/singleTaskSlice';
import { fetchTeamTasks } from 'state/Tasks/taskSlice';
import { fetchProject } from 'state/Project/projectSlice';
import { fetchProjects } from 'state/Projects/projectsSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [list, setList] = useState<FormattedNotification[]>([]);

  const showToast = useCallback(
    (data: {}, eventType: NotificationType) => {
      dispatch(getNotifications());
      const toastProperties = formatNotifications([
        {
          id: Date.now().toString(),
          message: eventType,
          data: data,
        },
      ]);

      setList((prevState) => {
        if (prevState.length === 4) {
          prevState.shift();
        }
        return [...prevState, ...toastProperties];
      });
    },
    [dispatch]
  );

  const channelName = useMemo(() => {
    if (userId) {
      return CryptoJS.MD5(userId).toString(CryptoJS.enc.Hex);
    }
  }, [userId]);

  const pusher = useMemo(
    () =>
      new Pusher(config.get('pusher.key'), {
        cluster: config.get('pusher.cluster'),
      }),
    []
  );

  useEffect(() => {
    if (channelName && pusher) {
      const channel = pusher.subscribe(channelName);
      channel.bind(NOTIFICATION_TYPE.ASSIGN_NEW_OWNER, async (data: {}) => {
        await dispatch(getRequest(get(data, 'requestId')));
        showToast(data, NOTIFICATION_TYPE.ASSIGN_NEW_OWNER);
      });
      channel.bind(
        NOTIFICATION_TYPE.REQUEST_STATUS_UPDATED,
        async (data: {}) => {
          await dispatch(getRequest(get(data, 'requestId')));
          showToast(data, NOTIFICATION_TYPE.REQUEST_STATUS_UPDATED);
        }
      );
      channel.bind(
        NOTIFICATION_TYPE.REQUEST_QUESTIONS_UPDATED,
        async (data: {}) => {
          await dispatch(getRequest(get(data, 'requestId')));
          showToast(data, NOTIFICATION_TYPE.REQUEST_QUESTIONS_UPDATED);
        }
      );
      channel.bind(
        NOTIFICATION_TYPE.REQUEST_ATTRIBUTES_UPDATED,
        async (data: {}) => {
          await dispatch(getRequest(get(data, 'requestId')));
          showToast(data, NOTIFICATION_TYPE.REQUEST_ATTRIBUTES_UPDATED);
        }
      );
      channel.bind(NOTIFICATION_TYPE.QUESTION_COMMENTED, async (data: {}) => {
        await dispatch(getQuestionComments(get(data, 'requestId')));
        showToast(data, NOTIFICATION_TYPE.QUESTION_COMMENTED);
      });
      channel.bind(
        NOTIFICATION_TYPE.REQUEST_PROPERTY_COMMENTED,
        async (data: {}) => {
          await dispatch(getPropertiesComments(get(data, 'requestId')));
          showToast(data, NOTIFICATION_TYPE.REQUEST_PROPERTY_COMMENTED);
        }
      );
      channel.bind(NOTIFICATION_TYPE.TASK_USER_ASSIGNED, async (data: {}) => {
        await dispatch(fetchTask(get(data, 'taskId')));
        showToast(data, NOTIFICATION_TYPE.TASK_USER_ASSIGNED);
      });
      channel.bind(NOTIFICATION_TYPE.TASK_USER_UNASSIGNED, async (data: {}) => {
        await dispatch(fetchTask(get(data, 'taskId')));
        showToast(data, NOTIFICATION_TYPE.TASK_USER_UNASSIGNED);
      });
      channel.bind(NOTIFICATION_TYPE.TASK_UPDATED, async (data: {}) => {
        await dispatch(fetchTask(get(data, 'taskId')));
        showToast(data, NOTIFICATION_TYPE.TASK_UPDATED);
      });
      channel.bind(NOTIFICATION_TYPE.TASK_STATUS_UPDATED, async (data: {}) => {
        await dispatch(fetchTask(get(data, 'taskId')));
        showToast(data, NOTIFICATION_TYPE.TASK_STATUS_UPDATED);
      });
      channel.bind(NOTIFICATION_TYPE.TASK_DISABLED, async (data: {}) => {
        await dispatch(fetchTask(get(data, 'taskId')));
        showToast(data, NOTIFICATION_TYPE.TASK_DISABLED);
      });
      channel.bind(NOTIFICATION_TYPE.TASK_DELETED, async (data: {}) => {
        await dispatch(fetchTeamTasks(get(data, 'projectId')));
        showToast(data, NOTIFICATION_TYPE.TASK_DELETED);
      });
      channel.bind(
        NOTIFICATION_TYPE.PROJECT_OWNER_ASSIGNED,
        async (data: {}) => {
          await dispatch(fetchProjects());
          await dispatch(fetchProject(get(data, 'projectId')));
          showToast(data, NOTIFICATION_TYPE.PROJECT_OWNER_ASSIGNED);
        }
      );
      channel.bind(
        NOTIFICATION_TYPE.PROJECT_OWNER_UNASSIGNED,
        async (data: {}) => {
          await dispatch(fetchProject(get(data, 'projectId')));
          showToast(data, NOTIFICATION_TYPE.PROJECT_OWNER_UNASSIGNED);
        }
      );
      channel.bind(
        NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED,
        async (data: {}) => {
          await dispatch(fetchProject(get(data, 'projectId')));
          showToast(data, NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED);
        }
      );
      channel.bind(NOTIFICATION_TYPE.PROJECT_UPDATED, async (data: {}) => {
        await dispatch(fetchProject(get(data, 'projectId')));
        showToast(data, NOTIFICATION_TYPE.PROJECT_UPDATED);
      });
      channel.bind(NOTIFICATION_TYPE.PROJECT_COMMENTED, async (data: {}) => {
        await dispatch(fetchProject(get(data, 'projectId')));
        showToast(data, NOTIFICATION_TYPE.PROJECT_COMMENTED);
      });
    }

    return () => {
      if (channelName) {
        pusher.unsubscribe(channelName);
      }
    };
  }, [channelName, dispatch, pusher, showToast]);

  return { list, setList };
};

export default useNotifications;
