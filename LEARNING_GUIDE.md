# 📖 Weekly Tech Journal — Student Learning & Cloning Guide

> **Welcome!** This guide contains the full roadmap, architecture breakdown, and notes from our conversation so you can easily reference and clone this project step-by-step.

---

## 🧭 3-Phase Step-by-Step Cloning Roadmap

### **Phase 1: HTML & CSS (Start Here)**
- [ ] Build the **Header** with brand title and theme switch button.
- [ ] Create the **Bento Grid** container using CSS Grid:
  ```css
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .bento-slot-1 {
    grid-column: span 2;
    grid-row: span 2; /* Big Hero Card */
  }
  .bento-slot-4 {
    grid-column: span 2; /* Wide Bottom Card */
  }
  ```
- [ ] Create cards with background images, gradient overlay, and category pills.
- [ ] Add the **"THE WEEK, IN 150 WORDS"** and **"FROM THE EDITOR"** sections below the grid.

---

### **Phase 2: JavaScript (Adding Interactivity)**
- [ ] **Slide-out Drawer**: Add a click event to cards that opens the side-panel (`drawer.classList.add('open')`).
- [ ] **Close Drawer**: Listen for the close (X) button and the <kbd>Esc</kbd> key.
- [ ] **Theme Switcher**: Store `'dark'` or `'light'` in `localStorage.setItem('theme', ...)`.
- [ ] **Word Counter**: Write a helper function to count words for the 150-word summary.

---

### **Phase 3: React (Component-Based Architecture)**
- [ ] Break your HTML into clean, reusable components:
  - `<Header />`
  - `<BentoGrid />` & `<BentoCard />`
  - `<ArticleDrawer />`
  - `<WeeklySummary />`
  - `<EditorsNote />`
  - `<EditorPanel />`
- [ ] Manage active state with React Hooks:
  ```jsx
  const [activeStory, setActiveStory] = useState(null); // Which story is open in the drawer
  const [viewMode, setViewMode] = useState('reader');   // 'reader' or 'editor'
  const [theme, setTheme] = useState('dark');          // 'dark' or 'light'
  ```

---

## 📂 Project Architecture Map

| File | What It Does | Key Concept to Learn |
| :--- | :--- | :--- |
| [`src/App.jsx`](./src/App.jsx) | Root state & coordinator | `useState`, `useEffect`, passing props |
| [`src/index.css`](./src/index.css) | Core styles & animations | CSS Grid, Flexbox, CSS Variables, Transitions |
| [`src/components/BentoGrid.jsx`](./src/components/BentoGrid.jsx) | Renders the 5 Bento slots | Array `.map()`, Slot positioning |
| [`src/components/ArticleDrawer.jsx`](./src/components/ArticleDrawer.jsx) | Slide-out reading panel | Conditional rendering, audio player logic |
| [`src/components/EditorPanel.jsx`](./src/components/EditorPanel.jsx) | CMS creator studio | Form state, checklist validation, confetti |
| [`src/data/initialEditions.js`](./src/data/initialEditions.js) | Seed data (Issues #069, #068, #067) | JavaScript objects & arrays |
| [`src/data/storage.js`](./src/data/storage.js) | Browser persistence | `localStorage` API |

---

## 🛠️ Commands Reference

```bash
# Install dependencies
npm install

# Start local live development server
npm run dev

# Build production bundle
npm run build
```
