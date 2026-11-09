-- ==========================================
-- 1. CREATE USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('farmer', 'buyer', 'admin')) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CREATE PRODUCTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'other',
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. CREATE FARMER PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100),
    profile_picture VARCHAR(255),
    location VARCHAR(255),
    whatsapp VARCHAR(20),
    bio TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(farmer_id)
);

-- ==========================================
-- 4. CREATE INDEXES (For Performance)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_farmer_status ON products(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_farmer_id ON farmer_profiles(farmer_id);