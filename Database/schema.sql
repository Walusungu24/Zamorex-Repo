CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(10) CHECK (role IN ('farmer', 'buyer')) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    farmer_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('farmer', 'buyer', 'admin')) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  farmer_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create admin user manually (password: admin123)
-- Password hash is bcrypt of 'admin123'
INSERT INTO users (name, phone, role, password) 
VALUES ('Admin', '0000000000', 'admin', '$2b$10$YourHashedPasswordHere');


-- Create farmer_profiles table
CREATE TABLE farmer_profiles (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100),
    profile_picture VARCHAR(255), -- Cloudinary URL
    location VARCHAR(255),
    whatsapp VARCHAR(20),
    bio TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(farmer_id)
);

-- Add indexes
CREATE INDEX idx_farmer_profiles_farmer_id ON farmer_profiles(farmer_id);

-- Add profile_completed flag to users table for quick check
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;