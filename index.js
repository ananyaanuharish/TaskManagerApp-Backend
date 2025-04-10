import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import "./cronJobs/sendReminders.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// ✅ CORS: allow frontend connection from Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,              // allow cookies/auth headers
  })
);

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
