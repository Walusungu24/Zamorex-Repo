const pool = require('../config/db');

const createProduct = async (name, type, price, quantity, farmerId) => {
  const result = await pool.query(
    'INSERT INTO products (name, type, price, quantity, farmer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, type, price, quantity, farmerId]
  );
  return result.rows[0];
};

const getProducts = async () => {
  const result = await pool.query(
    'SELECT p.*, u.name as farmer_name FROM products p JOIN users u ON p.farmer_id = u.id'
  );
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    'SELECT p.*, u.name as farmer_name FROM products p JOIN users u ON p.farmer_id = u.id WHERE p.id = $1',
    [id]
  );
  return result.rows[0];
};

const getProductsByFarmer = async (farmerId) => {
  const result = await pool.query(
    'SELECT * FROM products WHERE farmer_id = $1',
    [farmerId]
  );
  return result.rows;
};

const deleteProduct = async (id, farmerId) => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 AND farmer_id = $2 RETURNING *',
    [id, farmerId]
  );
  return result.rows[0];
};

module.exports = { 
  createProduct, 
  getProducts, 
  getProductById, 
  getProductsByFarmer,
  deleteProduct
};
