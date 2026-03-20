const { 
  createProduct, 
  getProducts, 
  getProductById, 
  getProductsByFarmer,
  deleteProduct 
} = require('../models/productModel');

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

const listProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  const farmerId = req.user.id;

  try {
    const products = await getProductsByFarmer(farmerId);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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

module.exports = { 
  addProduct, 
  listProducts, 
  getProduct, 
  getMyProducts, 
  removeProduct 
};
