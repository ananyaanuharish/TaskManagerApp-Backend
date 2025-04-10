import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get All Active Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Single Task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized or Task not found" });
    }

    const { title, description, completed, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// Soft Delete Task (Move to Recycle Bin)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found or already deleted" });
    }

    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.status(200).json({ msg: "Task moved to Recycle Bin" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Deleted Tasks (Recycle Bin)
export const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Restore Task from Recycle Bin
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found in Recycle Bin" });
    }

    task.isDeleted = false;
    task.deletedAt = null;
    await task.save();

    res.status(200).json({ msg: "Task restored successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Permanently Delete Tasks Older Than 30 Days
export const permanentDeleteExpiredTasks = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const result = await Task.deleteMany({
      isDeleted: true,
      deletedAt: { $lt: thirtyDaysAgo },
    });

    console.log(`${result.deletedCount} old tasks permanently deleted`);
  } catch (error) {
    console.error("Error during permanent deletion:", error.message);
  }
};
