const cron = require("node-cron");
const Enrollment = require("../../Enrollment/enrollment.model");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendmail");

// Schedule: Run every minute to check for recent enrollments
cron.schedule("* * * * *", async () => {
    try {
        console.log("[Watcher] Checking for new enrollments...");
        // Find enrollments created in the last 10 minutes (increased window)
        const checkWindow = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

        // const checkWindow = new Date(Date.now() - 10 * 60 * 1000);

        const newEnrollments = await Enrollment.find({
            createdAt: { $gte: checkWindow }
        })
            .populate("learnerId")
            .populate("courseId");

        console.log(`[Watcher] Found ${newEnrollments.length} recent enrollments.`);

        for (const enrollment of newEnrollments) {

            // Check if we already notified for this enrollment
            const existingNotification = await Notification.findOne({
                referenceId: enrollment._id,
                onModel: 'Enrollment'
            });

            if (existingNotification) {

                continue;
            }

            const user = enrollment.learnerId;
            const course = enrollment.courseId;

            if (!user || !course) {
                console.log("[Watcher] Missing user or course data for enrollment", enrollment._id);
                continue;
            }

            // 1. Create In-App Notification
            await Notification.create({
                userId: user._id,
                title: "Course Enrollment Successful",
                message: `You have successfully enrolled in: ${course.title}`,
                type: "success",
                referenceId: enrollment._id,
                onModel: 'Enrollment'
            });

            console.log(`[Watcher] Notification created for enrollment ${enrollment._id}`);

            // 2. Send Email
            if (user.email) {
                try {
                    await sendEmail(
                        user.email,
                        "Enrollment Confirmed",
                        `Hello ${user.name},\n\nYou have successfully enrolled in "${course.title}".\n\nGo to your dashboard to start learning!\n\nBest,\nLMS Team`
                    );
                    console.log(`[Watcher] Email sent to ${user.email}`);
                } catch (err) {
                    console.error(`[Watcher] Failed to send email for ${enrollment._id}`, err);
                }
            }
        }
    } catch (error) {
        console.error("Error in enrollment watcher:", error);
    }
});
