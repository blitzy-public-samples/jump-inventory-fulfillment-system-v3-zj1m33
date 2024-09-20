-- Create the orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  shopify_order_id VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  order_date TIMESTAMP NOT NULL,
  shipping_address JSONB NOT NULL,
  tracking_number VARCHAR(255),
  fulfilled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for improved query performance
CREATE INDEX idx_orders_shopify_order_id ON orders(shopify_order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- Create a trigger to automatically update the 'updated_at' column
CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Human tasks:
-- TODO: Review and verify the table structure and indexes
-- TODO: Ensure the update_modified_column function is created before running this migration
-- TODO: Consider adding additional indexes based on query patterns if needed