// config/validateEnv.js
const requiredEnvVars = [
  "PORT",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
  "JWT_SECRET",
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};

module.exports = validateEnv;
