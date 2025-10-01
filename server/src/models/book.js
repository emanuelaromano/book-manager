import { DataTypes } from 'sequelize';

export function defineBookModel(sequelize) {
  const Book = sequelize.define(
    'Book',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: true },
      rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
      notes: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: 'books',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'title', 'author', 'year']
        }
      ]
    }
  );

  return Book;
}


