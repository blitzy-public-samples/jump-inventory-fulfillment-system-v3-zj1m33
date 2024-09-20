const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Delete all existing entries in the users table
  await knex('users').del();

  // Generate hashed passwords for each user
  const saltRounds = 10; // Consider adjusting this for production
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const managerPassword = await bcrypt.hash('manager123', saltRounds);
  const staffPassword = await bcrypt.hash('staff123', saltRounds);
  const readonlyPassword = await bcrypt.hash('readonly123', saltRounds);

  // Insert seed data for admin, warehouse manager, warehouse staff, and readonly user
  const users = [
    { username: 'admin', password: adminPassword, role: 'admin', email: 'admin@example.com' },
    { username: 'manager', password: managerPassword, role: 'warehouse_manager', email: 'manager@example.com' },
    { username: 'staff', password: staffPassword, role: 'warehouse_staff', email: 'staff@example.com' },
    { username: 'readonly', password: readonlyPassword, role: 'readonly', email: 'readonly@example.com' }
  ];

  await knex('users').insert(users);

  // Log the number of inserted users
  console.log(`Seeded ${users.length} users`);

  // Human tasks:
  // TODO: Review and update user roles and permissions as needed
  // TODO: Ensure password hashing salt rounds are set appropriately for production
  // TODO: Consider adding more diverse seed data for testing various scenarios
};