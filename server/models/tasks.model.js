const pool = require('../config/dbConfig');

const createTaskTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority VARCHAR(10) CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')) NOT NULL DEFAULT 'MEDIUM',
      starred BOOLEAN DEFAULT FALSE,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const getAllTasksModel = async (userId) => {
  const result = await pool.query(
    `
  SELECT * FROM tasks WHERE user_id = $1
  `,
    [userId]
  );
  return result.rows;
};

const createTaskModel = async (data, userId) => {
  const {
    title,
    description,
    priority = 'HIGH',
    starred = false,
    isCompleted = false,
  } = data;
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, 
      starred, is_completed, user_id)
      VALUES($1, $2, $3, $4, $5, $6 )
      RETURNING *`,
    [title, description, priority, starred, isCompleted, userId]
  );
  return result.rows[0];
};

const updateTaskModel = async (data, id) => {
  const query = [];
  const values = [];
  let index = 1;

  Object.keys(data).forEach((key) => {
    if (key) {
      query.push(`${key}= $${index++}`);
    }
    values.push(data[key]);
  });
  values.push(id);

  const result = await pool.query(
    `UPDATE tasks
    SET ${query.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING id, title, description, priority, 
    starred, is_completed`,
    values
  );
  return result.rows[0];
};

const deleteTaskModel = async (id) => {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1
    RETURNING id, title, description, priority, 
    starred, is_completed`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTaskTable,
  getAllTasksModel,
  createTaskModel,
  updateTaskModel,
  deleteTaskModel,
};
