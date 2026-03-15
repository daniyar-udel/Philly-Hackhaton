# LocalStage — Developer Guide 🛠️

This file is for the team. Read this before you write a single line of code.
It explains what each person is building, how the pieces talk to each other, and how to not step on each other's toes.

---

## The Big Picture

We have two types of users:
- **Artists** — musicians, muralists, photographers, etc. They browse gigs and apply.
- **Businesses** — bars, coffee shops, etc. They post gigs and find talent.

The magic is the **matching**. When an artist fills out their profile and a business posts a gig, we convert both into numbers using OpenAI. Numbers that are "close" to each other mean they're a good match — even if they share zero words in common.

Example:
```
Artist bio:   "lively acoustic guitarist who loves cafés"
Gig posting:  "upbeat live music for our coffee shop opening"

→ Different words. Same smell. High match score.
```

Those numbers (called embeddings) are stored in Supabase. When an artist opens their feed, Supabase finds the gigs whose numbers are closest to the artist's numbers and returns them ranked.

---

## How the three pieces talk to each other

```
┌─────────────────────┐         ┌──────────────────────┐
│     FRONTEND        │ ──────▶ │      BACKEND         │
│  React + Tailwind   │  HTTP   │  FastAPI (Python)    │
│  localhost:5173     │ ◀────── │  localhost:8000      │
└─────────────────────┘         └──────────┬───────────┘
                                            │ reads/writes
                                 ┌──────────▼───────────┐
                                 │      SUPABASE        │
                                 │  Postgres database   │
                                 │  pgvector (vectors)  │
                                 │  Auth (login tokens) │
                                 └──────────────────────┘
                                            │
                                 ┌──────────▼───────────┐
                                 │      OPENAI          │
                                 │  Converts text into  │
                                 │  numbers (embeddings)│
                                 └──────────────────────┘
```

- **Frontend** talks only to the Backend (never directly to Supabase or OpenAI)
- **Backend** talks to Supabase (database) and OpenAI (embeddings)
- **Supabase** stores everything: users, gigs, profiles, vectors

---

## Team Split

### Person A — Supabase + Backend Foundation
**Branch:** `feat/backend-supabase`

You are building the database and all the routes that save and read data.
You are the person who makes the app actually remember things.

**Your work feeds into:**
- Person B needs your tables to store and read embeddings
- Person C (frontend) calls your routes to log in, post gigs, view profiles

---

#### Set up Supabase (do this FIRST, everyone is blocked until this is done)

1. Go to https://supabase.com → create a free project
2. Go to **SQL Editor → New Query**
3. Paste the entire contents of `db/schema.sql` → click Run
4. Go to **Settings → API** → copy these and share in group chat:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` ← frontend uses this
   - `SUPABASE_SERVICE_KEY` ← backend uses this (keep secret, don't share publicly)

---

#### Wire up auth → `backend/routes/auth.py`

Find the `# TODO` comments. Replace the placeholder returns with real Supabase calls:

```python
# signup
response = supabase.auth.sign_up({"email": body.email, "password": body.password})
user = response.user
# save role to our users table
supabase.table("users").insert({"id": user.id, "role": body.role}).execute()
return {"user_id": user.id, "role": body.role}

# login
response = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
return {"access_token": response.session.access_token, "role": body.role}
```

---

#### Wire gig CRUD → `backend/routes/gigs.py`

```python
# POST /gigs — create a gig
result = supabase.table("gigs").insert({
    "business_id": body.business_id,
    "title": body.title,
    "category": body.category,
    "description": body.description,
    "pay": body.pay,
    "date": body.date,
    "location": body.location,
}).execute()
gig = result.data[0]
# after insert, tell Person B to generate the embedding (call embed_gig)

# GET /gigs — list open gigs
result = supabase.table("gigs").select("*").eq("status", "open").execute()
return {"gigs": result.data}
```

---

#### Wire profile upsert → `backend/routes/profiles.py`

```python
# PUT /profiles/artist/:user_id
result = supabase.table("artist_profiles").upsert({
    "user_id": user_id,
    "display_name": body.display_name,
    "bio": body.bio,
    "category": body.category,
    "skills": body.skills,
    "location": body.location,
}).execute()
# after upsert, tell Person B to generate the embedding (call embed_artist_profile)
```

