const pool = require("../config/db");
const {
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../models/productModel");

// Farmer only: Add new product (status defaults to 'pending')
const addProduct = async (req, res) => {
  const { name, type, price, quantity } = req.body;
  const farmerId = req.user.id;

  try {
    const product = await createProduct(
      name,
      type || "other",
      price,
      quantity,
      farmerId,
    );
    res.json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all approved products with pagination and filtering
const listProducts = async (req, res) => {
  try {
    const { type, min_price, max_price, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT p.*, u.name as farmer_name 
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.status = 'approved'
    `;
    const values = [];
    let paramCount = 1;

    // Apply type filter
    if (type) {
      query += ` AND p.type = $${paramCount++}`;
      values.push(type);
    }

    // Get total count for pagination
    const countQuery = query.replace(
      "SELECT p.*, u.name as farmer_name",
      "SELECT COUNT(*) as total",
    );
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit), offset);

    const result = await pool.query(query, values);
    let products = result.rows;

    // Apply price filters in memory
    if (min_price) {
      products = products.filter(
        (p) => parseFloat(p.price) >= parseFloat(min_price),
      );
    }
    if (max_price) {
      products = products.filter(
        (p) => parseFloat(p.price) <= parseFloat(max_price),
      );
    }

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("List products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await getProductById(id, req.user?.role);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Farmer only: Get all their own products (including pending/rejected)
const getMyProducts = async (req, res) => {
  const farmerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE farmer_id = $1 
       ORDER BY created_at DESC`,
      [farmerId],
    );

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Farmer only: Delete their own product
const removeProduct = async (req, res) => {
  const { id } = req.params;
  const farmerId = req.user.id;

  try {
    const deleted = await deleteProduct(id, farmerId);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Product not found or not yours" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Farmer only: Update their product (resets status to pending)
const updateProductController = async (req, res) => {
  const { id } = req.params;
  const { name, type, price, quantity } = req.body;
  const farmerId = req.user.id;

  try {
    const updated = await updateProduct(id, farmerId, {
      name,
      type,
      price,
      quantity,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Product not found or not yours" });
    }

    res.json({
      success: true,
      message: "Product updated and pending approval",
      product: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProduct,
  listProducts,
  getProduct,
  getMyProducts,
  removeProduct,
  updateProductController,
};
