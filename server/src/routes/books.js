import { models } from '../lib/db.js';
import { Op, fn, col, where } from 'sequelize';

export default async function booksRoutes(app) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async (request) => {
    const userId = request.user.sub;
    const books = await models.Book.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return books;
  });

  app.post('/', async (request, reply) => {
    const userId = request.user.sub;
    const { title, author, year, rating, notes } = request.body || {};
    if (!title) return reply.code(400).send({ message: 'Title is required' });
    const normalizedTitle = String(title).trim().toLowerCase();
    const normalizedAuthor = author != null && String(author).trim() !== '' ? String(author).trim().toLowerCase() : null;

    const duplicateWhere = {
      userId,
      [Op.and]: [
        where(fn('lower', col('title')), normalizedTitle),
        normalizedAuthor == null ? { author: { [Op.is]: null } } : where(fn('lower', col('author')), normalizedAuthor),
        year == null ? { year: { [Op.is]: null } } : { year }
      ]
    };

    const existing = await models.Book.findOne({ where: duplicateWhere });
    if (existing) return reply.code(409).send({ message: 'A book with the same title, author, and year already exists.' });

    let nextRating = rating == null || rating === '' ? null : Number(rating);
    if (nextRating != null && (isNaN(nextRating) || nextRating < 1 || nextRating > 5)) {
      return reply.code(400).send({ message: 'Rating must be an integer between 1 and 5' });
    }

    const book = await models.Book.create({ title, author: normalizedAuthor ?? null, year: year ?? null, rating: nextRating, notes, userId });
    return book;
  });

  app.put('/:id', async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const { title, author, year, rating, notes } = request.body || {};
    const book = await models.Book.findByPk(id);
    if (!book || book.userId !== userId) return reply.code(404).send({ message: 'Not found' });
    if (title === '') return reply.code(400).send({ message: 'Title cannot be empty' });
    const nextTitle = title ?? book.title;
    const nextAuthorRaw = author === undefined ? book.author : author;
    const nextYear = year === undefined ? book.year : year;
    let nextRating;
    if (rating === undefined) {
      nextRating = book.rating;
    } else {
      nextRating = rating == null || rating === '' ? null : Number(rating);
    }
    if (nextRating != null && (isNaN(nextRating) || nextRating < 1 || nextRating > 5)) {
      return reply.code(400).send({ message: 'Rating must be an integer between 1 and 5' });
    }
    const nextAuthor = nextAuthorRaw != null && String(nextAuthorRaw).trim() !== '' ? String(nextAuthorRaw).trim().toLowerCase() : null;

    if (nextTitle) {
      const dupWhere = {
        userId,
        id: { [Op.ne]: book.id },
        [Op.and]: [
          where(fn('lower', col('title')), String(nextTitle).trim().toLowerCase()),
          nextAuthor == null ? { author: { [Op.is]: null } } : where(fn('lower', col('author')), nextAuthor),
          nextYear == null ? { year: { [Op.is]: null } } : { year: nextYear }
        ]
      };
      const dup = await models.Book.findOne({ where: dupWhere });
      if (dup) return reply.code(409).send({ message: 'A book with the same title, author, and year already exists.' });
    }

    await book.update({ title: nextTitle, author: nextAuthor, year: nextYear, rating: nextRating, notes });
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


