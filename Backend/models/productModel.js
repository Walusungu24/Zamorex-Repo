const pool = require('../config/db');

const createProduct = async (name, type, price, quantity, farmerId) => {
  const result = await pool.query(
    'INSERT INTO products (name, type, price, quantity, farmer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, type, price, quantity, farmerId]
  );
  return result.rows[0];
};

const getProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

module.exports = { createProduct, getProducts };
