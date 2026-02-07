const express = require("express");
const router = express.Router();
// const Notification = require('../Notification');
const Notification = require("../models/Notification");
const notificationController = require('../controllers/notificationController');

// GET all notifications
router.get("/:userId", notificationController.getNotifications);

// POST new notification
router.post("/", notificationController.createNotification);

router.get("/unread/count/:userId", notificationController.getUnreadCount);

router.put("/mark-as-read/:userId", notificationController.markAsRead);


router.post("/send", async (req, res) => {
  const notification = new Notification({
    userId: req.body.userId,
    title: req.body.title,
    message: req.body.message,
    type: req.body.type,
    isRead: false
  });

  await notification.save();
  res.status(201).json(notification);
});
// UNREAD COUNT
router.get("/unread/count/:userId", async (req, res) => {
  const count = await Notification.countDocuments({
    userId: req.params.userId,
    isRead: false
  });
  res.json({ count });
});

// GET notifications (LAST!)
router.get("/:userId", async (req, res) => {
  const data = await Notification.find({ userId: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(data);
});

module.exports = router; 
