// cronJobs/testReminder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import "../config/db.js"; // adjust if your DB connection file is elsewhere
import "./sendReminders.js";

dotenv.config();

setTimeout(() => {
  console.log("✅ Manual test run complete. Check your inbox!");
  mongoose.connection.close(); // clean exit
}, 5000);
