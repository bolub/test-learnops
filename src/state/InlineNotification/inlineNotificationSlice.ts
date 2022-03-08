import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';

type variant = 'information' | 'success' | 'error' | 'warning';
interface InlineNotification {
  notificationVariant: variant;
  notificationText: string;
  showNotification: boolean;
  timeout: number;
}

/* ============================= INITIAL STATE ============================== */
const initialState: InlineNotification = {
  notificationVariant: 'success',
  notificationText: '',
  showNotification: false,
  timeout: 0,
};

/* ============================== REDUX THUNK =============================== */

/* ================================= REDUCER ================================ */
const inlineNotificationSlice = createSlice({
  name: 'inlineNotification',
  initialState,
  reducers: {
    hideNotification: (state) => {
      state.showNotification = false;
    },
    displayNotification: (state) => {
      state.showNotification = true;
    },
    setNotificationText: (state, action) => {
      state.notificationText = action.payload;
    },
    setNotificationTimeout: (state, action) => {
      state.timeout = action.payload;
    },
    setNotificationVariant: (state, action) => {
      state.notificationVariant = action.payload;
    },
  },
  extraReducers: () => {},
});

/* ================================ ACTIONS ================================= */
export const {
  hideNotification,
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} = inlineNotificationSlice.actions;

/* =============================== SELECTORS ================================ */
export const selectNotificationText = (state: RootState) =>
  state.inlineNotification.notificationText;
export const selectShowNotification = (state: RootState) =>
  state.inlineNotification.showNotification;
export const selectNotificationTimeout = (state: RootState) =>
  state.inlineNotification.timeout;
export const selectNotificationVariant = (state: RootState) =>
  state.inlineNotification.notificationVariant;

export default inlineNotificationSlice.reducer;
