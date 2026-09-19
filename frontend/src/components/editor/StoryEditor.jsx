import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence',
  'AI & Hardware',
  'Semiconductors',
  'Design & UX',
  'Open Source',
  'Cloud & Infra',
  'Security & Privacy',
  'Quantum Computing',
  'Robotics',
  'General Tech'
];

const PRESET_IMAGES = [
  { label: 'Neural AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Chip Silicon', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
  { label: 'Edge Hardware', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Spatial Canvas', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Quantum Optics', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Decentralized Grid', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
];

/**
 * StoryEditor Component
 * Allows writing headlines, summaries, takeaways, full articles, and sources for each of the 5 Bento stories.
 */
export default function StoryEditor({
  stories,
  selectedSlot,
  onSelectSlot,
  onUpdateStory,
  onSwapSlots
}) {
  const currentStory = stories.find((s) => s.slot === selectedSlot) || stories[0] || {};

  // Simple handler to update any field on the currently active story
  const updateField = (field, value) => {
    onUpdateStory(selectedSlot, { [field]: value });
  };

  // Takeaway points handlers
  const handleAddTakeaway = () => {
    const list = currentStory.takeaways || [];
    updateField('takeaways', [...list, 'New key takeaway point']);
  };

  const handleUpdateTakeaway = (index, value) => {
    const list = [...(currentStory.takeaways || [])];
    list[index] = value;
    updateField('takeaways', list);
  };

  const handleDeleteTakeaway = (index) => {
    const list = [...(currentStory.takeaways || [])];
    list.splice(index, 1);
    updateField('takeaways', list);
  };

  return (
    <div className="editor-card">
      {/* 1. Top 5 Story Tabs & Reorder Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[1, 2, 3, 4, 5].map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                className={`font-btn ${isSelected ? 'active' : ''}`}
                style={{ padding: '0.45rem 0.85rem' }}
                onClick={() => onSelectSlot(slot)}
              >
                {slot === 1 ? '👑 #1 Lead Story' : `#${slot} Story`}
              </button>
            );
          })}
        </div>

        {/* Reorder Bento Slot Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Swap Position:</span>
          <button
            className="btn-icon"
            style={{ width: '30px', height: '30px' }}
            disabled={selectedSlot <= 1}
            onClick={() => onSwapSlots('up')}
            title="Move story up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            className="btn-icon"
            style={{ width: '30px', height: '30px' }}
            disabled={selectedSlot >= 5}
            onClick={() => onSwapSlots('down')}
            title="Move story down"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>

      {/* 2. Story Headline & Summary */}
      <div className="form-group">
        <label className="form-label">Story Headline (Title)</label>
        <input
          type="text"
          className="form-input"
          value={currentStory.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter punchy story headline..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Subtitle / Excerpt Summary</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: '65px' }}
          value={currentStory.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Brief summary explaining the development and significance..."
        />
      </div>

      {/* 3. Category & Read Time */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={currentStory.category || 'Artificial Intelligence'}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Read Time</label>
          <input
            type="text"
            className="form-input"
            value={currentStory.readTime || '5 min read'}
            onChange={(e) => updateField('readTime', e.target.value)}
          />
        </div>
      </div>

      {/* 4. Cover Image & Presets */}
      <div className="form-group">
        <label className="form-label">Cover Image URL</label>
        <input
          type="text"
          className="form-input"
          value={currentStory.imageUrl || ''}
          onChange={(e) => updateField('imageUrl', e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Quick preset images:
        </div>
        <div className="image-preset-grid">
          {PRESET_IMAGES.map((preset, idx) => (
            <div
              key={idx}
              className={`preset-thumb ${currentStory.imageUrl === preset.url ? 'selected' : ''}`}
              onClick={() => updateField('imageUrl', preset.url)}
              title={preset.label}
            >
              <img src={preset.url} alt={preset.label} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Key Takeaways */}
      <div className="form-group" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Key Takeaways</label>
          <button
            type="button"
            className="btn-icon"
            style={{ width: 'auto', padding: '0.2rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
            onClick={handleAddTakeaway}
          >
            <Plus size={14} /> Add Takeaway Point
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(currentStory.takeaways || []).map((point, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                value={point}
                onChange={(e) => handleUpdateTakeaway(index, e.target.value)}
                placeholder={`Takeaway point #${index + 1}`}
              />
              <button
                type="button"
                className="btn-icon"
                style={{ color: 'var(--accent-rose)', flexShrink: 0 }}
                onClick={() => handleDeleteTakeaway(index)}
                title="Remove bullet point"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Full Article Content (Markdown) */}
      <div className="form-group" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <label className="form-label">Full Article Content (Markdown)</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}
          value={currentStory.content || ''}
          onChange={(e) => updateField('content', e.target.value)}
          placeholder="Write full article content. Use ### for subheadings and > for pull quotes..."
        />
      </div>

      {/* 7. Author & Source Information */}
      <div className="form-row" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <label className="form-label">Author Name</label>
          <input
            type="text"
            className="form-input"
            value={currentStory.author?.name || ''}
            onChange={(e) =>
              updateField('author', { ...currentStory.author, name: e.target.value })
            }
          />
        </div>
        <div>
          <label className="form-label">Author Role</label>
          <input
            type="text"
            className="form-input"
            value={currentStory.author?.role || ''}
            onChange={(e) =>
              updateField('author', { ...currentStory.author, role: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-row" style={{ marginTop: '0.75rem' }}>
        <div>
          <label className="form-label">Source Name</label>
          <input
            type="text"
            className="form-input"
            value={currentStory.source?.name || ''}
            onChange={(e) =>
              updateField('source', { ...currentStory.source, name: e.target.value })
            }
            placeholder="e.g. arXiv / Nature"
          />
        </div>
        <div>
          <label className="form-label">Source URL</label>
          <input
            type="text"
            className="form-input"
            value={currentStory.source?.url || ''}
            onChange={(e) =>
              updateField('source', { ...currentStory.source, url: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}
