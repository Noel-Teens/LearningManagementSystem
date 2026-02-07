const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendmail");


/* CREATE / SEND NOTIFICATION */
exports.createNotification = async (req, res) => {
  try {
    const { userId, email, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = await Notification.create({
      userId: userId,   
      title,
      message,
      type
    });
    console.log("User ID:", userId);


    // optional email
    // if (email) await sendEmail(email, title, message);

    return res.status(201).json({
      message: "Notification sent successfully",
      notification
    });


  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/* GET NOTIFICATIONS (by userId param) */
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;   // ✅ FIX

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    return res.json(notifications);

  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    userId: req.params.userId,
    isRead: false
  });
  res.json({ count });
};

exports.markAsRead = async (req, res) => {
  await Notification.updateMany(
    { userId: req.params.userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: "Notifications marked as read" });
};
