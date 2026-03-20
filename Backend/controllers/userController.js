const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser, getUserByPhone } = require('../models/userModel');

// REGISTER
const registerUser = async (req, res) => {
  const { name, phone, role, password } = req.body;

  if (!name || !phone || !role || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, phone, role, hashedPassword);

    res.json({
      message: 'User registered successfully',
      user: newUser
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      message: 'Phone and password are required'
    });
  }

  try {
    const user = await getUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'your_secret_key',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// EXPORT BOTH FUNCTIONS
module.exports = { registerUser, loginUser };
