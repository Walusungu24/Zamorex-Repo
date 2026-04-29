const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getPendingProducts,
    approveProduct,
    rejectProduct,
    getAllProducts
} = require('../controllers/adminController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

// Apply authentication and admin role to all routes
router.use(authMiddleware);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Product management routes
router.get('/products', getAllProducts);
router.get('/products/pending', getPendingProducts);
router.put('/products/:productId/approve', approveProduct);
router.put('/products/:productId/reject', rejectProduct);

module.exports = router;