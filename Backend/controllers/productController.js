const {
  createProduct,
  getProducts,
  getProductById,
  getProductsByFarmer,
  deleteProduct,
  updateProduct
} = require('../models/productModel');

// Farmer only: Add new product (status defaults to 'pending')
const addProduct = async (req, res) => {
  const { name, type, price, quantity } = req.body;
  const farmerId = req.user.id;

  if (!name || !price || !quantity) {
    return res.status(400).json({
      message: 'Name, price, and quantity are required'
    });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  try {
    const product = await createProduct(name, type || 'other', price, quantity, farmerId);
    res.json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products with role-based visibility and optional filters
const listProducts = async (req, res) => {
  try {
    const { limit = 50, offset = 0, type, min_price, max_price } = req.query;
    const filters = { limit, offset };

    // Role-based visibility rules
    if (req.user.role === 'buyer') {
      filters.status = 'approved';  // Buyers see only approved products
    } else if (req.user.role === 'farmer') {
      filters.status = 'approved';  // Public endpoint shows only approved
    }

    // Apply type filter if provided
    if (type) filters.type = type;

    let products = await getProducts(filters);

    // Apply price range filters
    if (min_price) {
      products = products.filter(p => p.price >= parseFloat(min_price));
    }
    if (max_price) {
      products = products.filter(p => p.price <= parseFloat(max_price));
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product with role-based visibility
const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await getProductById(id, req.user.role);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Farmer only: Get all their own products (including pending/rejected)
const getMyProducts = async (req, res) => {
  const farmerId = req.user.id;

  try {
    // Get all products without status filter using custom query
    const products = await getProducts({ farmer_id: farmerId, status: null });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Farmer only: Delete their own product
const removeProduct = async (req, res) => {
  const { id } = req.params;
  const farmerId = req.user.id;

  try {
    const deleted = await deleteProduct(id, farmerId);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found or not yours' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Farmer only: Update their product (resets status to pending)
const updateProductController = async (req, res) => {
  const { id } = req.params;
  const { name, type, price, quantity } = req.body;
  const farmerId = req.user.id;

  if (!name && !type && !price && !quantity) {
    return res.status(400).json({ message: 'At least one field to update is required' });
  }

  if (price && (isNaN(price) || price <= 0)) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (quantity && (isNaN(quantity) || quantity < 0)) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  try {
    const updated = await updateProduct(id, farmerId, { name, type, price, quantity });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found or not yours' });
    }

    res.json({
      success: true,
      message: 'Product updated and pending approval',
      product: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addProduct,
  listProducts,
  getProduct,
  getMyProducts,
  removeProduct,
  updateProductController
};