const { createUser } = require('../models/userModel');

const registerUser = async (req, res) => {
  const { name, phone, role, password } = req.body;

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
