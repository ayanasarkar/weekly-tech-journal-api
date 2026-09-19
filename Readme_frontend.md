# Weekly Tech Journal — Frontend

A React + Vite frontend for reading and managing the Weekly Tech Journal.

The frontend provides:

- Reader View with a responsive Bento Grid
- Archive and edition browsing
- Editor Studio for managing editions and articles
- Light/Dark theme
- Bookmarks
- Backend API integration

## Project Structure

```text
frontend/
├── src/
│   ├── components/       # UI components
│   ├── data/
│   │   ├── api.js        # Backend API calls
│   │   ├── adapters.js   # Backend ↔ frontend data mapping
│   │   └── storage.js    # Theme and bookmarks
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Completed Work

- Built the Reader View and responsive Bento Grid.
- Built the Editor Studio interface.
- Organized the frontend into components and data layers.
- Integrated the frontend with the existing backend API.
- Added a centralized API layer in `src/data/api.js`.
- Added data adapters to map backend data to frontend models.
- Connected editions and articles to the API.
- Connected create, update, and delete operations.
- Connected preview and publish operations.
- Added API loading and error handling.
- Kept theme and bookmarks as frontend-only local storage.
- Added Vite API proxy configuration.
- Verified the frontend production build successfully.

## Backend Responsibility

The backend is maintained separately by Ayana.

Ayana is responsible for:

- Backend project structure and configuration.
- Running and configuring the backend API.
- Backend API and data handling.
- Database or backend data configuration.
- Ensuring the existing API routes are available for the frontend.

The frontend consumes the existing backend API and does not modify the backend API contract or backend logic.

## Remaining Work

- Complete backend setup and configuration.
- Run and verify the backend API.
- Test the complete frontend against the running backend.
- Fix any frontend/API integration issues found during final testing.

## Run Frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

This generates the production build in `frontend/dist/`.

## Team Responsibility

**Frontend:** Anamika  
**Backend:** Ayana
