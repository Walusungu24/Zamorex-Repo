const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateProfile,
  getPublicFarmerProfile,
  checkProfileComplete,
} = require("../controllers/profileController");

// Farmer routes (protected)
router.get("/me", authMiddleware, authorize("farmer"), getMyProfile);
router.put("/me", authMiddleware, authorize("farmer"), updateProfile);
router.get("/check", authMiddleware, authorize("farmer"), checkProfileComplete);

// Public routes
router.get("/farmer/:farmerId", getPublicFarmerProfile);

module.exports = router;
