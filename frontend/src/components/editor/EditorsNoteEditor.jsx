import React from 'react';

/**
 * EditorsNoteEditor Component
 * Editor for 'FROM THE EDITOR' human observation and editor profile.
 */
export default function EditorsNoteEditor({
  editorsNote,
  editor,
  onChangeNote,
  onChangeEditor
}) {
  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <h3>From The Editor</h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        A personal, opinionated perspective from the editor to close the issue.
      </p>

      <div className="form-group">
        <label className="form-label">Editor's Personal Note</label>
        <textarea
          className="form-textarea"
          style={{
            minHeight: '150px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.08rem'
          }}
          value={editorsNote || ''}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="A more human, opinionated observation about the week..."
        />
      </div>

      <div className="form-row" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <label className="form-label">Editor Name</label>
          <input
            type="text"
            className="form-input"
            value={editor?.name || ''}
            onChange={(e) => onChangeEditor('name', e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Editor Role / Title</label>
          <input
            type="text"
            className="form-input"
            value={editor?.role || ''}
            onChange={(e) => onChangeEditor('role', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
