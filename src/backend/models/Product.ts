import { Model, DataTypes, Sequelize } from 'sequelize';

class Product extends Model {
  public id!: string;
  public shopifyProductId!: string;
  public name!: string;
  public sku!: string;
  public barcode!: string;
  public description!: string;
  public price!: number;
  public weight!: number;
  public weightUnit!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static init(sequelize: Sequelize): typeof Product {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        shopifyProductId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sku: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        barcode: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isPositive(value: number) {
              if (value <= 0) {
                throw new Error('Price must be a positive number');
              }
            },
          },
        },
        weight: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        weightUnit: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'products',
        timestamps: true,
      }
    );
  }

  public static associate(models: any): void {
    Product.hasMany(models.InventoryItem, { foreignKey: 'productId' });
    Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
  }

  public async getCurrentStock(): Promise<number> {
    const inventoryItems = await (this.constructor as typeof Product).sequelize?.models.InventoryItem.findAll({
      where: { productId: this.id },
    });

    return inventoryItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  public async updateFromShopify(shopifyData: any): Promise<Product> {
    // Validate and sanitize incoming data
    const sanitizedData = {
      shopifyProductId: shopifyData.id,
      name: shopifyData.title,
      sku: shopifyData.sku,
      barcode: shopifyData.barcode,
      description: shopifyData.description,
      price: parseFloat(shopifyData.price),
      weight: parseFloat(shopifyData.weight),
      weightUnit: shopifyData.weight_unit,
    };

    // Update product properties
    Object.assign(this, sanitizedData);

    // Save the updated product information
    await this.save();

    return this;
  }
}

export default Product;