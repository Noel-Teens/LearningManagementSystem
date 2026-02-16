const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: String,
  message: String,
  type: String,
  isRead: {
    type: Boolean,
    default: false
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    enum: ['Course', 'Enrollment', 'User']
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
