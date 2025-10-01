## Book Manager — Personal Book Manager

A full‑stack web app to manage your personal reading list. Create an account, add books you’ve read or want to read, keep notes, and rate titles. Each user has a private library.

### Features
- **Authentication**: Register, login, logout with secure HTTP‑only JWT cookies
- **Book CRUD**: Add, edit, delete, and list books scoped to your account
- **Duplicate protection**: Prevents duplicate books per user by title/author/year
- **Ratings and notes**: Optional 1–5 rating and free‑form notes
- **Modern UI**: React + Chakra UI with responsive layout


### Run locally (root workflow)

Prerequisites:
- Node.js 18+ and npm
- Docker (for Postgres)

At repo root, run:
```bash
# install dependencies for server and client
npm run deps

# create default env variables (keep -default flag for testing)
npm run envs -- -default

# start Postgres via Docker
npm run db:up

# run backend and frontend together (two processes)
npm run dev

# stop and remove containers when done
npm run db:down
```

Defaults and ports:
- API: `http://localhost:4000` (Fastify)
- Web: `http://localhost:5173` (Vite dev server)
- DB: `postgres://postgres:postgres@127.0.0.1:5433/books_db`

Environment variables:
```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=<your-jwt-secret>
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_DB=<your-db-name>
POSTGRES_USER=<your-db-user>
POSTGRES_PASSWORD=<your-db-password>
SEQUELIZE_SYNC=true
```
Health check: `http://localhost:4000/api/health`

