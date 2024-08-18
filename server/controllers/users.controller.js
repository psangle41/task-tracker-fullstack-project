const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorCodes = require('../utils/errorCodes');

const jwt_secret_key = require('../config/tokenConfig');
const {
  pool,
  userExistsModel,
  registerUserModel,
  loginUserModel,
  getUserByIdModel,
  updateUserModel,
  deleteUserModel,
} = require('../models/users.model');

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const userExists = await userExistsModel(email);
    if (userExists.length) {
      return res.status(400).json(ErrorCodes.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await registerUserModel(
      first_name,
      last_name,
      email,
      hashedPassword
    );
    const token = jwt.sign({ userId: user.id }, jwt_secret_key, {
      expiresIn: '1h',
    });
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token,
    });
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginUserModel(email);
    if (result.length === 0) {
      return res.status(404).json(ErrorCodes.USER_NOT_FOUND);
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(ErrorCodes.INVALID_CREDENTIALS);
    }
    const token = jwt.sign({ userId: user.id }, jwt_secret_key, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login Successful', token });
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

const getUserById = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await getUserByIdModel(userId);
    if (!result.length) {
      res.status(400).json(ErrorCodes.USER_NOT_FOUND);
    }
    const user = result[0];
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(ErrorCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await updateUserModel(req.body, req.userId);
    res.status(200).json({
      message: 'User Updated SuccessFully',
      user,
    });
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

const deleteUser = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(400).json(ErrorCodes.USER_NOT_FOUND);
    }
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (err) {
    res.status(500).json(ErrorCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  deleteUserModel,
};
