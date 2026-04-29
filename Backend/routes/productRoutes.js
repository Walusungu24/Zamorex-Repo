const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  addProduct,
  listProducts,
  getProduct,
  getMyProducts,
  removeProduct,
  updateProductController
} = require('../controllers/productController');

// Public routes (anyone can view products, but with role-based filtering in controller)
router.get('/', listProducts);
router.get('/:id', getProduct);

// Farmer only routes
router.post('/', authMiddleware, authorize('farmer'), addProduct);
router.get('/my-products', authMiddleware, authorize('farmer'), getMyProducts);
router.put('/:id', authMiddleware, authorize('farmer'), updateProductController);
router.delete('/:id', authMiddleware, authorize('farmer'), removeProduct);

module.exports = router;