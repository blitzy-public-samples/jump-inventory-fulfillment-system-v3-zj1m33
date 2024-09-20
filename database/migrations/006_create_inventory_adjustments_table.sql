-- Create inventory_adjustments table
CREATE TABLE inventory_adjustments (
  id SERIAL PRIMARY KEY,
  inventory_item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- This table tracks all adjustments made to inventory items
-- It maintains a record of who made the change, when it was made, and the reason for the adjustment
-- The quantity_change field can be positive or negative, representing increases or decreases in inventory

-- Human tasks:
-- 1. Review the table structure and constraints to ensure they meet the specific requirements of the inventory adjustment tracking system
-- 2. Consider adding additional indexes if needed for query performance optimization
-- 3. Ensure that this migration file is properly sequenced with other migration files