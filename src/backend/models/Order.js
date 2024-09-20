// Import required dependencies
const { DataTypes, Model } = require('sequelize');
const { ORDER_STATUS } = require('../../shared/constants/orderStatus');

// Define the Order class, extending Sequelize Model
class Order extends Model {
  // Initialize the Order model
  constructor() {
    super();
  }

  // Define associations with other models
  static associate(models) {
    // Define belongsTo association with User model
    this.belongsTo(models.User, { foreignKey: 'userId' });
    // Define hasMany association with OrderItem model
    this.hasMany(models.OrderItem, { foreignKey: 'orderId' });
  }
}

// Define the Order model and its attributes
function defineOrder(sequelize) {
  Order.init(
    {
      // Define model attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shopifyOrderId: {
        type: DataTypes.STRING,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING,
      },
      fulfilledAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Order;
}

module.exports = defineOrder;

// Human tasks:
// - Review and adjust data types and constraints as needed based on specific business requirements
// - Consider adding indexes for frequently queried fields like shopifyOrderId and status