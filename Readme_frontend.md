# Weekly Tech Journal — Frontend

Weekly Tech Journal is a web application for presenting the **top five technology stories of the week** in a visually organized Bento Grid layout. It provides a Reader interface for browsing stories and an Editor interface for creating and managing weekly editions.

## Project Overview

The project has two main parts:

### Reader View

* Displays the top 5 stories in a Bento Grid layout.
* Allows users to open a story in a slide-out article drawer.
* Shows article details, tags, author information, key takeaways, and source links.
* Includes a weekly summary and editor's note.
* Supports edition archive and search.
* Supports bookmarking stories.
* Provides Dark and Light theme options.
* Includes a simulated audio player for article narration.

### Editor Panel

* Create and manage weekly editions.
* Edit edition details such as title, issue number, tagline, and date.
* Add and edit the five stories.
* Reorder stories between Bento Grid slots.
* Edit the weekly summary and editor's note.
* Preview the Bento Grid before publishing.
* Check publishing requirements using a validation checklist.
* Export edition data as JSON.

## My Contribution

My role in this project is **Frontend Development**.

I worked on:

* Designing and implementing the frontend user interface.
* Building the responsive Bento Grid layout.
* Creating reusable React components for the Reader and Editor interfaces.
* Implementing the article side drawer and story navigation.
* Implementing Dark and Light theme switching.
* Building the Editor Panel and its editing features.
* Implementing story slot reordering and live preview.
* Adding client-side data handling using `localStorage`.
* Implementing bookmarking, archive search, and other frontend interactions.

## Tech Stack

* **React** – Frontend UI and component-based development.
* **Vite** – Development server and build tool.
* **JavaScript** – Application logic and interactions.
* **Tailwind CSS & CSS** – Styling and responsive layouts.
* **Lucide React** – Icons.
* **Canvas Confetti** – Publishing animation.
* **localStorage** – Temporary client-side data persistence.

## Project Structure

The repository contains the existing project files along with my frontend implementation:

```text
weekly-tech-journal-api/
├── app/                    # Existing backend
├── lib/                    # Existing backend/supporting files
├── README.md               # Existing project documentation
├── README_frontend.md      # Frontend documentation
└── frontend/               # Frontend implementation
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── input.css
        ├── components/
        │   ├── Header.jsx
        │   ├── BentoGrid.jsx
        │   ├── BentoCard.jsx
        │   ├── ArticleDrawer.jsx
        │   ├── WeeklySummary.jsx
        │   ├── EditorsNote.jsx
        │   ├── ArchiveModal.jsx
        │   ├── EditorPanel.jsx
        │   ├── Footer.jsx
        │   └── editor/
        ├── data/
        │   ├── initialEditions.js
        │   └── storage.js
        └── utils/
            └── helpers.js
```

## Current Status

### Completed

* Reader interface
* Editor interface
* Responsive Bento Grid
* Article drawer
* Weekly summary and editor's note
* Edition archive and search
* Story bookmarking
* Dark and Light themes
* Story editing and slot reordering
* Live Bento Grid preview
* Publishing checklist
* LocalStorage-based persistence
* JSON data export

### Pending

* Connecting the frontend with the backend API.
* Connecting the application with the database.
* Replacing temporary localStorage/seed data with backend data where required.
* Authentication and authorization for the Editor panel, if required.
* Complete frontend-backend integration testing.
* Final deployment.

## How to Run Locally

Open the terminal inside the `frontend` folder and run:

```bash
npm install
npm run dev
```

The Vite development server will provide the local URL to open the application.

## Team / Contribution

This is a collaborative team project.

**My role:** Frontend Development

My contribution focuses on the user interface, React components, responsive design, frontend interactions, client-side state management, and Editor Panel functionality.
