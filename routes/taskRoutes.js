import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDeletedTasks,
  restoreTask,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// ✅ Recycle Bin (deleted tasks) — must come BEFORE `/:id`
router.get("/deleted", getDeletedTasks);

// ✅ Restore from Recycle Bin
router.put("/restore/:id", restoreTask);

// 🔁 Active Tasks
router.route("/")
  .post(createTask)
  .get(getTasks);

// 📄 Single Task (placed at the bottom)
router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
