const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller.js');

router.post('/user/register', registerUser);

router.post('/user/login', loginUser);

router.get('/user', authMiddleware, getUserById);

router.patch('/user', authMiddleware, updateUser);

router.delete('/user', authMiddleware, deleteUser);

module.exports = router;
