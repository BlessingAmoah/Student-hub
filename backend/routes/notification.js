const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const verifyToken = require('../middleware/auth');

// unread notifications for a user
router.get('/unread', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.findAll({
      where: { userId, read: false },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notifications as read
router.post('/mark-read', verifyToken, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.update({ read: true }, {
      where: { id: notificationIds }
    });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

module.exports = router;
