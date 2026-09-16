const pool = require('../config/db');

// Create or update farmer profile
const upsertProfile = async (farmerId, profileData) => {
  const { farm_name, location, whatsapp, bio, profile_picture } = profileData;
  
  const query = `
    INSERT INTO farmer_profiles (farmer_id, farm_name, location, whatsapp, bio, profile_picture, is_complete, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
    ON CONFLICT (farmer_id) 
    DO UPDATE SET 
      farm_name = COALESCE($2, farm_name),
      location = COALESCE($3, location),
      whatsapp = COALESCE($4, whatsapp),
      bio = COALESCE($5, bio),
      profile_picture = COALESCE($6, profile_picture),
      is_complete = TRUE,
      updated_at = NOW()
    RETURNING *
  `;
  
  const result = await pool.query(query, [
    farmerId, farm_name, location, whatsapp, bio, profile_picture
  ]);
  
  // Update users table profile_completed flag
  await pool.query(
    'UPDATE users SET profile_completed = TRUE WHERE id = $1',
    [farmerId]
  );
  
  return result.rows[0];
};

// Get profile by farmer ID
const getProfileByFarmerId = async (farmerId) => {
  const query = `
    SELECT fp.*, u.name, u.phone, u.role, u.created_at
    FROM farmer_profiles fp
    JOIN users u ON fp.farmer_id = u.id
    WHERE fp.farmer_id = $1
  `;
  const result = await pool.query(query, [farmerId]);
  return result.rows[0];
};

// Get farmer by ID with profile (for public view)
const getFarmerWithProfile = async (farmerId) => {
  const query = `
    SELECT 
      u.id, u.name, u.phone, u.role, u.created_at, u.profile_completed,
      fp.farm_name, fp.location, fp.whatsapp, fp.bio, fp.profile_picture,
      (
        SELECT json_agg(p.*) 
        FROM products p 
        WHERE p.farmer_id = u.id AND p.status = 'approved'
      ) as products
    FROM users u
    LEFT JOIN farmer_profiles fp ON u.id = fp.farmer_id
    WHERE u.id = $1 AND u.role = 'farmer'
  `;
  const result = await pool.query(query, [farmerId]);
  return result.rows[0];
};

// Check if farmer has completed profile
const isProfileComplete = async (farmerId) => {
  const query = `
    SELECT is_complete FROM farmer_profiles WHERE farmer_id = $1
  `;
  const result = await pool.query(query, [farmerId]);
  return result.rows[0]?.is_complete || false;
};

module.exports = {
  upsertProfile,
  getProfileByFarmerId,
  getFarmerWithProfile,
  isProfileComplete
};