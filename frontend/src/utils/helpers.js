// Utility helpers for Weekly Tech Journal

export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(text) {
  const words = countWords(text);
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
}

export const CATEGORY_THEMES = {
  'Artificial Intelligence': { bg: 'rgba(99, 102, 241, 0.12)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.25)' },
  'AI & Hardware': { bg: 'rgba(99, 102, 241, 0.12)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.25)' },
  'Semiconductors': { bg: 'rgba(236, 72, 153, 0.12)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.25)' },
  'Design & UX': { bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.25)' },
  'Open Source': { bg: 'rgba(16, 185, 129, 0.12)', text: '#34d399', border: 'rgba(16, 185, 129, 0.25)' },
  'Cloud & Infra': { bg: 'rgba(14, 165, 233, 0.12)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.25)' },
  'Security & Privacy': { bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)' },
  'Quantum Computing': { bg: 'rgba(6, 182, 212, 0.12)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.25)' },
  'Robotics': { bg: 'rgba(239, 68, 68, 0.12)', text: '#f87171', border: 'rgba(239, 68, 68, 0.25)' },
  'General Tech': { bg: 'rgba(148, 163, 184, 0.12)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.25)' },
};

export function getCategoryStyle(category) {
  return CATEGORY_THEMES[category] || { bg: 'rgba(148, 163, 184, 0.12)', text: 'var(--text-muted)', border: 'var(--border-subtle)' };
}
