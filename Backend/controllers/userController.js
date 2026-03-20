const { createUser } = require('../models/userModel');

const registerUser = async (req, res) => {
  const { name, phone, role, password } = req.body;

   if (!name || !phone || !role || !password) {
    return res.status(400).json({
      message: 'All fields (name, phone, role, password) are required'
    });
  }

  try {
    const newUser = await createUser(name, phone, role, password);

    res.json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };



const { createUser, getUserByPhone } = require('../models/userModel');

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  // Validation
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

    // Simple password check (we will improve later)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
