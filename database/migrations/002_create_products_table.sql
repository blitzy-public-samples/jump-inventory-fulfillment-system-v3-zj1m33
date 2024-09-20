-- This migration creates the products table to store information about products in the inventory management system.
-- It includes fields for Shopify integration, product details, and timestamps for creation and updates.
-- Indexes are created on shopify_product_id, sku, and barcode for improved query performance.
-- A trigger is set up to automatically update the 'updated_at' timestamp on record modifications.

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    shopify_product_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_shopify_product_id ON products(shopify_product_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Human tasks:
-- TODO: Review and verify the table schema against the final product requirements
-- TODO: Ensure proper indexing is in place for frequently queried columns
-- TODO: Consider adding any additional constraints or checks based on business rules