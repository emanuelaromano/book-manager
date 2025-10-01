import { DataTypes } from 'sequelize';

export function defineBookModel(sequelize) {
  const Book = sequelize.define(
    'Book',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: 'books',
      timestamps: true
    }
  );

  return Book;
}


