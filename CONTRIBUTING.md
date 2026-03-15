# LocalStage Developer Guide

Read this before starting work. It explains what each person owns, how the pieces connect, and how to avoid conflicts.

---

## Big Picture

We have two user types:
- Artists: musicians, muralists, photographers, and similar creators
- Businesses: bars, cafes, event spaces, and local shops

The matching layer uses OpenAI embeddings. That means we convert artist profiles and gig descriptions into vectors, store them in Supabase, and rank matches by similarity instead of exact keyword overlap.

Example:

```text
Artist bio:  "lively acoustic guitarist who loves cafes"
Gig post:    "upbeat live music for our coffee shop opening"

Different words, similar meaning, strong match.
```

---

## System Flow

```text
Frontend (React) <-> Backend (FastAPI) <-> Supabase
                                   |
                                   +-> OpenAI embeddings
```

- Frontend talks to backend over HTTP
- Backend reads and writes Supabase data
- Backend calls OpenAI to generate embeddings
- Supabase stores users, gigs, profiles, applications, and vectors

---

## Team Split

### Plan A: Supabase + Backend Foundation

**Suggested branch:** `feat/backend-supabase`

This person owns the database setup and the backend routes that save and read real data.

Main files:
- `db/schema.sql`
- `backend/routes/auth.py`
- `backend/routes/gigs.py`
- `backend/routes/profiles.py`
- `backend/db/client.py`

#### Plan A checklist

1. Create the Supabase project
2. Run `db/schema.sql`
3. Share:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
4. Replace placeholder auth logic in `backend/routes/auth.py`
5. Replace placeholder gig CRUD in `backend/routes/gigs.py`
6. Replace placeholder profile upsert logic in `backend/routes/profiles.py`
7. Confirm backend routes work against real Supabase data

#### You are done when

- `POST /auth/signup` creates a user in Supabase
- `POST /auth/login` returns a real session or access token
- `POST /gigs` saves a gig
- `GET /gigs` returns real gigs
- Artist profile save works against Supabase

---

### Plan B: AI Matching

**Suggested branch:** `feat/ai-matching`

This person owns embeddings and similarity search.

Main files:
- `backend/services/embeddings.py`
- `backend/services/matching.py`
- `backend/routes/match.py`
- parts of `backend/routes/gigs.py`
- parts of `backend/routes/profiles.py`

#### Plan B checklist

1. Add `OPENAI_API_KEY` to `backend/.env`
2. Verify embedding generation works
3. Generate gig embeddings after gig creation
4. Generate artist profile embeddings after profile save
5. Wire `match_gigs` and `match_artists` RPC calls
6. Expose match endpoints in `backend/routes/match.py`

#### You are done when

- Gigs store embeddings in Supabase
- Artist profiles store embeddings in Supabase
- `GET /match/gigs?artist_id=...` returns ranked gigs
- `GET /match/artists?gig_id=...` returns ranked artists

---

### Plan C: Frontend Integration

**Suggested branch:** `feat/frontend`

This person owns the UI, auth wiring, and replacing mock data with live API data.

Main files:
- `frontend/src/App.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/ArtistFeed.jsx`
- `frontend/src/pages/BusinessDashboard.jsx`
- `frontend/src/pages/PostGig.jsx`

#### Plan C checklist

1. Keep using mock data until backend endpoints are ready
2. Replace demo auth with real auth flow
3. Load matched gigs for artists
4. Load matched artists for businesses
5. Submit real gig creation requests
6. Add loading, empty, and error states

#### You are done when

- Signup and login work
- Artist feed shows real matches
- Business dashboard shows real matches
- Posting a gig saves data
- Demo flow looks clean enough to present

---

## Git Rules

Always branch from `dev`.

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-branch-name
```

Save work often:

```bash
git add .
git commit -m "feat: describe what you built"
git push -u origin feat/your-branch-name
```

When ready, open a PR:
- `base`: `dev`
- `compare`: `feat/your-branch-name`

Rules:
- Never push directly to `main`
- Never push directly to `dev`
- Never commit `.env`

---

## Staying In Sync

- Share Supabase keys as soon as they are ready
- Post finished endpoints in team chat
- Tell the frontend person when mock data can be replaced
- Raise blockers quickly

---

## Local Setup

From the repo root:

```bash
git clone https://github.com/daniyar-udel/Philly-Hackhaton.git
cd Philly-Hackhaton
git checkout dev
git pull origin dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Backend:

```bash
cd ..
python -m venv .venv
```

Activate:

```bash
source .venv/Scripts/activate
```

Or in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies and run:

```bash
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
.\.venv\Scripts\python -m uvicorn backend.main:app --reload --port 8000
```

Docs:
- Frontend: `http://localhost:5173`
- Backend docs: `http://localhost:8000/docs`

---

## Current Reality Check

Before starting Plan A, make sure these are true:

- You are in the repo folder, not `~`
- You are on a feature branch created from `dev`
- `backend/requirements.txt` is installed into `.venv`
- `frontend/node_modules` exists after `npm install`
- `backend/.env` and `frontend/.env` are filled in

If all five are true, you are in good shape to continue with Plan A.
