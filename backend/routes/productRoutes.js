const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const { validateProduct } = require("../middleware/validation");
const {
  addProduct,
  listProducts,
  getProduct,
  getMyProducts,
  removeProduct,
  updateProductController,
} = require("../controllers/productController");

// Public routes (anyone can view products)
router.get("/", listProducts);

// Farmer only routes - SPECIFIC routes MUST come BEFORE parameter routes
router.get("/my-products", authMiddleware, authorize("farmer"), getMyProducts);
router.post(
  "/",
  authMiddleware,
  authorize("farmer"),
  validateProduct,
  addProduct,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("farmer"),
  validateProduct,
  updateProductController,
);
router.delete("/:id", authMiddleware, authorize("farmer"), removeProduct);

// Parameter route - MUST be LAST
router.get("/:id", getProduct);

module.exports = router;
