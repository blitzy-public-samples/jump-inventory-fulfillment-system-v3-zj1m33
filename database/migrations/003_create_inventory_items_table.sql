-- This migration creates the inventory_items table to store information about product inventory levels.
-- It includes foreign key relationship with the products table and indexes for improved query performance.
-- A trigger is added to automatically update the updated_at column on record modifications.

CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(255),
    last_counted TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create index on product_id for faster lookups and joins
CREATE INDEX idx_inventory_items_product_id ON inventory_items(product_id);

-- Create index on location for faster filtering and searching
CREATE INDEX idx_inventory_items_location ON inventory_items(location);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Human tasks:
-- 1. Review and verify the table structure and constraints
-- 2. Ensure proper indexing for optimal query performance
-- 3. Consider adding additional columns if needed for future requirements