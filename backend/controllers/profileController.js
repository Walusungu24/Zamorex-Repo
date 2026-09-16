const profileModel = require("../models/profileModel");

// Get farmer profile (for farmer to view/edit)
const getMyProfile = async (req, res) => {
  try {
    const profile = await profileModel.getProfileByFarmerId(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or update profile
const updateProfile = async (req, res) => {
  const { farm_name, location, whatsapp, bio, profile_picture } = req.body;

  try {
    const profile = await profileModel.upsertProfile(req.user.id, {
      farm_name,
      location,
      whatsapp,
      bio,
      profile_picture,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get public farmer profile (for buyers viewing)
const getPublicFarmerProfile = async (req, res) => {
  const { farmerId } = req.params;

  try {
    const farmer = await profileModel.getFarmerWithProfile(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check if profile is complete (for onboarding prompt)
const checkProfileComplete = async (req, res) => {
  try {
    const isComplete = await profileModel.isProfileComplete(req.user.id);
    res.json({ success: true, isComplete });
  } catch (error) {
    console.error("Error checking profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  getPublicFarmerProfile,
  checkProfileComplete,
};
