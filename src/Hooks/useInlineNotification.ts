import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';

type variant = 'information' | 'success' | 'error' | 'warning';

const useInlineNotification = () => {
  const dispatch = useDispatch();

  const showInlineNotification = useCallback(
    (variant: variant, message: string, timeOut: number = 4000) => {
      dispatch(setNotificationVariant(variant));
      dispatch(setNotificationText(message));
      dispatch(setNotificationTimeout(timeOut));
      dispatch(displayNotification());
    },
    [dispatch]
  );

  return { showInlineNotification };
};

export default useInlineNotification;
