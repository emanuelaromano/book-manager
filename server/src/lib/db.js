import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { defineUserModel } from '../models/user.js';
import { defineBookModel } from '../models/book.js';

dotenv.config();

let sequelizeConfig;
if (process.env.DATABASE_URL) {
  sequelizeConfig = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
  });
} else {
  sequelizeConfig = new Sequelize(
    process.env.POSTGRES_DB || 'books_db',
    process.env.POSTGRES_USER || 'postgres',
    process.env.POSTGRES_PASSWORD || 'postgres',
    {
      host: process.env.POSTGRES_HOST || '127.0.0.1',
      port: Number(process.env.POSTGRES_PORT || 5432),
      dialect: 'postgres',
      logging: false
    }
  );
}

export const sequelize = sequelizeConfig;

export const models = {};

export async function initDb() {
  models.User = defineUserModel(sequelize);
  models.Book = defineBookModel(sequelize);

  // Associations
  models.User.hasMany(models.Book, { foreignKey: 'userId', onDelete: 'CASCADE' });
  models.Book.belongsTo(models.User, { foreignKey: 'userId' });

  await sequelize.authenticate();
  if (process.env.SEQUELIZE_SYNC === 'true') {
    await sequelize.sync({ alter: true });
  }
}


