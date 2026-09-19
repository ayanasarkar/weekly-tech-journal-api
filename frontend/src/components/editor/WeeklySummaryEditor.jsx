import React from 'react';
import { countWords } from '../../utils/helpers';

/**
 * WeeklySummaryEditor Component
 * Simple editor for 'THE WEEK, IN 150 WORDS' narrative with real-time word counter.
 */
export default function WeeklySummaryEditor({ weeklySummary, onChangeSummary }) {
  const wordCount = countWords(weeklySummary);

  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <h3>The Week, in 150 Words</h3>
        <span className="word-count-badge">
          {wordCount} words (Target: ~150 words)
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Write one connected narrative summarizing what happened across the 5 stories.
      </p>

      <div className="form-group">
        <textarea
          className="form-textarea"
          style={{ minHeight: '180px', fontSize: '1.05rem', lineHeight: '1.8' }}
          value={weeklySummary || ''}
          onChange={(e) => onChangeSummary(e.target.value)}
          placeholder="Write the weekly narrative connecting the week's biggest developments..."
        />
      </div>
    </div>
  );
}
