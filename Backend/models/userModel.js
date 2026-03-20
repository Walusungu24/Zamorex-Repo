const pool = require('../config/db');

const createUser = async (name, phone, role, password) => {
  const result = await pool.query(
    'INSERT INTO users (name, phone, role, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, phone, role, password]
  );
  return result.rows[0];
};

const getUserByPhone = async (phone) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE phone = $1',
    [phone]
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, phone, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

module.exports = { createUser, getUserByPhone, getUserById };
