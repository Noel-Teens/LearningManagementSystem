const express = require("express");
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications
router.get("/:userId", notificationController.getNotifications);

// POST new notification
router.post("/", notificationController.createNotification);

// Get unread count
router.get("/unread/count/:userId", notificationController.getUnreadCount);

// Mark as read
router.put("/mark-as-read/:userId", notificationController.markAsRead);

module.exports = router;
