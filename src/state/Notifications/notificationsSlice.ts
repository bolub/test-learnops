import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { Notification, Status } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';
import notificationsApi from './notificationAPI';

interface NotificationsState {
  notifications: Notification[];
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: NotificationsState = {
  notifications: [],
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getNotifications = createAsyncThunk(
  'notifications/GET_NOTIFICATIONS',
  async () => {
    const { data } = await notificationsApi.fetchNotifications();
    return data.notifications;
  }
);

export const updateNotification = createAsyncThunk(
  'notifications/UPDATE_NOTIFICATION',
  async (params: { id: string; newData: Notification }) => {
    const { data } = await notificationsApi.updateNotification(
      params.id,
      params.newData
    );
    return data.notification;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/MARK_ALL_AS_READ',
  async () => {
    const { data } = await notificationsApi.markAllAsRead();
    return data;
  }
);

export const markAllAsSeen = createAsyncThunk(
  'notifications/MARK_ALL_AS_SEEN',
  async () => {
    const { data } = await notificationsApi.markAllAsSeen();
    return data;
  }
);
/* ================================= REDUCER ================================ */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getNotifications.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(updateNotification.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(updateNotification.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.status = SLICE_STATUS.IDLE;
        state.notifications = state.notifications.map((notification) => {
          if (notification.id === action.payload.id) {
            return action.payload;
          } else {
            return notification;
          }
        });
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(markAllAsRead.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.status = SLICE_STATUS.IDLE;
        const updatedNotifications = action.payload.updatedRows.filter(
          (updatedNotification: Notification) =>
            state.notifications.find(
              (notification) => notification.id === updatedNotification.id
            )
        );
        const nonUpdatedNotifications = state.notifications.filter(
          (notification: Notification) =>
            !action.payload.updatedRows.find(
              (updatedNotification: Notification) =>
                updatedNotification.id === notification.id
            )
        );
        state.notifications = [
          ...updatedNotifications,
          ...nonUpdatedNotifications,
        ];
      })
      .addCase(markAllAsSeen.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(markAllAsSeen.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(markAllAsSeen.fulfilled, (state, action) => {
        state.status = SLICE_STATUS.IDLE;
        const updatedNotifications = action.payload.updatedRows.filter(
          (updatedNotification: Notification) =>
            state.notifications.find(
              (notification) => notification.id === updatedNotification.id
            )
        );
        const nonUpdatedNotifications = state.notifications.filter(
          (notification: Notification) =>
            !action.payload.updatedRows.find(
              (updatedNotification: Notification) =>
                updatedNotification.id === notification.id
            )
        );
        state.notifications = [
          ...updatedNotifications,
          ...nonUpdatedNotifications,
        ];
      });
  },
});

/* ================================ ACTIONS ================================= */

/* =============================== SELECTORS ================================ */
export const selectNotifications = (state: RootState) => {
  if (state.notifications.notifications.length > 0) {
    return state.notifications.notifications
      .slice()
      .sort(
        (notificationA, notificationB) =>
          new Date(notificationB.createdAt || '').valueOf() -
          new Date(notificationA.createdAt || '').valueOf()
      );
  }
  return state.notifications.notifications;
};

export const selectNotificationsStatus = (state: RootState) =>
  state.notifications.status;
export const selectNotification = (state: RootState, id: string) =>
  state.notifications.notifications.find(
    (notification) => notification.id === id
  );

export default notificationsSlice.reducer;
