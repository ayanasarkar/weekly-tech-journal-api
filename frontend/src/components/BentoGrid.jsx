import React from 'react';
import BentoCard from './BentoCard';

/**
 * BentoGrid Component
 * Renders the top 5 stories in a 3-column visual Bento Layout:
 * [ BIG STORY #1 ] [ #2 ]
 * [ BIG STORY #1 ] [ #3 ]
 * [ #4 ] [ #4 ]    [ #5 ]
 */
export default function BentoGrid({ stories, onSelectStory }) {
  if (!stories || stories.length === 0) {
    return <div className="empty-state">No stories available for this edition.</div>;
  }

  // Ensure stories are sorted by slot 1 to 5
  const sortedStories = [...stories].sort((a, b) => (a.slot || 0) - (b.slot || 0));

  return (
    <section className="bento-grid" aria-label="Top 5 Tech Stories Bento Grid">
      {sortedStories.map((story, index) => {
        const slotNumber = story.slot || index + 1;
        return (
          <BentoCard
            key={story.id || index}
            story={story}
            slotNumber={slotNumber}
            onSelectStory={onSelectStory}
          />
        );
      })}
    </section>
  );
}
