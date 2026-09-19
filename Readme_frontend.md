# Weekly Tech Journal — Frontend

Weekly Tech Journal is a modern web application designed for reading, curating, and publishing the **top five technology stories of the week** in a responsive Bento Grid layout. It provides a rich **Reader View** for audiences and a dedicated **Editor Studio** for editorial management.

---

## Architecture Overview

The repository is structured with a decoupled Frontend (React / Vite) and Backend (Next.js Route Handlers):

```text
weekly-tech-journal-api/
├── backend/
│   ├── app/
│   │   └── api/
│   │       └── editions/
│   │           ├── route.ts                          # GET (list), POST (create draft)
│   │           └── [id]/
│   │               ├── route.ts                      # GET (fetch), PATCH (update), DELETE
│   │               ├── preview/route.ts              # GET (read-only preview with articles)
│   │               ├── publish/route.ts              # PATCH (publish / schedule)
│   │               └── articles/
│   │                   ├── route.ts                  # GET (list articles), POST (add article)
│   │                   └── [articleId]/route.ts      # GET, PATCH, DELETE
│   └── lib/
│       ├── types.ts                                  # Backend domain models (Edition, Article, Author, Source)
│       ├── api-response.ts                           # apiSuccess() / apiError() envelopes
│       └── mock-data.ts                              # Backend seed data store
├── frontend/
│   ├── src/
│   │   ├── main.jsx                                  # React entry point
│   │   ├── App.jsx                                   # Top-level state orchestration & API routines
│   │   ├── components/
│   │   │   ├── Header.jsx                            # Masthead navigation, theme switch, view toggle
│   │   │   ├── BentoGrid.jsx                         # 5-card responsive Bento layout
│   │   │   ├── BentoCard.jsx                         # Interactive story card with hover effects
│   │   │   ├── ArticleDrawer.jsx                     # Slide-out full-length article reader with audio player
│   │   │   ├── WeeklySummary.jsx                     # "The Week in 150 Words" narrative block
│   │   │   ├── EditorsNote.jsx                       # Editorial note & signature
│   │   │   ├── ArchiveModal.jsx                      # Edition search & bookmarks drawer
│   │   │   ├── Footer.jsx                            # Footer branding and links
│   │   │   ├── EditorPanel.jsx                       # Main CMS Studio container
│   │   │   └── editor/
│   │   │       ├── EditionManager.jsx                # Edition metadata editor & status controls
│   │   │       ├── StoryEditor.jsx                   # 5-story editor (headlines, takeaways, Markdown body)
│   │   │       ├── BentoLivePreview.jsx              # Live preview of the Bento Grid
│   │   │       ├── PublishingChecklist.jsx           # Validation checklist before publishing
│   │   │       ├── WeeklySummaryEditor.jsx           # Summary text editor with word counter
│   │   │       └── EditorsNoteEditor.jsx             # Editor note & avatar manager
│   │   ├── data/
│   │   │   ├── api.js                                # Centralized fetch API access layer
│   │   │   ├── adapters.js                           # Bidirectional data mappers (Backend <-> Frontend)
│   │   │   ├── storage.js                            # Client-side preferences (Bookmarks, Theme)
│   │   │   └── initialEditions.js                    # Editorial seed templates
│   │   └── utils/
│   │       └── helpers.js                            # Formatters, category themes, read time estimators
│   ├── package.json
│   └── vite.config.js                                # Dev server proxy & build configuration
├── README.md                                         # Backend API documentation
└── Readme_frontend.md                                # Frontend documentation
```

---

## API Integration & Endpoints

The frontend communicates with the backend via the centralized API client in `frontend/src/data/api.js`. Every request processes standard success (`{ success: true, data: ... }`) and error (`{ success: false, error: { message, details } }`) envelopes.

### Integrated Routes

