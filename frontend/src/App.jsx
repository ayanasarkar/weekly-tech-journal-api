import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import WeeklySummary from './components/WeeklySummary';
import EditorsNote from './components/EditorsNote';
import Footer from './components/Footer';
import ArticleDrawer from './components/ArticleDrawer';
import ArchiveModal from './components/ArchiveModal';
import EditorPanel from './components/EditorPanel';
import { 
  getStoredEditions, 
  saveEditions, 
  resetToDefaults, 
  createNewEdition, 
  getBookmarks, 
  toggleBookmarkStorage, 
  getSavedTheme, 
  saveTheme 
} from './data/storage';
import { formatDate } from './utils/helpers';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';

export default function App() {
  // Editions state & active edition
  const [editions, setEditions] = useState(getStoredEditions);
  const [activeEditionId, setActiveEditionId] = useState(() => {
    const list = getStoredEditions();
    return list[0]?.id || 'edition-069';
  });

  // UI States
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'editor'
  const [activeStory, setActiveStory] = useState(null); // Story opened in side panel
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [theme, setTheme] = useState(getSavedTheme);
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast notification helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3200);
  };

  // Draft state map: editionId -> draftEdition
  const [draftEditions, setDraftEditions] = useState({});

  // Find currently active published edition
  const activeEdition = editions.find((ed) => ed.id === activeEditionId) || editions[0] || {};
  // Find currently active working draft edition
  const activeDraftEdition = draftEditions[activeEdition.id] || activeEdition;

  // Handle draft updates (does NOT affect published activeEdition in Reader view)
  const handleUpdateDraft = (updatedDraft) => {
    setDraftEditions((prev) => ({
      ...prev,
      [updatedDraft.id]: updatedDraft
    }));
  };

  // Handle publishing an edition (updates published editions and persists to storage)
  const handlePublishEdition = (publishedEdition) => {
    const updatedList = editions.map((ed) => (ed.id === publishedEdition.id ? publishedEdition : ed));
    setEditions(updatedList);
    saveEditions(updatedList);
    setDraftEditions((prev) => ({
      ...prev,
      [publishedEdition.id]: publishedEdition
    }));
  };

  const handleCreateNewEdition = () => {
    const { newEdition, updatedEditions } = createNewEdition(editions);
    setEditions(updatedEditions);
    setDraftEditions((prev) => ({
      ...prev,
      [newEdition.id]: newEdition
    }));
    setActiveEditionId(newEdition.id);
    setViewMode('editor');
    showToast(`Created Edition #${newEdition.number} Draft!`);
  };

  const handleResetDefaults = () => {
    const defaultList = resetToDefaults();
    setEditions(defaultList);
    setDraftEditions({});
    setActiveEditionId(defaultList[0]?.id || 'edition-069');
    showToast('Reset to original sample editions.');
  };

  // Bookmark toggle handler
  const handleToggleBookmark = (storyId) => {
    const updated = toggleBookmarkStorage(storyId);
    setBookmarks(updated);
    showToast(updated.includes(storyId) ? 'Bookmark saved.' : 'Bookmark removed.');
  };

  // Find story across editions if selected from bookmark
  const handleSelectStoryById = (storyId) => {
    for (const ed of editions) {
      const found = ed.stories?.find((s) => s.id === storyId);
      if (found) {
        setActiveEditionId(ed.id);
        setActiveStory(found);
        return;
      }
    }
  };

  return (
    <div className="app-container" id="top">
      {/* Global Header */}
      <Header
        activeEdition={activeEdition}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenArchive={() => setIsArchiveOpen(true)}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsArchiveOpen(true)}
      />

      <main className="main-content">
        {viewMode === 'reader' ? (
          /* =================================================================
             READER VIEW: Masthead, Bento Grid, Weekly Summary, Editor's Note
             (Displays ONLY published edition data)
             ================================================================= */
          <>
            {/* Masthead Header Section */}
            <section className="masthead-section">
              <div className="masthead-meta-bar">
                <div>
                  THE WEEK IN TECH · <span className="masthead-number-tag">#{activeEdition.number}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={13} />
                  <span>{formatDate(activeEdition.publishDate)}</span>
                </div>
              </div>

              <h1 className="masthead-title">
                {activeEdition.title || 'Weekly Tech Journal'}
              </h1>
              <p className="masthead-tagline">
                {activeEdition.tagline || 'Five stories worth your attention.'}
              </p>
            </section>

            {/* Top 5 Bento Grid */}
            <BentoGrid
              stories={activeEdition.stories}
              onSelectStory={(story) => setActiveStory(story)}
            />

            {/* Editorial Narrative & From the Editor */}
            <section className="editorial-section-container" aria-label="Editorial Narrative and Notes">
              <WeeklySummary summaryText={activeEdition.weeklySummary} />
              <EditorsNote
                noteText={activeEdition.editorsNote}
                editor={activeEdition.editor}
              />
            </section>
          </>
        ) : (
          /* =================================================================
             EDITOR PANEL: CMS Studio (Modifies DRAFT until published)
             ================================================================= */
          <EditorPanel
            editions={editions}
            activeEdition={activeEdition}
            draftEdition={activeDraftEdition}
            onUpdateDraftEdition={handleUpdateDraft}
            onPublishEdition={handlePublishEdition}
            onCreateEdition={handleCreateNewEdition}
            onResetDefaults={handleResetDefaults}
            onShowToast={showToast}
            onSwitchToReader={() => setViewMode('reader')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onShowToast={showToast}
        onOpenArchive={() => setIsArchiveOpen(true)}
      />

      {/* Side-Panel Article Reader Drawer */}
      <ArticleDrawer
        story={activeStory}
        allStories={activeEdition.stories || []}
        isOpen={Boolean(activeStory)}
        onClose={() => setActiveStory(null)}
        onSelectStory={(story) => setActiveStory(story)}
        isBookmarked={activeStory ? bookmarks.includes(activeStory.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onShowToast={showToast}
      />

      {/* Archive Modal Drawer */}
      <ArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        editions={editions}
        activeEditionId={activeEditionId}
        onSelectEdition={(id) => setActiveEditionId(id)}
        onCreateNewEdition={handleCreateNewEdition}
        bookmarks={bookmarks}
        onSelectStoryById={handleSelectStoryById}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
