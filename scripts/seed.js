const { sequelize } = require('src/backend/config/database');
const { User } = require('src/backend/models/User');
const { Product } = require('src/backend/models/Product');
const { InventoryItem } = require('src/backend/models/InventoryItem');
const { Order } = require('src/backend/models/Order');
const { OrderItem } = require('src/backend/models/OrderItem');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await User.bulkCreate([
    {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    },
    {
      username: 'manager',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'WAREHOUSE_MANAGER'
    },
    {
      username: 'staff1',
      email: 'staff1@example.com',
      password: hashedPassword,
      role: 'WAREHOUSE_STAFF'
    },
    {
      username: 'staff2',
      email: 'staff2@example.com',
      password: hashedPassword,
      role: 'WAREHOUSE_STAFF'
    }
  ]);

  console.log('Users seeded successfully');
}

async function seedProducts() {
  const products = Array.from({ length: 50 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: faker.random.alphaNumeric(8),
    price: parseFloat(faker.commerce.price()),
    barcode: faker.random.alphaNumeric(12)
  }));

  await Product.bulkCreate(products);
  console.log('Products seeded successfully');
}

async function seedInventory() {
  const products = await Product.findAll();

  const inventoryItems = products.map(product => ({
    productId: product.id,
    quantity: faker.datatype.number({ min: 0, max: 1000 }),
    location: faker.random.arrayElement(['Warehouse A', 'Warehouse B', 'Storage Unit 1'])
  }));

  await InventoryItem.bulkCreate(inventoryItems);
  console.log('Inventory seeded successfully');
}

async function seedOrders() {
  const products = await Product.findAll();

  const orders = Array.from({ length: 20 }, () => ({
    status: faker.random.arrayElement(['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED']),
    orderDate: faker.date.past(),
    shippingAddress: JSON.stringify({
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      postalCode: faker.address.zipCode(),
      country: faker.address.country()
    })
  }));

  for (const order of orders) {
    const createdOrder = await Order.create(order);
    const numberOfItems = faker.datatype.number({ min: 1, max: 5 });
    let totalAmount = 0;

    for (let i = 0; i < numberOfItems; i++) {
      const product = faker.random.arrayElement(products);
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const price = product.price;

      await OrderItem.create({
        orderId: createdOrder.id,
        productId: product.id,
        quantity,
        price
      });

      totalAmount += quantity * price;
    }

    await createdOrder.update({ totalAmount });
  }

  console.log('Orders seeded successfully');
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    await seedUsers();
    await seedProducts();
    await seedInventory();
    await seedOrders();

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

module.exports = { main };