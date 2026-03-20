const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
  addProduct, 
  listProducts, 
  getProduct, 
  getMyProducts, 
  removeProduct 
} = require('../controllers/productController');

// Public routes
router.get('/', listProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication)
router.post('/', authMiddleware, addProduct);
router.get('/my-products', authMiddleware, getMyProducts);
router.delete('/:id', authMiddleware, removeProduct);

module.exports = router;
