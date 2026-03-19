const registerUser = async (req, res) => {
  const { name, phone, role, password } = req.body;

  try {
    // Temporary response (since DB is not connected yet)
    res.json({
      message: 'User registered successfully',
      user: { name, phone, role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };
