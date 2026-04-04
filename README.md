# The Grid (CTF Platform)

Full-stack CTF platform with:

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT + role-based access (`player`, `gm`)
- Features: challenges, flag submission, scoreboard, team profiles, GM admin panel

## Project Structure

- Frontend app: [src](src)
- Backend API: [backend/src](backend/src)

## 1) Local Setup

### Frontend

1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy [.env.example](.env.example) to `.env`
3. Run frontend:
   - `npm run dev`

### Backend

1. Move into backend folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - copy [backend/.env.example](backend/.env.example) to `backend/.env`
4. Seed initial data:
   - `npm run seed`
5. Run API:
   - `npm run dev`

API runs at `http://localhost:5000` and frontend expects `VITE_API_BASE_URL=http://localhost:5000/api`.

## 2) Default Seed Users

- Player: `player1 / pass123`
- Player: `player2 / pass123`
- GM: `gmaster / admin123`

## 3) Host Your Own MongoDB

You can use either option:

### Option A: MongoDB Atlas (easiest for deployment)

1. Create Atlas account and cluster.
2. Create DB user (username/password).
3. In Network Access, allow your server IP (or temporary `0.0.0.0/0` for testing).
4. Copy connection string:
   - `mongodb+srv://<user>:<pass>@<cluster-url>/the-grid?retryWrites=true&w=majority`
5. Put it in `backend/.env` as `MONGODB_URI`.

### Option B: Self-host MongoDB with Docker (your own server/VPS)

1. Install Docker on your VPS.
2. Run MongoDB container with auth enabled:
   - `docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=<strong-password> -v mongodb_data:/data/db mongo:7`
3. Open firewall only for trusted IPs.
4. Use connection string:
   - `mongodb://admin:<strong-password>@<your-server-ip>:27017/the-grid?authSource=admin`
5. Put that in `backend/.env` as `MONGODB_URI`.

## 4) Make It Deployable

### Backend deploy checklist

Set these environment variables on your host:

- `PORT=5000`
- `MONGODB_URI=...`
- `JWT_SECRET=<long-random-secret>`
- `FLAG_SECRET=<long-random-secret>`
- `FRONTEND_URL=<your-frontend-domain>`

Then run:

- `npm install`
- `npm run seed` (first deployment only)
- `npm start`

### Frontend deploy checklist

Set:

- `VITE_API_BASE_URL=https://<your-api-domain>/api`

Build and deploy static assets:

- `npm run build`
- Deploy `dist/` to Vercel/Netlify/static host.

## 5) Implemented Roles/Features

- Player:
  - login
  - view challenges
  - submit flags
  - see scoreboard
  - browse team profiles
- GM:
  - challenge CRUD
  - admin stats
- Security & consistency:
  - JWT protected routes
  - role-based middleware
  - server-side flag validation with hash
  - score derived from accepted submissions

## 6) Next Enhancements (recommended)

- Add rate limiting on flag submissions.
- Add WebSocket updates for live scoreboard/challenge solves.
- Add audit logs for GM actions.
- Add per-team invite/join management.
