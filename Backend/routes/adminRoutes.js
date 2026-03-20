const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.get('/users', authMiddleware, authorize('admin'), getAllUsers);
router.delete('/users/:id', authMiddleware, authorize('admin'), deleteUser);

module.exports = router;
