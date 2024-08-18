const ErrorCodes = require('../utils/errorCodes');
const {
  getAllTasksModel,
  createTaskModel,
  updateTaskModel,
  deleteTaskModel,
} = require('../models/tasks.model');

const getTasksById = async (req, res) => {
  const userId = req.userId;
  try {
    const tasks = await getAllTasksModel(userId);
    res.status(200).json(tasks);
  } catch (err) {
    console.log({ err });
    res.status(500).json({
      ...ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const createTask = async (req, res) => {
  const userId = req.userId;
  try {
    const task = await createTaskModel(req.body, userId);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json(ErrorCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const data = req.body;
  if (Object.keys(data).length === 0) {
    res.status(400).json(ErrorCodes.NO_FIELDS);
  }
  try {
    const updatedTask = await updateTaskModel(data, taskId);
    res.status(200).json(updatedTask);
  } catch (err) {
    if (err.message.includes('invalid input')) {
      return res.status(500).json({
        code: 'INVALID INPUT',
        message: err.message,
      });
    }
    res.status(500).json(ErrorCodes.INTERNAL_SERVER_ERROR);
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await deleteTaskModel(taskId);
    if (deletedTask) {
      res
        .status(200)
        .json({ message: 'Task Deleted Successfully', deleteTask });
    } else {
      res.status(500).json(ErrorCodes.TASK_NOT_FOUND);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(ErrorCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createTask,
  getTasksById,
  updateTask,
  deleteTask,
};
