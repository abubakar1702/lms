
API endpoints live under `/api/` by default (e.g. `http://localhost:8000/api/auth/`). Update `VITE_API_BASE_URL` in the frontend to point to your running backend.

## Contributing

- Frontend work: create branches, add components under `src/components`, follow existing patterns.
- Backend changes: edit files under `server/lms` and create migrations when modifying models.

## Files to review

- Frontend entry: [client/lms/src/main.jsx](client/lms/src/main.jsx)
- Frontend app: [client/lms/src/App.jsx](client/lms/src/App.jsx)
- Auth context: [client/lms/src/context/AuthContext.jsx](client/lms/src/context/AuthContext.jsx)
## License

This project is provided under the terms in the repository (check `LICENSE` at project root if present).

---

If you want, I can also add a top-level README.md that documents both frontend and backend in one place. Would you like that?
# Learning Management System (LMS) — Frontend

This folder contains the React frontend for the LMS application built with Vite. The repository is split into two main parts:

- Frontend: [client/lms](client/lms/README.md)
- Backend: [server/lms](server/lms)

This README documents how to run the frontend locally and how it relates to the backend API.

## Project structure (frontend)

Key folders inside `client/lms/src`:

- `api/` — Axios instance and API helpers.
- `components/` — Reusable UI components (auth, course, dashboard, navbar, profile, sidebar).
- `context/` — React Contexts (e.g. `AuthContext.jsx`).
- `pages/` — Route pages (Courses, CourseDetail, Dashboard, Profile, etc.).

## Prerequisites

- Node.js 16+ and npm
- Running backend API (see [server/lms](server/lms)) at `http://localhost:8000` or update `VITE_API_BASE_URL`.

## Local setup (frontend)

1. Install dependencies

```bash
cd client/lms
npm install
```

2. Environment

Create a `.env` file in `client/lms` (you can copy `.env.example` if present):

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Run the development server

```bash
npm run dev
```

The frontend will typically be available at `http://localhost:5173`.