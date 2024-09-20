const faker = require('faker');

// Number of products to generate
const NUM_PRODUCTS = 50;

// Function to generate a single product object with fake data
function generateProductData() {
  return {
    name: faker.commerce.productName(),
    sku: faker.random.alphaNumeric(8).toUpperCase(),
    barcode: faker.random.number({ min: 1000000000000, max: 9999999999999 }).toString(),
    description: faker.lorem.paragraph(),
    price: parseFloat(faker.commerce.price()),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  };
}

exports.seed = async function(knex) {
  // Delete all existing entries in the products table
  await knex('products').del();

  // Generate an array of NUM_PRODUCTS product objects
  const products = Array.from({ length: NUM_PRODUCTS }, generateProductData);

  // Insert the generated product objects into the products table
  await knex('products').insert(products);
};

// Human tasks:
// TODO: Review and adjust the number of seed products (NUM_PRODUCTS) based on testing needs
// TODO: Verify that the generated product data aligns with the actual product structure in the Shopify store
// TODO: Consider adding logic to generate product data that matches specific categories or types relevant to the e-commerce store