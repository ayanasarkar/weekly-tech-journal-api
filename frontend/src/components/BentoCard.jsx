import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { getCategoryStyle } from '../utils/helpers';

/**
 * BentoCard Component
 * Displays a story in the visual Bento Grid with responsive slot positioning.
 */
export default function BentoCard({ story, slotNumber, onSelectStory }) {
  if (!story) return null;

  const categoryStyle = getCategoryStyle(story.category);
  const slotClass = `bento-slot-${slotNumber}`;

  return (
    <article
      className={`bento-card ${slotClass}`}
      onClick={() => onSelectStory(story)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectStory(story);
        }
      }}
    >
      {/* Background Image & Gradient Overlay */}
      {story.imageUrl && (
        <div className="bento-card-bg">
          <img src={story.imageUrl} alt={story.title} loading="lazy" />
        </div>
      )}
      <div className="bento-card-overlay" />

      {/* Card Content */}
      <div className="bento-card-content">
        {/* Header Metadata */}
        <div className="card-header-meta">
          <span
            className="category-tag"
            style={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
              border: `1px solid ${categoryStyle.border}`
            }}
          >
            {story.category || 'Tech'}
          </span>
          <span className="slot-number-badge">#{slotNumber}</span>
        </div>

        {/* Titles & Excerpt */}
        <div>
          <h2 className="story-title">{story.title}</h2>
          {story.subtitle && slotNumber === 1 && (
            <p className="story-subtitle">{story.subtitle}</p>
          )}
          {story.subtitle && slotNumber === 4 && (
            <p className="story-subtitle">{story.subtitle}</p>
          )}

          {/* Footer Metadata */}
          <div className="card-footer-meta">
            <div className="author-chip">
              {story.author?.avatar && (
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  className="author-avatar-sm"
                />
              )}
              <span>{story.author?.name || 'Staff Writer'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="read-time-tag">
                <Clock size={12} />
                {story.readTime || '4 min'}
              </span>
              <div className="card-cta-arrow">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
