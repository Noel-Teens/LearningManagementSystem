const cron = require("node-cron");

cron.schedule("0 10 * * *", async () => {
  console.log("Reminder job running...");
});