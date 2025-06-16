const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get tasks for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'manager') {
      tasks = await Task.find().populate('assignedTo', 'username');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'username');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create task (manager only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Access denied' });
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    await task.deleteOne();
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;