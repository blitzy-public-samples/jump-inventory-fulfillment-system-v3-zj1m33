import { Model, DataTypes, Sequelize } from 'sequelize';

class InventoryItem extends Model {
  public id!: string;
  public productId!: string;
  public quantity!: number;
  public location!: string;
  public lastCounted!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  static init(sequelize: Sequelize): typeof InventoryItem {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
          // TODO: Implement validation against a list of valid locations
        },
        lastCounted: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'inventory_items',
        indexes: [
          { fields: ['productId'] },
          { fields: ['location'] },
        ],
      }
    );
    return InventoryItem;
  }

  static associate(models: any): void {
    InventoryItem.belongsTo(models.Product, { foreignKey: 'productId' });
  }

  async adjustQuantity(amount: number, reason: string): Promise<InventoryItem> {
    const newQuantity = this.quantity + amount;
    if (newQuantity < 0) {
      throw new Error('Inventory quantity cannot be negative');
    }
    this.quantity = newQuantity;
    await this.save();

    // Create InventoryAdjustment record
    // TODO: Implement InventoryAdjustment model and create record here

    return this;
  }

  async updateLastCounted(): Promise<InventoryItem> {
    this.lastCounted = new Date();
    return this.save();
  }

  // TODO: Implement method to check if inventory is low on stock
  // isLowStock(threshold: number): boolean {
  //   return this.quantity <= threshold;
  // }

  // TODO: Implement method to transfer inventory between locations
  // async transferTo(newLocation: string, amount: number): Promise<InventoryItem> {
  //   // Implementation
  // }

  // TODO: Implement method to get inventory history
  // async getInventoryHistory(): Promise<InventoryAdjustment[]> {
  //   // Implementation
  // }
}

export { InventoryItem };