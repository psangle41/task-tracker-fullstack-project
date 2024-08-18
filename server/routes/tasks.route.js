const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');

const {
  getTasksById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks.controller');
const router = express.Router();

router.get('/tasks', authMiddleware, getTasksById);

router.post('/add-task', authMiddleware, createTask);

router.patch('/task/:id', authMiddleware, updateTask);

router.delete('/task/:id', authMiddleware, deleteTask);

module.exports = router;
