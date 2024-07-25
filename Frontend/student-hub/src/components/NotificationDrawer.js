import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const NotificationDrawer = ({ open, onClose, notifications }) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <IconButton onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
      <CloseIcon />
    </IconButton>
    <List style={{ paddingTop: 30}}>
      {notifications.map(notification => (
        <ListItem key={notification.id}>
          <ListItemText primary={notification.message} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default NotificationDrawer;
