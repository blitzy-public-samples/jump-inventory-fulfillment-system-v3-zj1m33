import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserRole } from 'src/shared/types/index';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public lastLogin!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static init(sequelize: Sequelize): typeof User {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: [3, 50],
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(...Object.values(UserRole)),
          allowNull: false,
        },
        lastLogin: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        tableName: 'users',
        hooks: {
          beforeCreate: async (user: User) => {
            user.password = await bcrypt.hash(user.password, 10);
          },
          beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );
    return User;
  }

  public static associate(models: any): void {
    User.hasMany(models.Order, { foreignKey: 'userId' });
  }

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export default User;