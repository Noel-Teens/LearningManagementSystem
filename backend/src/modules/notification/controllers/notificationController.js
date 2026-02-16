const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendmail");
const User = require("../../auth/user.model"); // Import User model


/* CREATE / SEND NOTIFICATION */
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

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

    // Fetch user email if not provided in body (usually it won't be)
    let userEmail = req.body.email;
    if (!userEmail) {
      const user = await User.findById(userId);
      if (user) {
        userEmail = user.email;
      }
    }

    // Send email if address is available
    if (userEmail) {
      try {
        await sendEmail(userEmail, title, message);
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
        // Don't fail the request if email fails, just log it
      }
    }

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
    const { userId } = req.params;
    console.log(`[API] STEP 1: Fetching notifications for user: ${userId}`);

    if (!userId) throw new Error("UserId is undefined");

    console.log("[API] STEP 2: Calling Notification.find");
    const notifications = await Notification.find({ userId: userId })
      .sort({ createdAt: -1 });

    console.log(`[API] STEP 3: Found ${notifications ? notifications.length : 'null'}`);

    return res.json(notifications);

  } catch (error) {
    console.error(`[API] ERROR in getNotifications: ${error.message}`);
    console.error(error);
    return res.status(500).json({ error: "Server error: " + error.message });
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
