
const { createProduct, getProducts } = require('../models/productModel');

const addProduct = async (req, res) => {
  const { name, type, price, quantity, farmerId } = req.body;
  try {
    const product = await createProduct(name, type, price, quantity, farmerId);
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

module.exports = { addProduct, listProducts };
