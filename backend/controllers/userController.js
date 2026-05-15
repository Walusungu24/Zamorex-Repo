const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register new user
const register = async (req, res) => {
  const { name, phone, role, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await userModel.getUserByPhone(phone);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.createUser(name, phone, role, hashedPassword);

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find user
    const user = await userModel.getUserByPhone(phone);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
