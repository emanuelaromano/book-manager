Book Manager App

Prerequisites
- Node.js 18+
- Docker (for Postgres) or local Postgres 16

Setup
1) Start Postgres (Docker):
```bash
docker compose up -d
```

2) Server
```bash
cp server/.env.example server/.env  # fill if needed
cd server
npm install
npm run db:sync
npm run dev
```

3) Client
```bash
cd client
npm install
npm run dev
```

Default URLs
- API: http://localhost:4000
- Client: http://localhost:5173

Notes
- JWT is stored in HttpOnly cookie `token`.
- Set CLIENT_ORIGIN in `server/.env` if the client runs on a different origin.
- In dev, CORS and cookies are configured for localhost.

