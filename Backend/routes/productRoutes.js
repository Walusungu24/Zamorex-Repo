const express = require('express');
const router = express.Router();
const { addProduct, listProducts } = require('../controllers/productController');

router.post('/', addProduct);
router.get('/', listProducts);

module.exports = router;
