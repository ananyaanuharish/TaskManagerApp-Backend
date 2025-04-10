// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail", // or use your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReminderEmail = async ({ to, name, role, tasks }) => {
  const dueTasksList = tasks
    .map((task) => `<li><strong>${task.title}</strong> - Due: ${new Date(task.dueDate).toLocaleDateString()}</li>`)
    .join("");

  const mailOptions = {
    from: `"Task Manager Team 👨‍💻" <${process.env.EMAIL_USER}>`,
    to,
    subject: "⏰ Task Due Reminder",
    html: `
      <h2>Hello ${name} (${role}),</h2>
      <p>This is a reminder that the following task(s) are due today or tomorrow:</p>
      <ul>${dueTasksList}</ul>
      <p>Please check your dashboard for more details.</p>
      <p>🚀 Stay productive,<br/>Your Task Manager Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
