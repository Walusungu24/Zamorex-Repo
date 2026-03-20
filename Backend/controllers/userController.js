const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByPhone } = require('../models/userModel');
require('dotenv').config();

const registerUser = async (req, res) => {
  const { name, phone, role, password } = req.body;

  if (!name || !phone || !role || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  if (role === 'admin') {
    return res.status(403).json({
      message: 'Admin creation not allowed'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, phone, role, hashedPassword);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
