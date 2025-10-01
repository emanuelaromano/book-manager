import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { initDb } from './lib/db.js';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: ORIGIN,
    credentials: true
  });
  await app.register(cookie, {
    hook: 'onRequest'
  });
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret',
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  // Health
  app.get('/api/health', async () => ({ ok: true }));

  // Root
  app.get('/', async () => ({ ok: true }));

  await initDb();

  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(booksRoutes, { prefix: '/api/books' });

  return app;
}

buildServer()
  .then((app) => app.listen({ port: PORT, host: '0.0.0.0' }))
  .then((address) => {
    console.log(`Server listening on ${address}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });


