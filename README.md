# Progress Tracker (Enterprise Productivity)

A full-stack productivity app for tracking goals + habits and generating AI-assisted planning.

- **Frontend**: React (Vite)
- **Backend**: Node/Express + Sequelize (MySQL)
- **AI**: Google Gemini via `@google/generative-ai`

> Note: `src/context/AuthContext.jsx` currently runs in **offline/guest mode** (it bypasses backend token validation and saves app state to `localStorage`). The backend remains available and is used by the AI endpoints.

---

## Features

### Core UX
- Landing page → Login / Register
- Sidebar navigation
- Dark/light mode
- Command palette (`Ctrl+K`) for quick navigation

### Tracking
- **Goals**: stored as a structured JSON object by period (daily/weekly/yearly)
- **Habits**: list of habits with per-date completion
- **History + streaks**: streak logic is derived from completed dates in `AppContext`

### AI-assisted planning
- **Daily briefing**: `POST /api/ai/briefing`
- **Strategic goal generator / planner**: `POST /api/ai/goal`

---

## Repo layout

- `src/`
  - `components/` UI views (Dashboard, Habits, Calendar, Analytics, Settings, etc.)
  - `context/`
    - `AuthContext.jsx` (auth + offline guest mode)
    - `AppContext.jsx` (app state: goals, habits, history, briefing, etc.)
- `backend/`
  - `server.js` Express app bootstrap + DB sync
  - `routes/`
    - `auth.js` register/login/verify endpoints (MySQL-backed)
    - `data.js` get/save `UserData` (MySQL-backed)
    - `ai.js` AI endpoints
  - `models/` Sequelize models (`User`, `UserData`)
  - `services/`
    - `aiService.js` Gemini prompt + JSON parsing
  - `middleware/`
    - `authMiddleware.js` JWT `protect` middleware

---

## How the app works (high level)

### Frontend state flow
1. `App.jsx`
   - Chooses which view to render based on `view` from `AppContext`
   - Shows login/register/landing when `user` is null
2. `AuthContext.jsx`
   - In the current version, authentication is effectively **offline**:
     - Any login/register/verify succeeds.
     - A local `tracker_token` is stored in `localStorage`.
     - A default `Guest User` is used.
3. `AppContext.jsx`
   - Loads persisted state from `localStorage` key: `tracker_app_data`
   - Keeps state for:
     - `goals`, `habits`, `history`, `isDarkMode`, `groups`
   - Updates `localStorage` with a debounce.

### AI call path
When the user generates or adjusts a strategic plan (see `StrategicRoadmap.jsx`):
1. Frontend calls `fetch('http://localhost:5000/api/ai/goal', ...)`
2. Backend `backend/routes/ai.js` calls:
   - `generateStrategicGoal(userInput, goalsData, options)`
3. `backend/services/aiService.js`
   - Builds a prompt and requests Gemini (`gemini-1.5-flash` → fallback models)
   - Attempts to `JSON.parse` the response
   - Returns JSON to the frontend
4. Frontend maps response JSON into UI state and stores it locally.

---

## Setup & running locally

### Prerequisites
- Node.js installed
- (Backend) MySQL running locally (only required if you plan to use MySQL-backed auth/data endpoints)
- (Backend) Gemini API key

### 1) Frontend
From repo root:
```bash
npm install
npm run dev
```
By default Vite serves on `http://localhost:5173`.

### 2) Backend
In `backend/`:
```bash
npm install
npm run dev
```
Backend runs on `http://localhost:5000` by default.

---

## Backend configuration (.env)

Create `backend/.env` with at least:

- `PORT=5000`
- `JWT_SECRET=...`
- `GEMINI_API_KEY=...`

If you want email verification + notifications to work:
- `EMAIL_USER=...`
- `EMAIL_PASS=...`

If MySQL is not set up, `server.js` will log guidance, including creating the `progress_tracker` database.

---

## Using the app

### Navigation
- Use the **sidebar** to switch between:
  - Dashboard
  - Habit Tracker
  - Calendar
  - Yearly Goals (Master plan)
  - Analytics
  - Settings & Profile
  - Strategic Roadmap
  - Group Intelligence

### Command palette
- Press **Ctrl+K**
- Type to search/navigation

### AI: Strategic Roadmap
1. Open **Strategic Roadmap**.
2. Select a tab (Daily / Weekly / Yearly).
3. Enter a goal description in **AI Goal Architect**.
4. Click **Generate Strategy**.
5. The app will display a structured plan (days + tasks). You can:
   - Mark tasks complete
   - Expand an objective
   - Use SMART actions:
     - ⚡️ Make it Easier (`simplify`)
     - 🔥 Upgrade Difficulty (`upgrade`)
     - 🗓️ Adjust Schedule (If Behind) (`catchup`)

### AI endpoints (for developers)
- Daily briefing:
  - `POST /api/ai/briefing`
  - Body: `{ userData: { habits, goals, streak, ... } }`
- Strategic goal:
  - `POST /api/ai/goal`
  - Body: `{ userInput, goalsData, adjustmentType?, currentPlan? }`

---

## Data model overview

### `User` (MySQL via Sequelize)
Fields:
- `id` (UUID)
- `name`
- `email` (unique)
- `password` (bcrypt hash)
- `isVerified`
- `verificationCode`

### `UserData`
Fields (stored as JSON columns):
- `goals` (nested structure by period)
- `habits` (array)
- `history` (array)
- `isDarkMode` (boolean)

---

## Notes for future contributors

1. **Auth is offline right now**
   - `AuthContext.jsx` currently bypasses backend token validation.
   - If you want real auth to work, you’ll need to:
     - Call backend `/api/auth/login` and store the real JWT token
     - Update `AuthContext.jsx` to validate via `/api/auth/verify`
     - Update `AppContext.jsx` to load/save via `backend/routes/data.js`

2. **AI responses must stay JSON**
   - `aiService.js` expects Gemini to return strict JSON.
   - It does a best-effort cleanup for markdown fences.

3. **Keep frontend JSON mapping in sync**
   - The UI expects AI output like:
     - `title`
     - `duration`
     - `days: [{ day, title, completed, tasks: [{ name, done }] }]`

---

## Development commands

- Frontend:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Backend:
  - `npm run dev` (uses nodemon)

---

## Troubleshooting

### CORS / connection errors to backend
Ensure backend is running on `http://localhost:5000`.

### AI errors (Gemini)
Check:
- `backend/.env` has `GEMINI_API_KEY`
- Response JSON parse failures (log will show the raw AI text)

### MySQL connection errors
Create DB:
```sql
CREATE DATABASE progress_tracker;
```
Then restart backend.

