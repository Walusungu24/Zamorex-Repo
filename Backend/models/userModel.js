const pool = require('../config/db');

const createUser = async (name, phone, role, password) => {
  const result = await pool.query(
    'INSERT INTO users (name, phone, role, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, phone, role, password]
  );

  return result.rows[0];
};

module.exports = { createUser };
