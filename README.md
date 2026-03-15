# LocalStage

A two-sided marketplace connecting local Philly artists with local businesses.
Artists browse gigs. Businesses find talent. Matching is powered by OpenAI embeddings, not keyword search.

---

## What each user sees

**Business owner** -> `/business`
- Dashboard with active gigs and applicant count
- AI-recommended artists ranked by match score
- Post a Gig form to describe what they need

**Artist** -> `/artist`
- Feed of open gigs ranked by fit
- Match score on each card
- One-click apply

---

## Architecture

```text
frontend/     React + Vite + Tailwind   -> http://localhost:5173
backend/      FastAPI + Uvicorn         -> http://localhost:8000
db/           Supabase Postgres + pgvector (hosted, no local DB needed)
```

**How matching works**
1. Artist saves profile -> backend embeds bio and skills via OpenAI
2. Business posts gig -> backend embeds title and description via OpenAI
3. Artist opens feed -> backend finds gigs by cosine similarity to artist vector
4. Results are ranked by score

---

## Teammate Setup

### 1. Get the code

First time:

```bash
git clone https://github.com/daniyar-udel/Philly-Hackhaton.git
cd Philly-Hackhaton
git checkout dev
git pull origin dev
```

Already cloned:

```bash
git fetch origin
git checkout dev
git pull origin dev
```

Create your feature branch from `dev`:

```bash
git checkout -b feat/your-feature
```

---

### 2. Run the frontend

Check Node.js:

```bash
node --version
```

Need Node 18+.

Start the frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

If you are on Windows PowerShell and `npm` is blocked by execution policy, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`

Preview mode without keys:
- Open `frontend/src/App.jsx`
- Change `DEMO_ROLE` to `'business'` or `'artist'`

---

### 3. Run the backend

Check Python:

```bash
python --version
```

Need Python 3.11+.

From the repo root:

```bash
python -m venv .venv
```

Activate it:

Mac or Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows Git Bash:

```bash
source .venv/Scripts/activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Set up env:

```bash
cp backend/.env.example backend/.env
```

Start the backend from the repo root:

```bash
.\.venv\Scripts\python -m uvicorn backend.main:app --reload --port 8000
```

Or from inside `backend/`:

```bash
../.venv/Scripts/python -m uvicorn main:app --reload --port 8000
```

Swagger docs: `http://localhost:8000/docs`

Notes:
- `email-validator` is already included in `backend/requirements.txt`
- On Windows, `python -m uvicorn` is more reliable than plain `uvicorn`

---

### 4. Database

One person needs to do this once:

1. Create a free Supabase project at `https://supabase.com`
2. Open `SQL Editor -> New Query`
3. Paste the full contents of `db/schema.sql`
4. Run it
5. Share:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

---

## Environment Variables

`backend/.env`

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-supabase-jwt-secret
ENVIRONMENT=development
```

`frontend/.env`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_BASE_URL=http://localhost:8000
```

---

## Git Workflow

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature

git add .
git commit -m "feat: describe what you built"
git push -u origin feat/your-feature
```

Open a PR with:
- `base`: `dev`
- `compare`: `feat/your-feature`

Do not push directly to `main` or `dev`.

---

## Build Order

| Priority | Task | File(s) |
|----------|------|---------|
| 1 | Set up Supabase + run schema.sql | `db/schema.sql` |
| 2 | Wire backend auth to Supabase | `backend/routes/auth.py` |
| 2 | Wire frontend login to Supabase | `frontend/src/App.jsx`, `frontend/src/pages/Login.jsx` |
| 3 | Gig CRUD | `backend/routes/gigs.py` |
| 3 | Artist and business profile upsert | `backend/routes/profiles.py` |
| 4 | Generate embeddings on save | `backend/services/embeddings.py` |
| 4 | pgvector match queries | `backend/services/matching.py` |
| 5 | Wire real data into feed and dashboard | `frontend/src/pages/ArtistFeed.jsx`, `frontend/src/pages/BusinessDashboard.jsx` |
| 6 | Polish, loading states, error handling | everywhere |

Search the codebase for `TODO` to find stubs.

---

## Project Structure

```text
frontend/
  src/
    components/
    pages/
    App.jsx
    main.jsx

backend/
  main.py
  routes/
  services/
  models/
  db/
  requirements.txt

db/
  schema.sql
```
