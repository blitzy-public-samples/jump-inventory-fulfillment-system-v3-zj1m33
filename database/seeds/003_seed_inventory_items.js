const faker = require('faker');

// Set the number of inventory items to generate
const NUM_INVENTORY_ITEMS = 100;

/**
 * Helper function to generate a single inventory item object
 * @param {Array} productIds - Array of product IDs
 * @returns {Object} An inventory item object
 */
const generateInventoryItem = (productIds) => {
  // Randomly select a product ID from the provided array
  const productId = productIds[Math.floor(Math.random() * productIds.length)];

  // Generate a random quantity between 0 and 1000
  const quantity = faker.datatype.number({ min: 0, max: 1000 });

  // Generate a random location string
  const location = `${faker.random.alpha().toUpperCase()}${faker.datatype.number({ min: 1, max: 99 })}-${faker.random.alpha().toUpperCase()}${faker.datatype.number({ min: 1, max: 99 })}`;

  // Create and return the inventory item object
  return {
    product_id: productId,
    quantity: quantity,
    location: location,
  };
};

/**
 * Main seeding function to insert inventory items into the database
 * @param {Object} knex - Knex instance
 * @returns {Promise} Resolves when seeding is complete
 */
exports.seed = async function(knex) {
  // Truncate the inventory_items table to ensure a clean slate
  await knex('inventory_items').truncate();

  // Fetch all product IDs from the products table
  const productIds = await knex('products').pluck('id');

  // Generate an array of inventory item objects
  const inventoryItems = Array.from({ length: NUM_INVENTORY_ITEMS }, () => generateInventoryItem(productIds));

  // Insert the generated inventory items into the database
  await knex('inventory_items').insert(inventoryItems);
};

// Human tasks:
// TODO: Review and adjust the number of seed items (NUM_INVENTORY_ITEMS) based on testing needs
// TODO: Ensure that the location generation logic aligns with the actual warehouse layout or location system
// TODO: Consider adding more diverse or specific inventory data if required for particular testing scenarios