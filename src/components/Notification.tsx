import { Dispatch, SetStateAction } from 'react';

export const showNotification = (
  notification: string,
  setNotification: Dispatch<SetStateAction<string | null>>,
) => {
  setNotification(notification);
  setTimeout(() => {
    setNotification(null);
  }, 3000); // 3 seconds
};