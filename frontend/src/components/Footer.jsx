import React from 'react';

/**
 * Footer Component
 * Highlights "See you next Friday" and the five most important tech updates sent via email every Friday morning.
 */
export default function Footer({ onOpenArchive }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* "See you next Friday" Highlight Banner */}
        <div className="footer-next-banner">
          <div className="next-banner-text">
            <h3>See you next Friday</h3>
            <p>The five most important technology updates synthesized and sent via email every Friday morning.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-badge-bg)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-primary)'
              }}
            >
              <span>📬 5 Key Updates</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>Every Friday Morning</span>
            </div>
          </div>
        </div>

        {/* Footer Meta & Quick Archive */}
        <div className="footer-bottom-grid">
          <div>
            <strong>Weekly Tech Journal</strong> · Curated technology editorial
          </div>

          <div className="footer-links">
            <button className="footer-link" onClick={onOpenArchive}>
              Browse Archive
            </button>
            <span style={{ opacity: 0.3 }}>•</span>
            <a href="#top" className="footer-link">
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
