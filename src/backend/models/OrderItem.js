const { Model, DataTypes } = require('sequelize');

class OrderItem extends Model {
  static associate(models) {
    // Associate OrderItem with Order model (belongsTo)
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    
    // Associate OrderItem with Product model (belongsTo)
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
  }
}

function defineOrderItem(sequelize) {
  // Define OrderItem model with Sequelize
  OrderItem.init({
    // Set up model attributes: id, orderId, productId, quantity, price
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    // Configure model options including table name and timestamps
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true
  });

  // Return the defined OrderItem model
  return OrderItem;
}

module.exports = defineOrderItem;

// Human tasks:
// TODO: Review and validate the data types and constraints for each field
// TODO: Ensure proper indexing is set up for foreign keys (orderId, productId) for query optimization
// TODO: Consider adding any additional fields that might be necessary for the business logic (e.g., discounts, tax)
// TODO: Implement any custom validation logic if required (e.g., ensuring quantity is positive)
// TODO: Add any necessary hooks for pre/post save operations if needed