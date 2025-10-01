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
_Install dependencies for server and client_
```bash
npm run deps
```

_Create default env variables (keep -default flag for testing)_
```bash
npm run envs -- -default
```

_Start Postgres via Docker_
```bash
npm run db:up
```

_Run backend and frontend together (two processes)_
```bash
npm run dev
```

_Stop and remove containers when done_
```bash
npm run db:down
```
