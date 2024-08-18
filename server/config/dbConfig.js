const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task-tracker',
  password: 'postgres',
  port: 5433,
});

module.exports = pool;
