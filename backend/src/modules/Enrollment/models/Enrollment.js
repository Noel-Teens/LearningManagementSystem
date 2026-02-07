const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  studentName: String,
  studentEmail: String,
  courseName: String,
  courseId: String,
  completed: Boolean
});

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema,
  "enrollments" // 👈 collection name in MongoDB
);