---

#### Wire applications → `backend/routes/gigs.py`

```python
# POST /gigs/:id/apply — artist applies to a gig
result = supabase.table("applications").insert({
    "gig_id": gig_id,
    "artist_id": body.artist_id,
    "message": body.message,
}).execute()
return {"application": result.data[0]}
```

---

#### You are done when:
- [ ] `POST /auth/signup` creates a real user in Supabase
- [ ] `POST /auth/login` returns a real access token
- [ ] `POST /gigs/` saves a gig to the `gigs` table
- [ ] `GET /gigs/` returns real gigs from the database
- [ ] `PUT /profiles/artist/:id` saves a real artist profile

---
---

### Person B — AI Matching
**Branch:** `feat/ai-matching`

You are building the brain. You turn text into numbers (embeddings) using OpenAI, store them in Supabase, and write the queries that find the best matches.

**Your work feeds into:**
- Person A's routes call your embedding functions after saving data
- Person C (frontend) calls your `/match/gigs` and `/match/artists` endpoints to show the feed

---

#### Get your OpenAI key

Add to `backend/.env`:
```
OPENAI_API_KEY=sk-...
```

Test the embedding service is working (`backend/services/embeddings.py` is already written):
```python
# run this in a quick test script to confirm it works
import asyncio
from services.embeddings import embed_text

async def test():
    result = await embed_text("lively acoustic guitarist who loves cafés")
    print(len(result))  # should print 1536

asyncio.run(test())
```

---

#### Embed gigs when they are created → `backend/routes/gigs.py`

Coordinate with Person A — after they insert a gig, add this:
```python
from services.embeddings import embed_gig

# after the insert:
embedding = await embed_gig(gig)  # gig is the dict with title, description, etc
supabase.table("gigs").update({"embedding": embedding}).eq("id", gig["id"]).execute()
```

---

#### Embed profiles when they are saved → `backend/routes/profiles.py`

```python
from services.embeddings import embed_artist_profile

# after the upsert:
embedding = await embed_artist_profile(profile)
supabase.table("artist_profiles").update({"embedding": embedding}).eq("user_id", user_id).execute()
```

---

#### Wire the match queries → `backend/services/matching.py`

The SQL functions `match_gigs` and `match_artists` are already in `db/schema.sql` — Supabase runs them for you. Just call them:

```python
# find gigs that match an artist
def top_gigs_for_artist(artist_embedding, limit=10):
    result = supabase.rpc("match_gigs", {
        "query_embedding": artist_embedding,
        "match_count": limit
    }).execute()
    return result.data  # already sorted by match_score, high to low

# find artists that match a gig
def top_artists_for_gig(gig_embedding, limit=10):
    result = supabase.rpc("match_artists", {
        "query_embedding": gig_embedding,
        "match_count": limit
    }).execute()
    return result.data
```

---

#### Wire the match endpoints → `backend/routes/match.py`

```python
# GET /match/gigs?artist_id=xxx
async def match_gigs_to_artist(artist_id: str):
    # 1. fetch artist's embedding from supabase
    result = supabase.table("artist_profiles").select("embedding").eq("user_id", artist_id).execute()
    embedding = result.data[0]["embedding"]
    # 2. run similarity search
    matches = top_gigs_for_artist(embedding)
    return {"artist_id": artist_id, "matches": matches}

# GET /match/artists?gig_id=xxx
async def match_artists_to_gig(gig_id: str):
    result = supabase.table("gigs").select("embedding").eq("id", gig_id).execute()
    embedding = result.data[0]["embedding"]
    matches = top_artists_for_gig(embedding)
    return {"gig_id": gig_id, "matches": matches}
```

---

#### You are done when:
- [ ] Posting a gig automatically saves a vector in the `gigs.embedding` column in Supabase
- [ ] Saving an artist profile saves a vector in `artist_profiles.embedding`
- [ ] `GET /match/gigs?artist_id=xxx` returns a real ranked list with real match scores
- [ ] `GET /match/artists?gig_id=xxx` returns a real ranked list

