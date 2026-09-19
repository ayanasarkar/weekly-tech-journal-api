/**
 * Frontend API Access Layer for Weekly Tech Journal
 * Communicates directly with the backend API routes (/api/editions/...).
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Standard fetch wrapper handling JSON envelopes and error reporting.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type');
    let json = null;

    if (contentType && contentType.includes('application/json')) {
      json = await res.json().catch(() => null);
    }

    if (!res.ok || (json && json.success === false)) {
      const errorMessage = json?.error?.message || json?.error || `Request failed with status ${res.status} (${res.statusText})`;
      const error = new Error(errorMessage);
      error.status = res.status;
      error.details = json?.error?.details || null;
      throw error;
    }

    // Backend returns envelope { success: true, data: ... }
    return json && 'data' in json ? json.data : json;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err);
    throw err;
  }
}

// ==========================================
// EDITION ENDPOINTS
// ==========================================

/**
 * GET /api/editions
 * List all editions, optionally filtered by status ('draft' | 'scheduled' | 'published' | 'archived')
 */
export async function getEditions(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/api/editions${query}`, { method: 'GET' });
}

/**
 * GET /api/editions/:id
 * Fetch a single edition by ID
 */
export async function getEditionById(id) {
  return request(`/api/editions/${encodeURIComponent(id)}`, { method: 'GET' });
}

/**
 * POST /api/editions
 * Create a new draft edition
 * Body: { title: string, weekOf: string, description?: string }
 */
export async function createEdition({ title, weekOf, description = '' }) {
  return request('/api/editions', {
    method: 'POST',
    body: JSON.stringify({ title, weekOf, description })
  });
}

/**
 * PATCH /api/editions/:id
 * Update edition metadata (title, description, weekOf)
 */
export async function updateEdition(id, { title, description, weekOf }) {
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (weekOf !== undefined) payload.weekOf = weekOf;

  return request(`/api/editions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

/**
 * DELETE /api/editions/:id
 * Remove an edition
 */
export async function deleteEdition(id) {
  return request(`/api/editions/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

/**
 * GET /api/editions/:id/preview
 * Fetch read-only edition with its articles array inlined
 */
export async function getEditionPreview(id) {
  return request(`/api/editions/${encodeURIComponent(id)}/preview`, {
    method: 'GET'
  });
}

/**
 * PATCH /api/editions/:id/publish
 * Publish or schedule an edition
 * Body: { action: "publish" } | { action: "schedule", scheduledFor: string }
 */
export async function publishEdition(id, action = 'publish', scheduledFor = null) {
  const payload = { action };
  if (action === 'schedule' && scheduledFor) {
    payload.scheduledFor = scheduledFor;
  }

  return request(`/api/editions/${encodeURIComponent(id)}/publish`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

// ==========================================
// ARTICLE ENDPOINTS
// ==========================================

/**
 * GET /api/editions/:id/articles
 * List all articles for a specific edition
 */
export async function getArticles(editionId) {
  return request(`/api/editions/${encodeURIComponent(editionId)}/articles`, {
    method: 'GET'
  });
}

/**
 * GET /api/editions/:id/articles/:articleId
 * Fetch a single article by ID
 */
export async function getArticleById(editionId, articleId) {
  return request(
    `/api/editions/${encodeURIComponent(editionId)}/articles/${encodeURIComponent(articleId)}`,
    { method: 'GET' }
  );
}

/**
 * POST /api/editions/:id/articles
 * Add a new article to an edition
 * Body: { headline, summary, content, keyTakeaways, sources, author }
 */
export async function createArticle(editionId, articleData) {
  return request(`/api/editions/${encodeURIComponent(editionId)}/articles`, {
    method: 'POST',
    body: JSON.stringify(articleData)
  });
}

/**
 * PATCH /api/editions/:id/articles/:articleId
 * Update article fields (headline, summary, content, keyTakeaways, sources, author)
 */
export async function updateArticle(editionId, articleId, articleData) {
  return request(
    `/api/editions/${encodeURIComponent(editionId)}/articles/${encodeURIComponent(articleId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(articleData)
    }
  );
}

/**
 * DELETE /api/editions/:id/articles/:articleId
 * Delete an article from an edition
 */
export async function deleteArticle(editionId, articleId) {
  return request(
    `/api/editions/${encodeURIComponent(editionId)}/articles/${encodeURIComponent(articleId)}`,
    {
      method: 'DELETE'
    }
  );
}
