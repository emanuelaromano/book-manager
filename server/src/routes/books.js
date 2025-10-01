import { models } from '../lib/db.js';

export default async function booksRoutes(app) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async (request) => {
    const userId = request.user.sub;
    const books = await models.Book.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return books;
  });

  app.post('/', async (request, reply) => {
    const userId = request.user.sub;
    const { title, author, year, notes } = request.body || {};
    if (!title) return reply.code(400).send({ message: 'Title is required' });
    const book = await models.Book.create({ title, author, year, notes, userId });
    return book;
  });

  app.put('/:id', async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const { title, author, year, notes } = request.body || {};
    const book = await models.Book.findByPk(id);
    if (!book || book.userId !== userId) return reply.code(404).send({ message: 'Not found' });
    if (title === '') return reply.code(400).send({ message: 'Title cannot be empty' });
    await book.update({ title: title ?? book.title, author, year, notes });
    return book;
  });

  app.delete('/:id', async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const book = await models.Book.findByPk(id);
    if (!book || book.userId !== userId) return reply.code(404).send({ message: 'Not found' });
    await book.destroy();
    return { ok: true };
  });
}


