import { Model, DataTypes, Sequelize } from 'sequelize';

class InventoryAdjustment extends Model {
  public id!: string;
  public inventoryItemId!: string;
  public userId!: string;
  public quantityChange!: number;
  public reason!: string;
  public createdAt!: Date;

  // You can add more fields here as needed

  static init(sequelize: Sequelize): typeof InventoryAdjustment {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        inventoryItemId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantityChange: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notZero(value: number) {
              if (value === 0) {
                throw new Error('Quantity change cannot be zero');
              }
            },
          },
        },
        reason: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'inventory_adjustments',
        timestamps: false,
      }
    );
  }

  static associate(models: any): void {
    this.belongsTo(models.InventoryItem, {
      foreignKey: 'inventoryItemId',
      as: 'inventoryItem',
    });
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  async applyAdjustment(): Promise<void> {
    const inventoryItem = await (this.constructor as typeof InventoryAdjustment).sequelize?.models.InventoryItem.findByPk(this.inventoryItemId);
    if (!inventoryItem) {
      throw new Error('Associated InventoryItem not found');
    }
    
    inventoryItem.quantity += this.quantityChange;
    await inventoryItem.save();
  }
}

export default InventoryAdjustment;

// Human tasks:
// TODO: Implement a method to validate that the quantityChange doesn't result in negative inventory
// TODO: Add an 'adjustmentType' field to categorize adjustments (e.g., 'manual count', 'received shipment', 'damaged goods')
// TODO: Implement hooks to automatically apply the adjustment when a new InventoryAdjustment is created
// TODO: Consider adding a status field to track whether the adjustment has been applied or is pending
// TODO: Set up proper indexing for frequently queried fields (e.g., inventoryItemId, userId, createdAt)
// TODO: Implement a method to revert an adjustment if needed, creating a compensating adjustment