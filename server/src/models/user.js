import { DataTypes } from 'sequelize';

export function defineUserModel(sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false }
    },
    {
      tableName: 'users',
      timestamps: true,
      indexes: [{ unique: true, fields: ['email'] }]
    }
  );

  return User;
}


