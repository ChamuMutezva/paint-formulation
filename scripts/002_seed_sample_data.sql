-- Insert sample customers
INSERT INTO customers (name, customer_type, phone, email) VALUES
  ('John Building Supplies', 'company', '555-0101', 'contact@johnbuilding.com'),
  ('Sarah Mitchell', 'individual', '555-0102', 'sarah.m@email.com'),
  ('ABC Construction Ltd', 'company', '555-0103', 'info@abcconstruction.com'),
  ('David Thompson', 'individual', '555-0104', 'dthompson@email.com')
ON CONFLICT DO NOTHING;

-- Insert sample paints
INSERT INTO paints (color_name, product_type, base_size, base_unit, description) VALUES
  ('Pipe Blue', 'QD Enamel', 1.0, 'litre', 'Standard pipe blue enamel finish'),
  ('Classic White', 'Interior Matt', 1.0, 'litre', 'Bright white interior wall paint'),
  ('Forest Green', 'Exterior Gloss', 1.0, 'litre', 'Deep green gloss for exterior use'),
  ('Sunset Red', 'QD Enamel', 1.0, 'litre', 'Bold red enamel finish')
ON CONFLICT DO NOTHING;

-- Insert formulations for Pipe Blue (based on your example)
-- This is for 1 litre base - ratios will scale for any size
INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'Ford Tractor Blue', 0.8, 'litre', 1 FROM paints WHERE color_name = 'Pipe Blue' AND product_type = 'QD Enamel'
ON CONFLICT DO NOTHING;

INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'Lemon Chrome', 0.08, 'litre', 2 FROM paints WHERE color_name = 'Pipe Blue' AND product_type = 'QD Enamel'
ON CONFLICT DO NOTHING;

INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'White', 0.08, 'litre', 3 FROM paints WHERE color_name = 'Pipe Blue' AND product_type = 'QD Enamel'
ON CONFLICT DO NOTHING;

INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'Clear', 0.04, 'litre', 4 FROM paints WHERE color_name = 'Pipe Blue' AND product_type = 'QD Enamel'
ON CONFLICT DO NOTHING;

-- Insert formulations for Classic White
INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'Titanium White Base', 0.85, 'litre', 1 FROM paints WHERE color_name = 'Classic White' AND product_type = 'Interior Matt'
ON CONFLICT DO NOTHING;

INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
SELECT id, 'Matt Medium', 0.15, 'litre', 2 FROM paints WHERE color_name = 'Classic White' AND product_type = 'Interior Matt'
ON CONFLICT DO NOTHING;

-- Insert sample purchases
INSERT INTO purchases (customer_id, paint_id, size, unit, purchase_date, notes)
SELECT c.id, p.id, 25, 'litre', CURRENT_DATE - INTERVAL '5 days', 'Requested extra mixing'
FROM customers c, paints p
WHERE c.name = 'John Building Supplies' AND p.color_name = 'Pipe Blue'
ON CONFLICT DO NOTHING;

INSERT INTO purchases (customer_id, paint_id, size, unit, purchase_date)
SELECT c.id, p.id, 5, 'litre', CURRENT_DATE - INTERVAL '2 days'
FROM customers c, paints p
WHERE c.name = 'Sarah Mitchell' AND p.color_name = 'Classic White'
ON CONFLICT DO NOTHING;

INSERT INTO purchases (customer_id, paint_id, size, unit, purchase_date)
SELECT c.id, p.id, 20, 'litre', CURRENT_DATE - INTERVAL '10 days'
FROM customers c, paints p
WHERE c.name = 'ABC Construction Ltd' AND p.color_name = 'Pipe Blue'
ON CONFLICT DO NOTHING;
