// Storage manager for Weekly Tech Journal

import { INITIAL_EDITIONS } from './initialEditions';

const STORAGE_KEY = 'wtj_editions_v1';
const BOOKMARKS_KEY = 'wtj_bookmarks_v1';
const THEME_KEY = 'wtj_theme_v1';

const REMOVED_EDITIONS = new Set(['73', '073', '74', '074', '80', '080', '81', '081']);

export function getStoredEditions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EDITIONS));
      return INITIAL_EDITIONS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const filtered = parsed.filter(ed => {
        const num = String(ed.number || '').replace(/^#/, '').trim();
        return !REMOVED_EDITIONS.has(num) && !REMOVED_EDITIONS.has(String(parseInt(num, 10)));
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.length > 0 ? filtered : INITIAL_EDITIONS));
      return filtered.length > 0 ? filtered : INITIAL_EDITIONS;
    }
    return INITIAL_EDITIONS;
  } catch (err) {
    console.error('Failed to load editions from storage:', err);
    return INITIAL_EDITIONS;
  }
}

export function saveEditions(editions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editions));
  } catch (err) {
    console.error('Failed to save editions to storage:', err);
  }
}

export function resetToDefaults() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EDITIONS));
    return INITIAL_EDITIONS;
  } catch (err) {
    console.error('Failed to reset editions:', err);
    return INITIAL_EDITIONS;
  }
}

export function createNewEdition(existingEditions) {
  const nextNum = (existingEditions.length + 67).toString().padStart(3, '0');
  const today = new Date().toISOString().split('T')[0];

  const newEdition = {
    id: `edition-${nextNum}`,
    number: nextNum,
    title: 'New Frontier Edition',
    tagline: 'Five stories worth your attention.',
    publishDate: today,
    status: 'draft',
    editor: {
      name: 'Alex Sterling',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    weeklySummary: 'A connected overview of this week’s most pivotal breakthroughs in computing, hardware, and engineering.',
    editorsNote: 'From the desk of the editor: reflections and personal insights on how these trends reshape our world.',
    stories: [
      {
        id: `story-${nextNum}-1`,
        slot: 1,
        title: 'Lead Breakthrough Headline',
        subtitle: 'Comprehensive subtitle explaining why this development leads this week’s edition.',
        category: 'Artificial Intelligence',
        readTime: '5 min read',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        imageCaption: 'Lead story visual caption describing key technological mechanism.',
        author: {
          name: 'Alex Sterling',
          role: 'Editor-in-Chief',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        source: {
          name: 'Tech Frontier Press',
          url: 'https://news.ycombinator.com',
        },
        takeaways: [
          'Key foundational insight one summarizing the core finding.',
          'Key architectural shift impacting engineering workflows.',
          'Strategic timeline and commercial deployment predictions.'
        ],
        content: `Start writing the complete lead article for story #1 here. You can include detailed paragraphs, background context, quotes, and analysis of why this changes the tech landscape.`
      },
      {
        id: `story-${nextNum}-2`,
        slot: 2,
        title: 'Second Story Headline',
        subtitle: 'Brief summary of the second major development of the week.',
        category: 'Open Source',
        readTime: '4 min read',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'System architecture diagram.',
        author: {
          name: 'Elena Rostova',
          role: 'Systems Engineer',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        },
        source: {
          name: 'Open Source Journal',
          url: 'https://github.com',
        },
        takeaways: ['Takeaway bullet point one.', 'Takeaway bullet point two.'],
        content: `Detailed story analysis and technical breakdown.`
      },
      {
        id: `story-${nextNum}-3`,
        slot: 3,
        title: 'Third Story Headline',
        subtitle: 'Concise summary of the third key story.',
        category: 'Semiconductors',
        readTime: '4 min read',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Microscopic die inspection.',
        author: {
          name: 'Chen Wei',
          role: 'Semiconductor Analyst',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        source: {
          name: 'Semiconductor Daily',
          url: 'https://semiengineering.com',
        },
        takeaways: ['Takeaway bullet point one.', 'Takeaway bullet point two.'],
        content: `Detailed story analysis and technical breakdown.`
      },
      {
        id: `story-${nextNum}-4`,
        slot: 4,
        title: 'Fourth Story (Wide Landscape) Headline',
        subtitle: 'Summary of the wide format fourth story covering design or infrastructure.',
        category: 'Design & UX',
        readTime: '5 min read',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
        imageCaption: 'Interface wireframe and prototype mockup.',
        author: {
          name: 'Sarah Jenkins',
          role: 'Principal UX Architect',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        },
        source: {
          name: 'Design Systems Quarterly',
          url: 'https://uxdesign.cc',
        },
        takeaways: ['Takeaway bullet point one.', 'Takeaway bullet point two.'],
        content: `Detailed story analysis and technical breakdown.`
      },
      {
        id: `story-${nextNum}-5`,
        slot: 5,
        title: 'Fifth Story Headline',
        subtitle: 'Quick, punchy summary of the fifth story.',
        category: 'Cloud & Infra',
        readTime: '3 min read',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Distributed network telemetry.',
        author: {
          name: 'Devon Miller',
          role: 'Cloud Infrastructure Specialist',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
        source: {
          name: 'Distributed Systems Dispatch',
          url: 'https://infoq.com',
        },
        takeaways: ['Takeaway bullet point one.', 'Takeaway bullet point two.'],
        content: `Detailed story analysis and technical breakdown.`
      }
    ]
  };

  const updated = [newEdition, ...existingEditions];
  saveEditions(updated);
  return { newEdition, updatedEditions: updated };
}

export function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export function toggleBookmarkStorage(storyId) {
  try {
    const current = getBookmarks();
    let updated;
    if (current.includes(storyId)) {
      updated = current.filter(id => id !== storyId);
    } else {
      updated = [...current, storyId];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return [];
  }
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
