const bcrypt = require("bcrypt");

async function generate() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("Hash length:", hash.length);
}

generate();
