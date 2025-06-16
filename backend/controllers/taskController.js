const Task = require("../models/Task");

exports.getCurrentUserTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "manager") {
      tasks = await Task.find().populate("assignedTo", "username");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate(
        "assignedTo",
        "username"
      );
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "username"
    );
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (
      task.assignedTo._id.toString() !== req.user.id &&
      req.user.role !== "manager"
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (
      task.assignedTo.toString() !== req.user.id &&
      req.user.role !== "manager"
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }
    await task.deleteOne();
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
