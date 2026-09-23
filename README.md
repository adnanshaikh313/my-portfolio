# Adnan Shaikh — Portfolio

Personal portfolio site for **Adnan Samir Shaikh**, MCA student & aspiring Data Engineer.

- **Frontend:** React + Vite (dark data-engineering theme)
- **Backend:** Python FastAPI
- **Database:** MongoDB (profile, skills, education, projects, contact messages)

## Run it

### 1. Database — MongoDB
Install and start MongoDB locally (or use a free MongoDB Atlas cluster and put
its connection string in `backend/.env`).

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # edit MONGO_URI and ADMIN_KEY inside
uvicorn app:app --reload --port 8000
```
The database auto-seeds on first startup. API docs: http://localhost:8000/docs

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 — API calls are proxied to the backend.

## Admin panel

Open http://localhost:5173/#admin and enter your `ADMIN_KEY` (from `backend/.env`).
You can:
- Read / delete contact-form messages
- Add, edit and delete projects (they appear on the site instantly — no code changes)

## Editing content

- **Profile / about / skills / education:** edit the `SEED_*` data in
  `backend/app.py`, delete the seeded documents from MongoDB, and restart the
  server (or edit them directly in MongoDB).
- **Projects:** use the admin panel — no code needed.
- **Theme:** tweak CSS variables at the top of `frontend/src/styles.css`.

## Deploying

- Frontend: `npm run build` → deploy the `dist/` folder (Netlify, Vercel, etc.),
  pointing API calls at your hosted backend URL.
- Backend: run with `uvicorn app:app --host 0.0.0.0 --port 8000` on any VPS;
  set `MONGO_URI` to your Atlas connection string.
