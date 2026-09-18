import React from 'react';
import { PenTool } from 'lucide-react';

/**
 * EditorsNote Component
 * "FROM THE EDITOR"
 * Displays the personal, opinionated observation from the editor with signature.
 */
export default function EditorsNote({ noteText, editor }) {
  const currentEditor = editor || {
    name: 'Alex Sterling',
    role: 'Editor-in-Chief',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <div className="editorial-block">
      <div>
        <div className="editorial-header-row">
          <div className="editorial-section-label">
            <PenTool size={16} />
            <span>From The Editor</span>
          </div>
        </div>

        <p className="editorial-text editor-note-style">
          "{noteText || 'A personal perspective on what this week’s technological inflection points mean for engineers and society.'}"
        </p>
      </div>

      <div className="editor-signature-row">
        {currentEditor.avatar && (
          <img
            src={currentEditor.avatar}
            alt={currentEditor.name}
            className="editor-avatar"
          />
        )}
        <div className="editor-details">
          <h4>{currentEditor.name}</h4>
          <p>{currentEditor.role}</p>
        </div>
      </div>
    </div>
  );
}