---
---

### Person C — Frontend (you)
**Branch:** `feat/frontend`

You are building everything the user sees. You replace mock data with real API calls, wire up login, and make the UI look good enough to demo.

**Your work feeds into:**
- You depend on Person A for login and gig/profile routes
- You depend on Person B for the match endpoints
- While they build: keep using mock data. When they're done: swap in the real API call. One line change.

---

#### Wire real login → `frontend/src/pages/Login.jsx`

```js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// in handleSubmit:
if (mode === 'signup') {
  const { data, error } = await supabase.auth.signUp({ email, password })
  // also POST to /profiles/artist or /profiles/business to save role
} else {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
}
```

---

#### Replace DEMO_ROLE with real auth → `frontend/src/App.jsx`

```js
// replace the fake useAuth() with:
const [session, setSession] = useState(null)
const [role, setRole] = useState(null)

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)
    setRole(data.session?.user?.user_metadata?.role)
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
    setRole(session?.user?.user_metadata?.role)
  })
}, [])
```

---

#### Wire Artist Feed → `frontend/src/pages/ArtistFeed.jsx`

```js
// replace MOCK_GIGS with:
useEffect(() => {
  fetch(`/api/match/gigs?artist_id=${user.id}`)
    .then(r => r.json())
    .then(data => setGigs(data.matches))
}, [])
// data.matches has: title, pay, date, category, match_score — same shape as mock
```

---

#### Wire Business Dashboard → `frontend/src/pages/BusinessDashboard.jsx`

```js
// replace MOCK_ARTISTS with:
useEffect(() => {
  fetch(`/api/match/artists?gig_id=${activeGigId}`)
    .then(r => r.json())
    .then(data => setRecommended(data.matches))
}, [activeGigId])
```

---

#### Wire Post Gig form → `frontend/src/pages/PostGig.jsx`

```js
// replace console.log with:
await fetch('/api/gigs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
  body: JSON.stringify(form)
})
navigate('/business')
```

---

#### Make it look good

Improve the UI using Tailwind. Ideas:
- Add loading spinners while API calls are in flight
- Add empty states ("No gigs yet — post one!")
- Make the match score badge look more impressive
- Add artist category icons or colors
- Make the cards feel more like a social feed

---

#### You are done when:
- [ ] Login and signup work for both artist and business
- [ ] Artist sees real matched gigs (not mock data)
- [ ] Business sees real matched artists
- [ ] Posting a gig saves it to the database
- [ ] UI looks clean enough to demo on stage

---

## Git Rules (important — read this)

```bash
# start your work
git checkout dev           # always branch from dev, not main
git pull origin dev
git checkout -b feat/your-branch-name

# save your work often
git add .
git commit -m "feat: describe what you just built"
git push origin feat/your-branch-name

# when your feature is ready, open a PR on GitHub
# → base: dev  (NOT main)
# → compare: feat/your-branch-name
```

**Never push directly to `main` or `dev`.** Always go through a PR.

**Do NOT commit your `.env` file.** It has secret keys. It is in `.gitignore` for a reason.

---

## Staying in sync

- Share Supabase keys in the group chat the moment they're ready
- If you're blocked, say so immediately — don't sit on it
- When Person A finishes an endpoint, post the route in the chat so Person C can wire it up
- When Person B finishes matching, post in chat so Person C can swap out the mock data

---

## Quick start (run on your laptop)

```bash
# 1. get the code
git clone https://github.com/daniyar-udel/Philly-Hackhaton.git
cd Philly-Hackhaton
git checkout dev

# 2. frontend
cd frontend
npm install
cp .env.example .env    # fill in Supabase keys from group chat
npm run dev             # → http://localhost:5173

# 3. backend (new terminal)
cd backend
python3 -m venv venv
source venv/bin/activate       # windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # fill in all keys from group chat
uvicorn main:app --reload --port 8000   # → http://localhost:8000/docs
```

> **Preview UI without any keys:** open `frontend/src/App.jsx`, set `DEMO_ROLE = 'business'` or `'artist'`
