// cronJobs/sendReminders.js
import cron from "node-cron";
import Task from "../models/Task.js";
import { sendReminderEmail } from "../utils/mailer.js";

cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Running daily reminder job...");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueTasks = await Task.find({
    dueDate: { $gte: today, $lte: tomorrow },
    completed: false,
    isDeleted: false,
  }).populate("user");

  const userTasksMap = {};

  dueTasks.forEach((task) => {
    const userId = task.user._id.toString();
    if (!userTasksMap[userId]) {
      userTasksMap[userId] = {
        email: task.user.email,
        name: task.user.name,
        role: task.user.role || "User",
        tasks: [],
      };
    }
    userTasksMap[userId].tasks.push(task);
  });

  for (const userId in userTasksMap) {
    const { email, name, role, tasks } = userTasksMap[userId];
    try {
      await sendReminderEmail({ to: email, name, role, tasks });
      console.log(`📧 Email sent to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${email}:`, err.message);
    }
  }
});
