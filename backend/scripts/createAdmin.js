const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

// Log environment variables to debug (remove after testing)
console.log("Checking environment...");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createAdmin = async () => {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const result = await pool.query(
      `INSERT INTO users (name, phone, role, password) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (phone) DO NOTHING
       RETURNING id, name, phone, role`,
      ["Admin User", "0987654321", "admin", hashedPassword],
    );

    if (result.rows.length > 0) {
      console.log("✅ Admin created successfully!");
      console.log("   Phone: 0987654321");
      console.log("   Password: admin123");
      console.log("   User ID:", result.rows[0].id);
    } else {
      console.log("⚠️ Admin already exists with phone: 0987654321");

      // Fetch existing admin
      const existing = await pool.query(
        "SELECT id, name, phone, role FROM users WHERE phone = $1",
        ["0987654321"],
      );
      if (existing.rows[0]) {
        console.log("   Existing admin:", existing.rows[0]);
      }
    }
  } catch (error) {
    console.error("❌ Error details:", error.message);
    console.error("Full error:", error);
  } finally {
    await pool.end();
  }
};

createAdmin();
