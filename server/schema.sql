-- Database Schema for AutoPrime Veículos
CREATE DATABASE IF NOT EXISTS autoprime_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autoprime_db;

-- 1. Table: vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(100) PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(150) NOT NULL,
  version VARCHAR(200),
  year INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  mileage INT NOT NULL DEFAULT 0,
  category VARCHAR(80) NOT NULL,
  transmission VARCHAR(100),
  fuel VARCHAR(80),
  color VARCHAR(100),
  plate_end VARCHAR(10),
  doors INT DEFAULT 4,
  featured BOOLEAN DEFAULT FALSE,
  engine VARCHAR(200),
  torque VARCHAR(100),
  acceleration VARCHAR(100),
  top_speed VARCHAR(100),
  consumption VARCHAR(200),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: vehicle_images
CREATE TABLE IF NOT EXISTS vehicle_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 3. Table: vehicle_badges
CREATE TABLE IF NOT EXISTS vehicle_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id VARCHAR(100) NOT NULL,
  badge VARCHAR(100) NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 4. Table: vehicle_features
CREATE TABLE IF NOT EXISTS vehicle_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id VARCHAR(100) NOT NULL,
  feature TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 5. Table: leads (Propostas, Troca e Contato)
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_email VARCHAR(150),
  lead_type VARCHAR(50) DEFAULT 'contact', -- 'proposal', 'trade_in', 'financing', 'contact'
  vehicle_id VARCHAR(100),
  vehicle_interest VARCHAR(200),
  trade_in_brand VARCHAR(100),
  trade_in_model VARCHAR(100),
  trade_in_year INT,
  trade_in_mileage INT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'won', 'lost'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: users (Lojistas / Administradores)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial admin user template (set password on first login / migration)
INSERT IGNORE INTO users (username, password_hash, name, role) 
VALUES ('admin', '$2b$10$e0MYzXyjpJS7Pd0RVvHwHeFhQyC5pZgCqB.9hNf7l1Y2Z3A4B5C6D', 'Gerente AutoPrime', 'admin');
