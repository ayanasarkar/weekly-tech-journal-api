import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import WeeklySummary from './components/WeeklySummary';
import EditorsNote from './components/EditorsNote';
import Footer from './components/Footer';
import ArticleDrawer from './components/ArticleDrawer';
import ArchiveModal from './components/ArchiveModal';
import EditorPanel from './components/EditorPanel';
import * as api from './data/api';
import {
  adaptBackendEditionToFrontend,
  adaptFrontendEditionToBackend,
  adaptStoryToBackendArticle,
  adaptBackendArticleToStory
} from './data/adapters';
import {
  getBookmarks,
  toggleBookmarkStorage,
  getSavedTheme,
  saveTheme,
  INITIAL_EDITIONS
} from './data/storage';
import { formatDate } from './utils/helpers';
import { Sparkles, Calendar, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Editions state & active edition
  const [editions, setEditions] = useState([]);
  const [activeEditionId, setActiveEditionId] = useState(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // UI States
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'editor'
  const [activeStory, setActiveStory] = useState(null); // Story opened in side panel
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [theme, setTheme] = useState(getSavedTheme);
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [toastMessage, setToastMessage] = useState(null);

  // Draft state map: editionId -> draftEdition
  const [draftEditions, setDraftEditions] = useState({});

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

  // =========================================================================
  // API INTEGRATION: FETCH EDITIONS & PREVIEW
  // =========================================================================

  const loadAllEditions = useCallback(async (targetId = null) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Fetch all editions from GET /api/editions
      const backendEditions = await api.getEditions();

      if (!Array.isArray(backendEditions) || backendEditions.length === 0) {
        setEditions([]);
        setActiveEditionId(null);
        setIsLoading(false);
        return;
      }

      // Pick target ID or currently active ID or first edition
      const selectedId = targetId || activeEditionId || backendEditions[0].id;
      const targetBackendEd = backendEditions.find((e) => e.id === selectedId) || backendEditions[0];

      // 2. Fetch full preview/articles for the active edition from GET /api/editions/:id/preview
      let previewData;
      try {
        previewData = await api.getEditionPreview(targetBackendEd.id);
      } catch (err) {
        console.warn('Preview endpoint failed, fetching articles directly:', err);
        const articles = await api.getArticles(targetBackendEd.id).catch(() => []);
        previewData = { ...targetBackendEd, articles };
      }

      const activeAdapted = adaptBackendEditionToFrontend(
        previewData,
        previewData.articles || [],
        1
      );

      // Adapt the rest of the editions for archive / switcher listing
      const adaptedList = backendEditions.map((ed, idx) => {
        if (ed.id === activeAdapted.id) return activeAdapted;
        return adaptBackendEditionToFrontend(ed, [], idx + 1);
      });

      setEditions(adaptedList);
      setActiveEditionId(activeAdapted.id);
      setDraftEditions((prev) => ({
        ...prev,
        [activeAdapted.id]: activeAdapted
      }));
    } catch (err) {
      console.error('Failed to load editions from backend API:', err);
      setApiError(err.message || 'Failed to connect to the backend API.');
    } finally {
      setIsLoading(false);
    }
  }, [activeEditionId]);

  // Initial load on mount
  useEffect(() => {
    loadAllEditions();
  }, []);

  // Handle switching active edition
  const handleSelectEdition = async (id) => {
    setActiveEditionId(id);
    setIsLoading(true);
    try {
      const previewData = await api.getEditionPreview(id);
      const adapted = adaptBackendEditionToFrontend(previewData, previewData.articles || []);

      setEditions((prev) => prev.map((e) => (e.id === id ? adapted : e)));
      setDraftEditions((prev) => ({
        ...prev,
        [id]: adapted
      }));
    } catch (err) {
      console.error('Failed to load edition preview:', err);
      showToast(`Error loading edition: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Find currently active edition
  const activeEdition =
    editions.find((ed) => ed.id === activeEditionId) || editions[0] || {};
  // Find currently active working draft edition
  const activeDraftEdition = draftEditions[activeEdition.id] || activeEdition;

  // Handle draft updates in memory
  const handleUpdateDraft = (updatedDraft) => {
    setDraftEditions((prev) => ({
      ...prev,
      [updatedDraft.id]: updatedDraft
    }));
  };

  // =========================================================================
  // API INTEGRATION: SAVE DRAFT, PUBLISH, CREATE, DELETE
  // =========================================================================

  // Save draft metadata and article changes to backend API
  const handleSaveDraft = async (draft) => {
    if (!draft?.id) return;
    setIsSaving(true);
    try {
      // 1. Update edition metadata via PATCH /api/editions/:id
      const backendPayload = adaptFrontendEditionToBackend(draft);
      const updatedBackendEdition = await api.updateEdition(draft.id, backendPayload);

      // 2. Sync articles via POST or PATCH /api/editions/:id/articles/:articleId
      const updatedStories = [...(draft.stories || [])];
      for (let i = 0; i < updatedStories.length; i++) {
        const story = updatedStories[i];
        const articlePayload = adaptStoryToBackendArticle(story);

        if (story.id && !story.id.startsWith('placeholder_')) {
          // Update existing article
          const updatedArticle = await api.updateArticle(draft.id, story.id, articlePayload);
          updatedStories[i] = adaptBackendArticleToStory(updatedArticle, story.slot || i + 1);
        } else if (story.title && story.title.trim().length > 0) {
          // Create new article
          const createdArticle = await api.createArticle(draft.id, articlePayload);
          updatedStories[i] = adaptBackendArticleToStory(createdArticle, story.slot || i + 1);
        }
      }

      const refreshedEdition = adaptBackendEditionToFrontend(
        updatedBackendEdition,
        updatedStories.map((s) => ({
          id: s.id,
          editionId: draft.id,
          headline: s.title,
          summary: s.subtitle,
          content: s.content,
          keyTakeaways: s.takeaways,
          sources: [s.source],
          author: s.author
        }))
      );

      // Update in state
      setEditions((prev) => prev.map((ed) => (ed.id === draft.id ? refreshedEdition : ed)));
      setDraftEditions((prev) => ({ ...prev, [draft.id]: refreshedEdition }));
      showToast('Draft changes saved to backend API!');
      return refreshedEdition;
    } catch (err) {
      console.error('Failed to save draft:', err);
      showToast(`Save failed: ${err.message}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Publish edition via PATCH /api/editions/:id/publish
  const handlePublishEdition = async (draft, action = 'publish', scheduledFor = null) => {
    if (!draft?.id) return;
    setIsPublishing(true);
    try {
      // First save draft content
      const savedEdition = await handleSaveDraft(draft);

      // Call publish API endpoint
      const publishedBackend = await api.publishEdition(draft.id, action, scheduledFor);

      const fullyPublished = {
        ...savedEdition,
        status: publishedBackend.status,
        publishedAt: publishedBackend.publishedAt,
        scheduledFor: publishedBackend.scheduledFor
      };

      setEditions((prev) => prev.map((ed) => (ed.id === draft.id ? fullyPublished : ed)));
      setDraftEditions((prev) => ({ ...prev, [draft.id]: fullyPublished }));

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`🚀 Edition #${fullyPublished.number} is now ${fullyPublished.status.toUpperCase()}!`);
    } catch (err) {
      console.error('Failed to publish edition:', err);
      showToast(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Create a new draft edition via POST /api/editions
  const handleCreateNewEdition = async () => {
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextNum = editions.length + 1;
      const createdBackendEdition = await api.createEdition({
        title: `Weekly Tech Journal — Issue #${nextNum}`,
        weekOf: today,
        description: 'Five stories worth your attention.'
      });

      // Also create an initial lead article on backend
      let initialArticles = [];
      try {
        const leadArticle = await api.createArticle(createdBackendEdition.id, {
          headline: 'Lead Breakthrough Headline',
          summary: 'Comprehensive subtitle explaining why this development leads this week’s edition.',
          content: 'Start writing the complete lead article for story #1 here...',
          keyTakeaways: ['Key foundational insight one.', 'Key architectural shift.'],
          sources: [{ label: 'Tech Frontier Press', url: 'https://news.ycombinator.com' }],
          author: { name: 'Alex Sterling', role: 'Editor-in-Chief' }
        });
        initialArticles = [leadArticle];
      } catch (e) {
        console.warn('Could not create initial article on backend:', e);
      }

      const adaptedNew = adaptBackendEditionToFrontend(createdBackendEdition, initialArticles, nextNum);

      setEditions((prev) => [adaptedNew, ...prev]);
      setDraftEditions((prev) => ({ ...prev, [adaptedNew.id]: adaptedNew }));
      setActiveEditionId(adaptedNew.id);
      setViewMode('editor');
      showToast(`Created Edition #${adaptedNew.number} Draft on backend!`);
    } catch (err) {
      console.error('Failed to create edition:', err);
      showToast(`Failed to create edition: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete an edition via DELETE /api/editions/:id
  const handleDeleteEdition = async (editionId) => {
    if (!window.confirm('Are you sure you want to delete this edition from the backend?')) return;
    setIsSaving(true);
    try {
      await api.deleteEdition(editionId);
      const remaining = editions.filter((e) => e.id !== editionId);
      setEditions(remaining);
      const nextActive = remaining[0]?.id || null;
      setActiveEditionId(nextActive);
      if (nextActive) {
        handleSelectEdition(nextActive);
      }
      showToast('Edition deleted from backend.');
    } catch (err) {
      console.error('Failed to delete edition:', err);
      showToast(`Delete failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Bookmark toggle handler (Stored client-side)
  const handleToggleBookmark = (storyId) => {
    const updated = toggleBookmarkStorage(storyId);
    setBookmarks(updated);
    showToast(updated.includes(storyId) ? 'Bookmark saved.' : 'Bookmark removed.');
  };

  // Find story across editions if selected from bookmark
  const handleSelectStoryById = async (storyId) => {
    for (const ed of editions) {
      const found = ed.stories?.find((s) => s.id === storyId);
      if (found) {
        if (ed.id !== activeEditionId) {
          await handleSelectEdition(ed.id);
        }
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
        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" />
            <span style={{ fontSize: '0.9rem' }}>Connecting to Backend API...</span>
          </div>
        )}

        {/* API Error Banner with Retry */}
        {!isLoading && apiError && (
          <div className="editor-card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '2rem' }}>
            <AlertCircle size={36} color="var(--accent-rose)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>API Connection Notice</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {apiError}
            </p>
            <button
              className="btn-primary"
              style={{ margin: '0 auto', justifyContent: 'center' }}
              onClick={() => loadAllEditions()}
            >
              <RefreshCw size={16} />
              <span>Retry API Connection</span>
            </button>
          </div>
        )}

        {/* Normal Content when Loaded */}
        {!isLoading && !apiError && (
          <>
            {viewMode === 'reader' ? (
              /* =================================================================
                 READER VIEW: Masthead, Bento Grid, Weekly Summary, Editor's Note
                 (Displays API-backed edition and story data)
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
                 EDITOR PANEL: CMS Studio connected to Backend API
                 ================================================================= */
              <EditorPanel
                editions={editions}
                activeEdition={activeEdition}
                draftEdition={activeDraftEdition}
                onUpdateDraftEdition={handleUpdateDraft}
                onPublishEdition={handlePublishEdition}
                onSaveDraft={handleSaveDraft}
                onCreateEdition={handleCreateNewEdition}
                onDeleteEdition={handleDeleteEdition}
                onSelectEdition={handleSelectEdition}
                onShowToast={showToast}
                onSwitchToReader={() => setViewMode('reader')}
                isSaving={isSaving}
                isPublishing={isPublishing}
              />
            )}
          </>
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
        onSelectEdition={handleSelectEdition}
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
