import React, { useState } from 'react';
import { X, Search, Calendar, ChevronRight, PlusCircle, Bookmark, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';

/**
 * ArchiveModal Component
 * Search and browse previous weekly editions (#069, #068, #067, etc.) and view bookmarks.
 */
export default function ArchiveModal({
  isOpen,
  onClose,
  editions,
  activeEditionId,
  onSelectEdition,
  onCreateNewEdition,
  bookmarks,
  onSelectStoryById
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('editions'); // 'editions' | 'bookmarks'

  if (!isOpen) return null;

  // Filter editions
  const filteredEditions = editions.filter((ed) => {
    const q = searchQuery.toLowerCase();
    const matchesEdition = ed.title?.toLowerCase().includes(q) || ed.number?.includes(q);
    const matchesStories = ed.stories?.some((s) => s.title?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
    return matchesEdition || matchesStories;
  });

  // Find all bookmarked stories across all editions
  const bookmarkedStories = [];
  editions.forEach((ed) => {
    ed.stories?.forEach((s) => {
      if (bookmarks.includes(s.id)) {
        bookmarkedStories.push({ ...s, editionNumber: ed.number });
      }
    });
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3>Weekly Archive</h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                className={`font-btn ${activeTab === 'editions' ? 'active' : ''}`}
                onClick={() => setActiveTab('editions')}
              >
                All Editions ({editions.length})
              </button>
              <button
                className={`font-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookmarks')}
              >
                Bookmarks ({bookmarks.length})
              </button>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Search Box */}
          <div className="archive-search-box">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={activeTab === 'editions' ? 'Search by edition, topic, or keyword...' : 'Search bookmarks...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {activeTab === 'editions' ? (
            <>
              {/* List of Editions */}
              <div className="archive-list">
                {filteredEditions.map((edition) => {
                  const isActive = edition.id === activeEditionId;
                  return (
                    <div
                      key={edition.id}
                      className={`archive-item-card ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        onSelectEdition(edition.id);
                        onClose();
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                          <span className="masthead-number-tag" style={{ fontSize: '0.85rem' }}>
                            #{edition.number}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={12} />
                            {formatDate(edition.publishDate)}
                          </span>
                          {edition.status === 'published' ? (
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={12} /> Published
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>
                              Draft
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {edition.title}
                        </h4>

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {edition.stories?.length || 0} stories · Lead: "{edition.stories?.[0]?.title?.slice(0, 45)}..."
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                        {isActive ? <strong>Active</strong> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  );
                })}

                {filteredEditions.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No editions matched your search.
                  </div>
                )}
              </div>

              {/* Create Edition Shortcut */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    onCreateNewEdition();
                    onClose();
                  }}
                >
                  <PlusCircle size={18} />
                  <span>Create New Edition (Editor Panel)</span>
                </button>
              </div>
            </>
          ) : (
            /* Bookmarked stories list */
            <div className="archive-list">
              {bookmarkedStories.map((story) => (
                <div
                  key={story.id}
                  className="archive-item-card"
                  onClick={() => {
                    onSelectStoryById(story.id);
                    onClose();
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="masthead-number-tag" style={{ fontSize: '0.75rem' }}>
                        Issue #{story.editionNumber}
                      </span>
                      <span className="category-tag" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        {story.category}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600 }}>{story.title}</h4>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              ))}

              {bookmarkedStories.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <Bookmark size={28} style={{ opacity: 0.4, margin: '0 auto 0.5rem' }} />
                  <p>You haven't bookmarked any stories yet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click the bookmark icon while reading any article to save it here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
