import bcrypt from 'bcryptjs';
import { models } from '../lib/db.js';

export default async function authRoutes(app) {
  // Register
  app.post('/register', async (request, reply) => {
    const { email, password } = request.body || {};
    if (!email || !password) {
      return reply.code(400).send({ message: 'Email and password required' });
    }
    const existing = await models.User.findOne({ where: { email } });
    if (existing) {
      return reply.code(409).send({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await models.User.create({ email, passwordHash });
    const token = app.jwt.sign({ sub: user.id, email: user.email });
    reply
      .setCookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: parseMaxAge(process.env.JWT_EXPIRES_IN || '7d')
      })
      .send({ id: user.id, email: user.email });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body || {};
    if (!email || !password) {
      return reply.code(400).send({ message: 'Email and password required' });
    }
    const user = await models.User.findOne({ where: { email } });
    if (!user) return reply.code(401).send({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ message: 'Invalid credentials' });
    const token = app.jwt.sign({ sub: user.id, email: user.email });
    reply
      .setCookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: parseMaxAge(process.env.JWT_EXPIRES_IN || '7d')
      })
      .send({ id: user.id, email: user.email });
  });

  // Logout
  app.post('/logout', async (_request, reply) => {
    reply.clearCookie('token', { path: '/' }).send({ ok: true });
  });

  // Me
  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const user = await models.User.findByPk(userId, { attributes: ['id', 'email'] });
    return user || {};
  });
}

function parseMaxAge(str) {
  // supports e.g. "7d", "24h", "3600" seconds
  const s = String(str).trim();
  const m = s.match(/^(\d+)([smhd])?$/i);
  if (!m) return 7 * 24 * 60 * 60; // default 7d
  const value = Number(m[1]);
  const unit = (m[2] || 's').toLowerCase();
  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return value;
  }
}


