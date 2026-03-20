const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const { addProduct, listProducts } = require('../controllers/productController');

// Protected route
router.post('/', authMiddleware, addProduct);

// Public route
router.get('/', listProducts);

module.exports = router;
