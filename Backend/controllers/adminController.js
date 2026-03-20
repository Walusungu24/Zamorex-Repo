const pool = require('../config/db');

// GET ALL USERS (ADMIN ONLY)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, phone, role FROM users'
    );

    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE USER (ADMIN ONLY)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, deleteUser };
