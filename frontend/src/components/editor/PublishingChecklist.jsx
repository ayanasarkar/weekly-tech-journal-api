import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * PublishingChecklist Component
 * Shows real-time checklist of missing/completed content before publishing the edition.
 */
export default function PublishingChecklist({ checklist, isReadyToPublish }) {
  const completedCount = checklist.filter((item) => item.done).length;
  const percentage = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <h3>Publishing Checklist</h3>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: isReadyToPublish ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            fontWeight: 700
          }}
        >
          {completedCount}/{checklist.length} Ready ({percentage}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="checklist-progress-bar">
        <div
          className="checklist-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="checklist-list">
        {checklist.map((item, index) => (
          <div key={index} className="checklist-item">
            <div className={`checklist-icon ${item.done ? 'done' : 'pending'}`}>
              {item.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </div>
            <span style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
