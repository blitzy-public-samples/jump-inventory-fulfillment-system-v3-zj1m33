import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderStatus, Address } from 'src/shared/types/index';

class Order extends Model {
  public id!: string;
  public shopifyOrderId!: string;
  public userId!: string;
  public status!: OrderStatus;
  public shippingAddress!: Address;
  public trackingNumber!: string | null;
  public orderDate!: Date;
  public fulfilledAt!: Date | null;
  public totalAmount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static init(sequelize: Sequelize): typeof Order {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        shopifyOrderId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
        },
        shippingAddress: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        trackingNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        orderDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        fulfilledAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'orders',
        indexes: [
          { fields: ['shopifyOrderId'] },
          { fields: ['status'] },
          { fields: ['userId'] },
        ],
      }
    );
  }

  public static associate(models: any): void {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
  }

  public async calculateTotalAmount(): Promise<number> {
    const orderItems = await (this as any).getOrderItems();
    const total = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    this.totalAmount = total;
    await this.save();
    return total;
  }
}

export default Order;
```

This implementation covers the Order model as described in the specification. Here are some notes on the implementation:

1. The model extends Sequelize's Model class and defines all the properties as specified.
2. The `init` method sets up the model schema, including data types, constraints, and indexes.
3. The `associate` method defines the relationships with User and OrderItem models.
4. The `calculateTotalAmount` method fetches associated OrderItems and calculates the total amount.
5. Indexes have been added for frequently queried fields: shopifyOrderId, status, and userId.

The pending human tasks mentioned in the specification have not been directly implemented here, as they often involve more complex logic or interactions with other parts of the system. However, here are some suggestions for addressing them:

1. For updating inventory, you could add hooks in the `init` method:
   ```typescript
   hooks: {
     afterCreate: (order: Order) => { /* Update inventory */ },
     afterUpdate: (order: Order) => { /* Update inventory if status changed */ },
   }
   ```

2. For order fulfillment, you could add a method like:
   ```typescript
   public async fulfill(): Promise<void> {
     // Implement fulfillment logic here
   }
   ```

3. For shippingAddress validation, you could add a custom validator in the model definition:
   ```typescript
   shippingAddress: {
     type: DataTypes.JSON,
     allowNull: false,
     validate: {
       isValidAddress(value: Address) {
         // Implement address validation logic
       }
     }
   }
   ```

4. For generating order summary or invoice, you could add a method like:
   ```typescript
   public async generateSummary(): Promise<string> {
     // Implement summary generation logic
   }