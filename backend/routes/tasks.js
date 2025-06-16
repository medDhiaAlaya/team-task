const express = require("express");
const router = express.Router();
const { auth, checkRoles } = require("../middleware/auth");
const {
  getCurrentUserTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Get tasks for logged-in user
router.get("/", auth, getCurrentUserTasks);

// Create task (manager only)
router.post("/", auth, checkRoles(["admin"]), createTask);

// Update task
router.put("/:id", auth, updateTask);

// Delete task
router.delete("/:id", auth, deleteTask);

module.exports = router;
