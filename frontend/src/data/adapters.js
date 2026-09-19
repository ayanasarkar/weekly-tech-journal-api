/**
 * Data Adapters for Weekly Tech Journal
 * Translates between backend API schemas and frontend UI models.
 */

import { estimateReadTime } from '../utils/helpers';

const DEFAULT_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
];

const DEFAULT_CATEGORIES = [
  'Artificial Intelligence',
  'Open Source',
  'Semiconductors',
  'Design & UX',
  'Cloud & Infra'
];

/**
 * Extract a readable 3-digit issue number string from edition title, id, or index.
 */
export function extractEditionNumber(edition, fallbackIndex = 1) {
  if (!edition) return String(fallbackIndex).padStart(3, '0');
  
  if (edition.number) {
    const clean = String(edition.number).replace(/^#/, '').trim();
    if (clean) return clean.padStart(3, '0');
  }

  const titleMatch = edition.title?.match(/#(\d+)/i) || edition.title?.match(/Issue\s*(\d+)/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].padStart(3, '0');
  }

  const idMatch = edition.id?.match(/\d+/);
  if (idMatch && idMatch[0]) {
    return idMatch[0].padStart(3, '0');
  }

  return String(fallbackIndex).padStart(3, '0');
}

/**
 * Convert backend Article -> frontend Story
 */
export function adaptBackendArticleToStory(article, slotIndex = 1) {
  if (!article) return null;

  const imageFallback = DEFAULT_STORY_IMAGES[(slotIndex - 1) % DEFAULT_STORY_IMAGES.length];
  const categoryFallback = DEFAULT_CATEGORIES[(slotIndex - 1) % DEFAULT_CATEGORIES.length];

  const sourceObj = Array.isArray(article.sources) && article.sources.length > 0
    ? {
        name: article.sources[0].label || 'Tech Frontier',
        url: article.sources[0].url || 'https://news.ycombinator.com'
      }
    : {
        name: 'Tech Frontier',
        url: 'https://news.ycombinator.com'
      };

  const authorObj = article.author
    ? {
        name: article.author.name || 'Staff Writer',
        role: article.author.role || 'Contributor',
        avatar: article.author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    : {
        name: 'Alex Sterling',
        role: 'Editor-in-Chief',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };

  return {
    id: article.id,
    slot: slotIndex,
    title: article.headline || '',
    subtitle: article.summary || '',
    category: article.category || categoryFallback,
    readTime: article.readTime || estimateReadTime(article.content || article.summary || ''),
    imageUrl: article.imageUrl || imageFallback,
    imageCaption: article.imageCaption || '',
    author: authorObj,
    source: sourceObj,
    takeaways: Array.isArray(article.keyTakeaways) ? article.keyTakeaways : [],
    content: article.content || '',
    createdAt: article.createdAt,
    updatedAt: article.updatedAt
  };
}

/**
 * Convert frontend Story -> backend Article request payload
 */
export function adaptStoryToBackendArticle(story) {
  const sources = story.source
    ? [
        {
          label: typeof story.source === 'object' ? story.source.name || 'Source' : String(story.source),
          url: typeof story.source === 'object' ? story.source.url || 'https://news.ycombinator.com' : 'https://news.ycombinator.com'
        }
      ]
    : [{ label: 'Tech Frontier', url: 'https://news.ycombinator.com' }];

  const author = {
    name: story.author?.name || 'Staff Writer',
    role: story.author?.role || 'Staff Writer',
    avatarUrl: story.author?.avatar || ''
  };

  return {
    headline: story.title || 'Untitled Story',
    summary: story.subtitle || 'Story summary',
    content: story.content || story.subtitle || 'Article body content',
    keyTakeaways: Array.isArray(story.takeaways) ? story.takeaways : [],
    sources,
    author
  };
}

/**
 * Generate a template placeholder story for missing slots (1..5)
 */
function createPlaceholderStory(slotIndex, editionId, editionNumber) {
  const image = DEFAULT_STORY_IMAGES[(slotIndex - 1) % DEFAULT_STORY_IMAGES.length];
  const category = DEFAULT_CATEGORIES[(slotIndex - 1) % DEFAULT_CATEGORIES.length];

  return {
    id: `placeholder_${editionId}_${slotIndex}`,
    slot: slotIndex,
    title: `Slot #${slotIndex} Headline Draft`,
    subtitle: `Summary for story #${slotIndex} awaiting editorial copy.`,
    category,
    readTime: '4 min read',
    imageUrl: image,
    imageCaption: 'System architecture analysis.',
    author: {
      name: 'Alex Sterling',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    source: {
      name: 'Tech Frontier Press',
      url: 'https://news.ycombinator.com'
    },
    takeaways: [
      'Foundational insight one for this article.',
      'Key technical shift impacting engineering teams.'
    ],
    content: `Start writing article content for slot #${slotIndex}...`
  };
}

/**
 * Convert backend Edition + Articles -> frontend Edition model
 */
export function adaptBackendEditionToFrontend(backendEdition, articles = [], index = 1) {
  if (!backendEdition) return null;

  const number = extractEditionNumber(backendEdition, index);
  const publishDate = backendEdition.publishedAt
    ? backendEdition.publishedAt.split('T')[0]
    : backendEdition.scheduledFor
    ? backendEdition.scheduledFor.split('T')[0]
    : backendEdition.weekOf || new Date().toISOString().split('T')[0];

  // Map existing articles to slots 1..5
  const stories = [];
  for (let i = 1; i <= 5; i++) {
    const article = articles[i - 1];
    if (article) {
      stories.push(adaptBackendArticleToStory(article, i));
    } else {
      stories.push(createPlaceholderStory(i, backendEdition.id, number));
    }
  }

  return {
    id: backendEdition.id,
    number,
    title: backendEdition.title || `Weekly Tech Journal — Issue #${number}`,
    tagline: backendEdition.description || 'Five stories worth your attention.',
    publishDate,
    status: backendEdition.status || 'draft',
    scheduledFor: backendEdition.scheduledFor || null,
    publishedAt: backendEdition.publishedAt || null,
    articleIds: backendEdition.articleIds || [],
    editor: {
      name: 'Alex Sterling',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    weeklySummary: backendEdition.description || 'A connected overview of this week’s most pivotal breakthroughs in computing, hardware, and engineering.',
    editorsNote: 'From the desk of the editor: reflections and personal insights on how these trends reshape our world.',
    stories,
    createdAt: backendEdition.createdAt,
    updatedAt: backendEdition.updatedAt
  };
}

/**
 * Convert frontend Edition edits -> backend Edition PATCH / POST payload
 */
export function adaptFrontendEditionToBackend(frontendEdition) {
  return {
    title: frontendEdition.title || 'Untitled Edition',
    weekOf: frontendEdition.publishDate || new Date().toISOString().split('T')[0],
    description: frontendEdition.tagline || frontendEdition.weeklySummary || ''
  };
}
