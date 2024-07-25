import React, { useEffect, useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSSE } from './SSEContext';
import NotificationDrawer from './NotificationDrawer';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { eventSource } = useSSE();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/notification/unread`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();

    const handleNotification = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prevNotifications => [data, ...prevNotifications]);
    };
    if (eventSource) {
      eventSource.addEventListener('notification', handleNotification);
    }

    return () => {
      if (eventSource) {
        eventSource.removeEventListener('notification', handleNotification);
      }
    };
  }, [eventSource]);

  const handleClick = () => {
    setIsOpenDrawer(true);
    markNotificationsAsRead();
  };

  const markNotificationsAsRead = async () => {
    const notificationIds = notifications.map(n => n.id);
    const unreadNotifications = notifications.filter(n => !n.read);
    await fetch(`${process.env.REACT_APP_API}/notification/mark-read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationIds })
    });
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: unreadNotifications.some(n => n.id === notification.id) ? true : notification.read
    })));
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationDrawer open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} notifications={notifications} />
    </>
  );
};

export default NotificationIcon;
