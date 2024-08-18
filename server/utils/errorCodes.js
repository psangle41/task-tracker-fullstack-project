const ErrorCodes = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'User already exists',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized Operation',
  },

  // Tasks
  NO_FIELDS: {
    code: 'NO_FIELDS',
    message: 'No fields to update',
  },
  TASK_NOT_FOUND: {
    code: 'TASK_NOT_FOUND',
    message: 'Task not found',
  },
};

module.exports = ErrorCodes;
