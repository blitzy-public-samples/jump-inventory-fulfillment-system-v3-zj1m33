// Import required modules from Sequelize
const { Model, DataTypes } = require('sequelize');

// Define the Product class, extending Sequelize Model
class Product extends Model {
  // Define associations with other models
  static associate(models) {
    // Associate Product with OrderItem through hasMany relationship
    this.hasMany(models.OrderItem, { foreignKey: 'product_id' });
    
    // Associate Product with InventoryItem through hasMany relationship
    this.hasMany(models.InventoryItem, { foreignKey: 'product_id' });
  }
}

// Initialize the Product model with Sequelize
function init(sequelize) {
  // Define Product model schema
  Product.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    shopify_product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    barcode: {
      type: DataTypes.STRING,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    // Set up model options
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Return the initialized Product model
  return Product;
}

// Export the Product model and init function
module.exports = { Product, init };

// Human tasks:
// TODO: Review and adjust data types and constraints based on specific business requirements
// TODO: Implement any custom validation logic for product attributes
// TODO: Consider adding methods for product-specific operations, such as price calculations or inventory checks
// TODO: Ensure proper indexing on frequently queried fields like 'shopify_product_id' and 'sku'