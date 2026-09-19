// Client-side storage manager for preferences (Theme, Bookmarks)

import { INITIAL_EDITIONS } from './initialEditions';

const BOOKMARKS_KEY = 'wtj_bookmarks_v1';
const THEME_KEY = 'wtj_theme_v1';

export { INITIAL_EDITIONS };

/**
 * Get bookmarked story IDs from localStorage
 */
export function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load bookmarks:', err);
    return [];
  }
}

/**
 * Toggle a story ID bookmark in localStorage
 */
export function toggleBookmarkStorage(storyId) {
  try {
    const current = getBookmarks();
    let updated;
    if (current.includes(storyId)) {
      updated = current.filter((id) => id !== storyId);
    } else {
      updated = [...current, storyId];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to toggle bookmark:', err);
    return [];
  }
}

/**
 * Get user theme preference from localStorage ('dark' or 'light')
 */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

/**
 * Save user theme preference to localStorage
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}
