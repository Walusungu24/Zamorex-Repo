const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/userController');

// Register route
router.post('/register', registerUser);

module.exports = router;


// Login route
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
