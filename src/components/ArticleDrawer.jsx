import React, { useState, useEffect } from 'react';
import { 
  X, Bookmark, Share2, Volume2, VolumeX, 
  ExternalLink, ChevronLeft, ChevronRight, Check, ListChecks 
} from 'lucide-react';
import { getCategoryStyle, countWords } from '../utils/helpers';

/**
 * ArticleDrawer Component
 * Slide-out reading panel displaying full story content, takeaways, audio narration, and sources.
 */
export default function ArticleDrawer({
  story,
  allStories,
  isOpen,
  onClose,
  onSelectStory,
  isBookmarked,
  onToggleBookmark,
  onShowToast
}) {
  const [fontSize, setFontSize] = useState('medium'); // 'small' | 'medium' | 'large'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Reset audio state when switching stories
  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, [story?.id]);

  // Handle ESC key to close drawer
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Audio player simulation timer
  useEffect(() => {
    let interval;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  if (!story) return null;

  const categoryStyle = getCategoryStyle(story.category);
  const currentIndex = allStories.findIndex((s) => s.id === story.id);
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;
  const nextStory = currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : null;

  const fontSizeMap = {
    small: '0.95rem',
    medium: '1.08rem',
    large: '1.25rem'
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Article link copied to clipboard!');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <aside
        className={`article-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Full Story Reader Panel"
      >
        {/* Drawer Header Toolbar */}
        <div className="drawer-header">
          <div className="drawer-controls-left">
            <button className="btn-icon" onClick={onClose} title="Close story (Esc)">
              <X size={20} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Story #{story.slot || currentIndex + 1} of {allStories.length}
            </span>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div
          className="drawer-body"
          style={{ '--article-font-size': fontSizeMap[fontSize] }}
        >
          {/* Cover Image */}
          {story.imageUrl && (
            <div className="drawer-hero-image-wrap">
              <img src={story.imageUrl} alt={story.title} />
              {story.imageCaption && (
                <div className="image-caption">{story.imageCaption}</div>
              )}
            </div>
          )}

          {/* Article Meta */}
          <div className="drawer-article-meta">
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
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {story.readTime || '5 min read'}
            </span>
          </div>

          {/* Headline & Subtitle */}
          <h1 className="drawer-article-title">{story.title}</h1>
          {story.subtitle && (
            <p className="drawer-article-subtitle" style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{story.subtitle}</p>
          )}

          {/* Simulated Audio Narration Bar */}
          <div className="audio-player-bar">
            <div className="audio-info">
              <button
                className="btn-audio-play"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                title={isPlayingAudio ? 'Pause Audio Summary' : 'Listen to Audio Summary'}
              >
                {isPlayingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isPlayingAudio ? 'Playing Audio Summary...' : 'Listen to this story'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  AI Voice Synthesis · 2:15
                </div>
              </div>
            </div>

            <div className="audio-progress-track">
              <div
                className="audio-progress-fill"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>

          {/* Main Article Prose Content */}
          <div className="article-prose">
            {story.content ? (
              story.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={pIdx}>{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={pIdx}>
                      {paragraph.replace(/^>\s*"?|"$/g, '')}
                    </blockquote>
                  );
                }
                return <p key={pIdx}>{paragraph}</p>;
              })
            ) : (
              <p>{story.subtitle}</p>
            )}
          </div>

          {/* Original Source Box */}
          {story.source && (
            <div className="source-box">
              <div className="source-details">
                <ExternalLink size={16} color="var(--accent-primary)" />
                <span>Source: <strong>{typeof story.source === 'object' ? story.source.name : story.source}</strong></span>
              </div>
            </div>
          )}

          {/* Bottom Story Navigation */}
          <div className="drawer-footer-nav">
            {prevStory ? (
              <button
                className="btn-icon"
                style={{ width: 'auto', padding: '0.5rem 1rem', gap: '0.5rem' }}
                onClick={() => onSelectStory(prevStory)}
              >
                <ChevronLeft size={16} />
                <span>Previous Story</span>
              </button>
            ) : <div />}

            {nextStory && (
              <button
                className="btn-icon"
                style={{ width: 'auto', padding: '0.5rem 1rem', gap: '0.5rem' }}
                onClick={() => onSelectStory(nextStory)}
              >
                <span>Next Story</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
