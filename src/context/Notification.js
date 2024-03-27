import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showNotification = () => setIsOpen(true);
  const closeNotification = () => setIsOpen(false);

  return (
    <NotificationContext.Provider value={{ isOpen, showNotification, closeNotification }}>
      {' '}
      {/* Изменено с Notification на NotificationContext */}
      {children}
    </NotificationContext.Provider>
  );
};
