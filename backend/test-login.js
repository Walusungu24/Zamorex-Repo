const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testLogin() {
  const phone = "0987654321";
  const password = "admin123";

  try {
    // Get user from database
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    const user = result.rows[0];

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("Found user:", user.id, user.name, user.role);
    console.log("Stored hash:", user.password);
    console.log("Hash length:", user.password.length);

    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password match:", isValid);
  } catch (error) {
    console.error("Error:", error.message);
  }
  process.exit();
}

testLogin();