| HTTP Method | Route Endpoint | Frontend Feature / Handler |
|---|---|---|
| `GET` | `/api/editions` | Loads all editions for the Archive, Switcher, and initial app bootstrap. |
| `POST` | `/api/editions` | Creates a new draft edition in the Editor Panel. |
| `GET` | `/api/editions/:id` | Fetches a single edition's metadata. |
| `PATCH` | `/api/editions/:id` | Updates edition title, description/tagline, or weekOf date. |
| `DELETE` | `/api/editions/:id` | Deletes a draft edition from the backend. |
| `GET` | `/api/editions/:id/preview` | Assembles a full read-only edition with its articles inlined. |
| `PATCH` | `/api/editions/:id/publish` | Publishes (`{ action: "publish" }`) or schedules (`{ action: "schedule", scheduledFor }`) an edition. |
| `GET` | `/api/editions/:id/articles` | Lists all articles belonging to an edition. |
| `POST` | `/api/editions/:id/articles` | Creates a new article with headline, summary, content, takeaways, sources, author. |
| `GET` | `/api/editions/:id/articles/:articleId` | Fetches a single article by ID. |
| `PATCH` | `/api/editions/:id/articles/:articleId` | Updates headline, summary, markdown content, key takeaways, sources, or author info. |
| `DELETE` | `/api/editions/:id/articles/:articleId` | Removes an article from an edition. |

---

## Data Adapters & Mapping Layer

Backend schemas and frontend UI models are adapted transparently in `frontend/src/data/adapters.js`:

- **Edition**:
  - `title`, `weekOf`, `description`, `status`, `scheduledFor`, `publishedAt` map directly.
  - `number`: Extracted automatically from title/id (e.g., `#069` or `Issue #1` -> `"001"` / `"069"`).
  - `tagline` & `weeklySummary`: Sourced from backend `description`.
  - `stories`: Inlined articles array from `/preview` or `/articles` mapped to 5 slots.
- **Article / Story**:
  - `headline` <-> `title`
  - `summary` <-> `subtitle`
  - `content` <-> `content` (Markdown formatted)
  - `keyTakeaways` <-> `takeaways` (bullet points array)
  - `sources` <-> `source: { name, url }`
  - `author` <-> `author: { name, role, avatar }` (mapped from `avatarUrl`)
  - `readTime`: Calculated automatically using `estimateReadTime(content)`.

---

## Client-Side vs Server-Side Data

### Server-Owned Data (Backend API is Source of Truth)
- Editions and edition metadata
- Articles and article body content
- Key takeaways and sources
- Author credentials
- Publishing lifecycle state (`draft`, `scheduled`, `published`)

### Client-Owned State (`localStorage`)
- **User Theme Preference** (`wtj_theme_v1`): Dark Obsidian mode vs Light Paper mode.
- **User Bookmarks** (`wtj_bookmarks_v1`): List of saved story IDs for offline quick-access in the archive drawer.

---

## Known Backend API Limitations Affecting Frontend

1. **Story Slot Ordering**: The backend stores articles as a flat list (`articleIds: string[]`) without a dedicated slot/ordering endpoint. The frontend maps slots 1 through 5 based on the array order returned by the backend. Slot swaps during editing are maintained in the client draft session.
2. **Editorial Perspective Note**: The backend `Edition` model does not have a distinct field for "From the Editor" notes. The frontend displays an editorial note fallback and preserves the narrative structure.

---

## How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Frontend Development Server
From the `frontend` folder:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

### 3. Environment Variables
- `VITE_API_BASE_URL` *(Optional)*: Base URL for backend API requests (e.g., `http://localhost:3000`). If left empty, relative requests `/api/...` are used and automatically proxied to `http://localhost:3000` by the Vite dev server.

### 4. Production Build
```bash
npm run build
```
Generates optimized static assets in `frontend/dist/`.

---

## Project Status

- [x] Full integration with all 11 backend API routes.
- [x] Zero backend modifications (preserved API contract and files).
- [x] Centralized API layer with error envelopes and status checks.
- [x] Bidirectional data adapters with fallback protection for Bento 5-slot layouts.
- [x] Reader view connected to live API preview endpoints.
- [x] Editor Studio connected to edition and article CRUD + publish APIs.
- [x] Client-side preferences (bookmarks, theme) retained.
- [x] Full production build verified with zero errors.
