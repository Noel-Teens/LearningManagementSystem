const cron = require("node-cron");
const Enrollment = require("../../Enrollment/enrollment.model");
const sendEmail = require("../utils/sendmail");

// Schedule: Run every day at 10:00 AM
cron.schedule("0 10 * * *", async () => {
  console.log("Running daily reminder cron job...");

  try {
    // Find active enrollments
    const enrollments = await Enrollment.find({ status: "active" })
      .populate("learnerId")
      .populate("courseId");

    for (const enrollment of enrollments) {
      const user = enrollment.learnerId;
      const course = enrollment.courseId;

      if (user && user.email && course) {
        console.log(`Sending reminder to ${user.email} for course ${course.title}`);

        await sendEmail(
          user.email,
          "Course Reminder",
          `Hi ${user.name},\n\nDon't forget to continue your progress in "${course.title}".\n\nHappy Learning!`
        );
      }
    }
  } catch (error) {
    console.error("Error in reminder cron job:", error);
  }
});

