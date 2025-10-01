import dotenv from 'dotenv';
import { initDb, sequelize } from '../../src/lib/db.js';

dotenv.config();

async function run() {
  await initDb();
  await sequelize.sync({ alter: true });
  console.log('Database synced');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


