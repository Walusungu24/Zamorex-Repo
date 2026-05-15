const pool = require("../config/db");

// Create a new user
const createUser = async (name, phone, role, password) => {
  const result = await pool.query(
    "INSERT INTO users (name, phone, role, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, phone, role, password],
  );
  return result.rows[0];
};

// Find user by phone number (for login)
const getUserByPhone = async (phone) => {
  const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
    phone,
  ]);
  return result.rows[0];
};

// Get user by ID (excludes password)
const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, phone, role, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

// Get all users (admin only)
const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, phone, role, created_at FROM users ORDER BY created_at DESC",
  );
  return result.rows;
};

module.exports = { createUser, getUserByPhone, getUserById, getAllUsers };
