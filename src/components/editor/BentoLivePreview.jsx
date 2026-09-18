import React from 'react';
import BentoGrid from '../BentoGrid';
import WeeklySummary from '../WeeklySummary';
import EditorsNote from '../EditorsNote';

/**
 * BentoLivePreview Component
 * Live visual preview of the reader-facing Bento Grid layout,
 * Weekly 150 words summary, Editor's note, and Bio within the Editor panel.
 */
export default function BentoLivePreview({
  edition,
  onSelectStoryToEdit
}) {
  const stories = edition?.stories || [];
  const weeklySummary = edition?.weeklySummary || '';
  const editorsNote = edition?.editorsNote || '';
  const editor = edition?.editor;

  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <h3>Live Bento Grid Preview</h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Click on any story card below to jump directly to its editor tab:
      </p>

      {/* Live Bento Grid (5 Cards) */}
      <BentoGrid
        key={JSON.stringify(stories)}
        stories={stories}
        onSelectStory={(story) => onSelectStoryToEdit(story.slot)}
      />

      {/* Editorial Narrative & From the Editor / Bio Preview */}
      <section
        className="editorial-section-container"
        style={{ marginTop: '2rem', marginBottom: '0.5rem' }}
        aria-label="Editorial Narrative and Notes Preview"
      >
        <WeeklySummary summaryText={weeklySummary} />
        <EditorsNote
          noteText={editorsNote}
          editor={editor}
        />
      </section>
    </div>
  );
}
