import React from 'react';
import { Sparkles, Calendar, Send, PlusCircle, Save, Trash2, Loader2 } from 'lucide-react';

/**
 * EditionManager Component
 * Allows the editor to create, edit, schedule, save, and publish weekly edition metadata.
 */
export default function EditionManager({
  edition,
  editions,
  onSelectEdition,
  onUpdateField,
  onCreateNewEdition,
  onPublish,
  onSaveDraft,
  onDeleteEdition,
  isReadyToPublish,
  isSaving,
  isPublishing
}) {
  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <h3>
          <Sparkles size={18} color="var(--accent-primary)" />
          <span>Edition Manager</span>
        </h3>
        {/* Status Badge: Draft, Scheduled, Published */}
        <span
          className="masthead-number-tag"
          style={{
            background:
              edition.status === 'published'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color:
              edition.status === 'published'
                ? 'var(--accent-emerald)'
                : 'var(--accent-amber)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem'
          }}
        >
          {edition.status ? edition.status.toUpperCase() : 'DRAFT'}
        </span>
      </div>

      {/* Edition Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <label className="form-label">Edition Title</label>
          <input
            type="text"
            className="form-input"
            value={edition.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="e.g. Weekly Tech Journal — Issue #1"
          />
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Active Edition</label>
            <select
              className="form-select font-mono"
              value={edition.id || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__new__') {
                  if (onCreateNewEdition) onCreateNewEdition();
                } else if (onSelectEdition) {
                  onSelectEdition(val);
                }
              }}
            >
              {(editions || []).map((ed) => (
                <option key={ed.id} value={ed.id}>
                  #{ed.number} — {ed.title?.slice(0, 22)}...
                </option>
              ))}
              <option value="__new__">+ New Draft</option>
            </select>
          </div>

          <div>
            <label className="form-label">Publish Date / Week Of</label>
            <input
              type="date"
              className="form-input"
              value={edition.publishDate || ''}
              onChange={(e) => onUpdateField('publishDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Edition Status</label>
          <select
            className="form-select"
            value={edition.status || 'draft'}
            onChange={(e) => onUpdateField('status', e.target.value)}
          >
            <option value="draft">Draft (In Progress)</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published (Live)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Publish / Re-publish */}
        <button
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            backgroundColor: isReadyToPublish ? 'var(--accent-emerald)' : 'var(--accent-primary)',
            opacity: isPublishing || isSaving ? 0.7 : 1
          }}
          disabled={isPublishing || isSaving}
          onClick={onPublish}
        >
          {isPublishing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Publishing to API...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>{edition.status === 'published' ? 'Save & Re-Publish' : 'Publish Edition'}</span>
            </>
          )}
        </button>

        {/* Save Draft to Backend */}
        {onSaveDraft && (
          <button
            className="btn-icon"
            style={{ width: '100%', fontSize: '0.82rem', gap: '0.4rem', justifyContent: 'center' }}
            disabled={isSaving || isPublishing}
            onClick={onSaveDraft}
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving to API...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes to Backend</span>
              </>
            )}
          </button>
        )}

        {/* Create New Edition */}
        <button
          className="btn-icon"
          style={{ width: '100%', fontSize: '0.8rem', gap: '0.4rem', justifyContent: 'center' }}
          disabled={isSaving || isPublishing}
          onClick={onCreateNewEdition}
        >
          <PlusCircle size={15} />
          <span>+ Create New Edition</span>
        </button>

        {/* Delete Draft Edition (only if draft) */}
        {edition.status === 'draft' && onDeleteEdition && (
          <button
            className="btn-icon"
            style={{
              width: '100%',
              fontSize: '0.78rem',
              gap: '0.4rem',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}
            disabled={isSaving || isPublishing}
            onClick={() => onDeleteEdition(edition.id)}
          >
            <Trash2 size={14} />
            <span>Delete Draft Edition</span>
          </button>
        )}
      </div>
    </div>
  );
}
