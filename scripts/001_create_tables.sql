-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  customer_type VARCHAR(50) DEFAULT 'individual',
  phone VARCHAR(50),
  email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create paints table (catalog of available paint colors)
CREATE TABLE IF NOT EXISTS paints (
  id SERIAL PRIMARY KEY,
  color_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  base_size DECIMAL(10, 2) DEFAULT 1.0,
  base_unit VARCHAR(20) DEFAULT 'litre',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(color_name, product_type)
);

-- Create formulations table (recipes for making each paint color)
CREATE TABLE IF NOT EXISTS formulations (
  id SERIAL PRIMARY KEY,
  paint_id INTEGER NOT NULL REFERENCES paints(id) ON DELETE CASCADE,
  component_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'litre',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchases table (customer purchase history)
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  paint_id INTEGER NOT NULL REFERENCES paints(id) ON DELETE CASCADE,
  size DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'litre',
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paint_id ON purchases(paint_id);
CREATE INDEX IF NOT EXISTS idx_formulations_paint_id ON formulations(paint_id);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_paints_color_name ON paints(color_name);
