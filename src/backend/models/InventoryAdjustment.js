// Import required dependencies
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

// Define the InventoryAdjustment model
class InventoryAdjustment extends Model {
  // Define associations with other models
  static associate(models) {
    // Add associations here, e.g.:
    // this.belongsTo(models.InventoryItem, { foreignKey: 'inventoryItemId' });
    // this.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

// Initialize the InventoryAdjustment model
const initInventoryAdjustmentModel = () => {
  // Define the model schema
  InventoryAdjustment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    inventoryItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'InventoryItems',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    quantityChange: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
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
    // Set up model options
    sequelize,
    modelName: 'InventoryAdjustment',
    tableName: 'inventory_adjustments',
    timestamps: true
  });

  // Return the initialized model
  return InventoryAdjustment;
};

// Export the initInventoryAdjustmentModel function as default
module.exports = initInventoryAdjustmentModel;

// Human tasks:
// TODO: Review and adjust the quantityChange validation to ensure it aligns with business rules
// TODO: Consider adding additional fields for tracking adjustment details (e.g., batch number, expiration date)
// TODO: Implement custom validation logic for the reason field if specific formats or options are required