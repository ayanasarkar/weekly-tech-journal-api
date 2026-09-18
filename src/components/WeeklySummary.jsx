import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { countWords } from '../utils/helpers';

/**
 * WeeklySummary Component
 * "THE WEEK, IN 150 WORDS"
 * Presents a single connected narrative connecting the week's 5 stories.
 */
export default function WeeklySummary({ summaryText }) {
  const wordCount = countWords(summaryText);

  return (
    <div className="editorial-block">
      <div>
        <div className="editorial-header-row">
          <div className="editorial-section-label">
            <Compass size={16} />
            <span>The Week, in 150 Words</span>
          </div>
          <span className="word-count-badge">
            {wordCount} words
          </span>
        </div>

        <p className="editorial-text">
          {summaryText || 'A connected narrative of the week’s most pivotal advancements in software, hardware, and artificial intelligence.'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
        <Sparkles size={13} color="var(--accent-primary)" />
        <span>Curated & synthesized weekly</span>
      </div>
    </div>
  );
}
