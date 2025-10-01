#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// parse flags
const args = process.argv.slice(2);
const USE_DEFAULTS = args.includes('--default') || args.includes('-default') || args.includes('-d');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const prompt = defaultValue !== undefined && defaultValue !== null && `${defaultValue}`.length > 0
      ? `${question} [default: ${defaultValue}]: `
      : `${question}: `;
    rl.question(prompt, (answer) => {
      const trimmed = answer.trim();
      if (trimmed.length === 0 && defaultValue !== undefined) {
        resolve(String(defaultValue));
      } else {
        resolve(trimmed);
      }
    });
  });
}

async function main() {
  const projectRoot = path.resolve(process.cwd(), 'server');
  const envPath = path.join(projectRoot, '.env');

  const defaults = {
    PORT: '4000',
    CLIENT_ORIGIN: 'http://localhost:5173',
    JWT_SECRET: 'dev-secret',
    JWT_EXPIRES_IN: '7d',
    POSTGRES_HOST: '127.0.0.1',
    POSTGRES_PORT: '5433',
    POSTGRES_DB: 'books_db',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    SEQUELIZE_SYNC: 'true'
  };

  const PORT = USE_DEFAULTS ? defaults.PORT : await ask('Server PORT', defaults.PORT);
  const CLIENT_ORIGIN = USE_DEFAULTS ? defaults.CLIENT_ORIGIN : await ask('Client origin', defaults.CLIENT_ORIGIN);
  const JWT_SECRET = USE_DEFAULTS ? defaults.JWT_SECRET : await ask('JWT secret', defaults.JWT_SECRET);
  const JWT_EXPIRES_IN = USE_DEFAULTS ? defaults.JWT_EXPIRES_IN : await ask('JWT expires in (e.g. 7d, 24h)', defaults.JWT_EXPIRES_IN);

  const POSTGRES_HOST = USE_DEFAULTS ? defaults.POSTGRES_HOST : await ask('Postgres host', defaults.POSTGRES_HOST);
  const POSTGRES_PORT = USE_DEFAULTS ? defaults.POSTGRES_PORT : await ask('Postgres port', defaults.POSTGRES_PORT);
  const POSTGRES_DB = USE_DEFAULTS ? defaults.POSTGRES_DB : await ask('Postgres database name', defaults.POSTGRES_DB);
  const POSTGRES_USER = USE_DEFAULTS ? defaults.POSTGRES_USER : await ask('Postgres user', defaults.POSTGRES_USER);
  const POSTGRES_PASSWORD = USE_DEFAULTS ? defaults.POSTGRES_PASSWORD : await ask('Postgres password', defaults.POSTGRES_PASSWORD);

  const SEQUELIZE_SYNC = USE_DEFAULTS ? defaults.SEQUELIZE_SYNC : await ask('Run sequelize sync on boot? (true/false)', defaults.SEQUELIZE_SYNC);

  const lines = [
    `PORT=${PORT}`,
    `CLIENT_ORIGIN=${CLIENT_ORIGIN}`,
    `JWT_SECRET=${JWT_SECRET}`,
    `JWT_EXPIRES_IN=${JWT_EXPIRES_IN}`,
    `POSTGRES_HOST=${POSTGRES_HOST}`,
    `POSTGRES_PORT=${POSTGRES_PORT}`,
    `POSTGRES_DB=${POSTGRES_DB}`,
    `POSTGRES_USER=${POSTGRES_USER}`,
    `POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`,
    `SEQUELIZE_SYNC=${SEQUELIZE_SYNC}`
  ];

  fs.writeFileSync(envPath, lines.join('\n') + '\n', { encoding: 'utf8' });
  console.log(`Wrote ${envPath}`);
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});


