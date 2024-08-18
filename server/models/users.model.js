const pool = require('../config/dbConfig');

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(250) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);
};

const userExistsModel = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows;
};

const registerUserModel = async (
  first_name,
  last_name,
  email,
  hashedPassword
) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
  VALUES ($1, $2, $3, $4) Returning *`,
    [first_name, last_name, email, hashedPassword]
  );
  return result.rows[0];
};

const loginUserModel = async (email) => {
  const result = await pool.query(`SELECT * from users WHERE email = $1`, [
    email,
  ]);
  return result.rows;
};

const getUserByIdModel = async (userId) => {
  const result = await pool.query('SELECT * FROM users where id = $1', [
    userId,
  ]);
  return result.rows;
};

const updateUserModel = async (data, userId) => {
  const { first_name, last_name, email, password } = data;
  const values = [];
  const query = [];
  if (first_name) {
    query.push(`first_name = $${query.length + 1}`);
    values.push(first_name);
  }
  if (last_name) {
    query.push(`last_name = $${query.length + 1}`);
    values.push(last_name);
  }
  if (password) {
    const hashedPassword = bcrypt.hash(password, 10);
    query.push(`password = $${query.length + 1}`);
    values.push(hashedPassword);
  }
  values.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${query.join(', ')} 
      WHERE id = $${values.length}
      RETURNING id, first_name, last_name, email`,
    values
  );
  return result.rows[0];
};

const deleteUserModel = async (userId) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [userId]
  );
  return result.rows;
};

module.exports = {
  pool,
  createUserTable,
  userExistsModel,
  registerUserModel,
  loginUserModel,
  getUserByIdModel,
  updateUserModel,
  deleteUserModel,
};
