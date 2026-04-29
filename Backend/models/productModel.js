const pool = require('../config/db');

// Create a new product with pending status
const createProduct = async (name, type, price, quantity, farmerId) => {
  const result = await pool.query(
    'INSERT INTO products (name, type, price, quantity, farmer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, type, price, quantity, farmerId]
  );
  return result.rows[0];
};

// Get products with optional filters (status, farmer_id) and pagination
const getProducts = async (filters = {}) => {
  const { status, farmer_id, limit = 50, offset = 0 } = filters;
  let query = `
    SELECT p.*, u.name as farmer_name, u.phone as farmer_phone
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    WHERE 1=1
  `;
  const values = [];
  let paramCount = 1;

  // Apply status filter if provided
  if (status) {
    query += ` AND p.status = $${paramCount++}`;
    values.push(status);
  }

  // Apply farmer filter if provided
  if (farmer_id) {
    query += ` AND p.farmer_id = $${paramCount++}`;
    values.push(farmer_id);
  }

  // Add pagination
  query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

// Get single product with role-based visibility (admin sees all, others see only approved)
const getProductById = async (productId, requesterRole = null) => {
  let query = `
    SELECT p.*, u.name as farmer_name, u.phone as farmer_phone
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    WHERE p.id = $1
  `;

  // Restrict to approved products for non-admin users
  if (requesterRole !== 'admin') {
    query += ` AND p.status = 'approved'`;
  }

  const result = await pool.query(query, [productId]);
  return result.rows[0];
};

// Get all products belonging to a specific farmer
const getProductsByFarmer = async (farmerId) => {
  const result = await pool.query(
    'SELECT * FROM products WHERE farmer_id = $1',
    [farmerId]
  );
  return result.rows;
};

// Delete product only if it belongs to the specified farmer
const deleteProduct = async (id, farmerId) => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 AND farmer_id = $2 RETURNING *',
    [id, farmerId]
  );
  return result.rows[0];
};

// Admin only: Update product status (approve/reject)
const updateProductStatus = async (productId, status, adminId) => {
  const query = `
    UPDATE products 
    SET status = $1, updated_at = NOW()
    WHERE id = $2 AND EXISTS (
      SELECT 1 FROM users WHERE id = $3 AND role = 'admin'
    )
    RETURNING *
  `;
  const result = await pool.query(query, [status, productId, adminId]);
  return result.rows[0];
};

// Farmer only: Update product details, resets status to pending for re-approval
const updateProduct = async (productId, farmerId, updates) => {
  const { name, type, price, quantity } = updates;
  const query = `
    UPDATE products 
    SET name = COALESCE($1, name),
        type = COALESCE($2, type),
        price = COALESCE($3, price),
        quantity = COALESCE($4, quantity),
        status = 'pending',
        updated_at = NOW()
    WHERE id = $5 AND farmer_id = $6
    RETURNING *
  `;
  const result = await pool.query(query, [name, type, price, quantity, productId, farmerId]);
  return result.rows[0];
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsByFarmer,
  deleteProduct,
  updateProductStatus,
  updateProduct
};