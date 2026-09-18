import React from 'react';
import { BookOpen, Edit3, Sun, Moon, Archive, Sparkles, Bookmark } from 'lucide-react';

/**
 * Header Component
 * Contains the site brand, edition selector pill, archive button, theme toggle, and Reader/Editor mode switch.
 */
export default function Header({
  activeEdition,
  viewMode,
  setViewMode,
  theme,
  toggleTheme,
  onOpenArchive,
  bookmarkCount,
  onOpenBookmarks
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Brand & Edition Pill */}
        <div className="header-left">
          <div className="brand-badge">
            <div className="brand-logo-icon">
              <BookOpen size={15} color="#ffffff" />
            </div>
            <span>Weekly Tech Journal</span>
          </div>

          <button
            className="header-edition-pill"
            onClick={onOpenArchive}
            title="Browse all weekly editions"
          >
            <Sparkles size={12} />
            <span>#{activeEdition.number}</span>
          </button>
        </div>

        {/* Right: Actions (Archive, Bookmarks, Theme, View Mode) */}
        <div className="header-actions">
          <button
            className="btn-icon"
            onClick={onOpenArchive}
            title="Open Weekly Archive"
          >
            <Archive size={18} />
          </button>

          {bookmarkCount > 0 && (
            <button
              className="btn-icon"
              onClick={onOpenBookmarks}
              title={`${bookmarkCount} Bookmarked Stories`}
            >
              <Bookmark size={18} />
              <span className="badge-count">{bookmarkCount}</span>
            </button>
          )}

          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Paper Mode' : 'Switch to Obsidian Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Switcher: Reader vs Editor */}
          <button
            className={`btn-mode-toggle ${viewMode === 'editor' ? 'active-editor' : ''}`}
            onClick={() => setViewMode(viewMode === 'reader' ? 'editor' : 'reader')}
          >
            {viewMode === 'reader' ? (
              <>
                <Edit3 size={16} />
                <span className="btn-label">Editor Panel</span>
              </>
            ) : (
              <>
                <BookOpen size={16} />
                <span className="btn-label">Reader View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
