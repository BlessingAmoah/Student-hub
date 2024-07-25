import React, { useEffect, useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSSE } from './SSEContext';
import NotificationDrawer from './NotificationDrawer';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { eventSource } = useSSE();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/notifications/unread`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();

    eventSource.addEventListener('notification', (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prevNotifications => [data, ...prevNotifications]);
    });

    return () => {
      if (eventSource) {
        eventSource.removeEventListener('notification');
      }
    };
  }, [eventSource]);

  const handleClick = () => {
    setOpenDrawer(true);
    markNotificationsAsRead();
  };

  const markNotificationsAsRead = async () => {
    const notificationIds = notifications.map(n => n.id);
    await fetch(`${process.env.REACT_APP_API}/notifications/mark-read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationIds })
    });
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} notifications={notifications} />
    </>
  );
};

export default NotificationIcon;
