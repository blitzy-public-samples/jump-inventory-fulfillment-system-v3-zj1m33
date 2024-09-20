const { DataTypes, Model } = require('sequelize');

class InventoryItem extends Model {
  static associate(models) {
    // Associate InventoryItem with Product model (belongsTo relationship)
    this.belongsTo(models.Product, { foreignKey: 'productId' });

    // Associate InventoryItem with InventoryAdjustment model (hasMany relationship)
    this.hasMany(models.InventoryAdjustment, { foreignKey: 'inventoryItemId' });
  }
}

function defineInventoryItem(sequelize) {
  // Define the InventoryItem model with its attributes
  InventoryItem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastCounted: {
      type: DataTypes.DATE
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
    // Set up model options including table name and timestamps
    sequelize,
    modelName: 'InventoryItem',
    tableName: 'inventory_items',
    timestamps: true
  });

  // Return the defined model
  return InventoryItem;
}

module.exports = defineInventoryItem;

// Human tasks:
// TODO: Review and adjust the `location` field to ensure it meets specific warehouse or storage location requirements
// TODO: Consider adding additional fields for tracking expiry dates or batch numbers if applicable to the inventory system
// TODO: Implement custom validation for the `quantity` field to ensure it's always non-negative