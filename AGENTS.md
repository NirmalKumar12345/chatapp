# AGENTS.md

## Structure

Two independent packages — no monorepo tooling, no shared root `package.json`.

- **`client/`** — Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript. Uses **yarn**.
- **`server/`** — Express 5, MongoDB/Mongoose, Socket.IO, JWT auth, Zod. Uses **npm**. ES modules (`"type": "module"`).

## Commands

### Client (`client/`)
```
yarn dev        # Next.js dev server on http://localhost:3000
yarn build      # Production build
yarn lint       # ESLint (flat config, eslint-config-next)
```

### Server (`server/`)
```
npm run start:dev   # nodemon on port 8000
npm start           # node directly
```

No tests exist yet (`npm test` just echoes an error).

## Environment

Server requires `.env` in `server/` with:
- `MONGODB_URI` (default: `mongodb://localhost:27017/chatapp`)
- `CLIENT_URL` (default: `http://localhost:3000`)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES`
- `PORT` (default: 8000)

MongoDB must be running locally before starting the server.

## API Routes

All under `http://localhost:8000/api/`:
- `GET /api/health` — returns `{ status: "ok" }`
- `POST /api/auth/register` — Zod-validated (name, email, password, mobile)
- `POST /api/auth/refresh` — refresh access token via HTTP-only cookie
- `POST /api/auth/logout` — clear refresh token

No login endpoint exists yet. No auth middleware protects any routes (`middleware/auth.middleware.js` is empty).

## Key Conventions

- Server uses **Zod** for request validation via a reusable `validate(schema)` middleware.
- Auth pattern: access token in JSON response body, refresh token in HTTP-only cookie (bcrypt-hashed in DB).
- Mobile validation is India-specific (10 digits, starts with 6-9).
- Client uses `@/*` path alias mapped to project root.
- Tailwind CSS v4 via `@import "tailwindcss"` (not the v3 `@tailwind` directives).
- ESLint 9 flat config format (not `.eslintrc`).

## Current State

Very early stage. Socket.IO is scaffolded in `server/src/server.js` but has no chat logic. Client has only placeholder pages (home → dashboard → back). `axios` and `socket.io-client` are installed but unused in client code.
