import { Model, DataTypes, Sequelize } from 'sequelize';

class OrderItem extends Model {
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public quantity!: number;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static init(sequelize: Sequelize): typeof OrderItem {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: true,
            min: 1,
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: 0,
          },
        },
      },
      {
        sequelize,
        tableName: 'order_items',
        indexes: [
          { fields: ['orderId'] },
          { fields: ['productId'] },
        ],
      }
    );
    return OrderItem;
  }

  static associate(models: any): void {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
  }

  calculateSubtotal(): number {
    return Number((this.quantity * this.price).toFixed(2));
  }
}

export { OrderItem };