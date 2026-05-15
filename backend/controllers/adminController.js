const pool = require("../config/db");
const productModel = require("../models/productModel");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, phone, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all pending products for review
const getPendingProducts = async (req, res) => {
  try {
    const products = await productModel.getProducts({ status: "pending" });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve a product
const approveProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productModel.updateProductStatus(
      productId,
      "approved",
      req.user.id,
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product approved successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a product
const rejectProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productModel.updateProductStatus(
      productId,
      "rejected",
      req.user.id,
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product rejected successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products with optional status filter
const getAllProducts = async (req, res) => {
  const { status } = req.query;

  try {
    const filters = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filters.status = status;
    }

    const products = await productModel.getProducts(filters);
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllProducts,
};
