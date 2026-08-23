import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { articles, editions } from "@/lib/mock-data";
import { Article } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string; articleId: string }>;
}

const EDITABLE_FIELDS = [
  "headline",
  "summary",
  "content",
  "keyTakeaways",
  "sources",
  "author",
] as const satisfies readonly (keyof Article)[];

/**
 * GET /api/editions/[id]/articles/[articleId]
 * Fetch a single article for editing.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id, articleId } = await params;
  const article = articles.find((a) => a.id === articleId && a.editionId === id);

  if (!article) {
    return apiError(`Article '${articleId}' was not found in edition '${id}'.`, 404);
  }

  return apiSuccess(article);
}

/**
 * PATCH /api/editions/[id]/articles/[articleId]
 * Update headline, summary, content, key takeaways, sources, or author.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, articleId } = await params;
  const article = articles.find((a) => a.id === articleId && a.editionId === id);

  if (!article) {
    return apiError(`Article '${articleId}' was not found in edition '${id}'.`, 404);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return apiError("Request body must be valid JSON.", 400);
  }

  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) {
      (article[field] as unknown) = body[field];
    }
  }
  article.updatedAt = new Date().toISOString();

  return apiSuccess(article);
}

/**
 * DELETE /api/editions/[id]/articles/[articleId]
 * Remove an article from an edition.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id, articleId } = await params;
  const index = articles.findIndex((a) => a.id === articleId && a.editionId === id);

  if (index === -1) {
    return apiError(`Article '${articleId}' was not found in edition '${id}'.`, 404);
  }

  const [removed] = articles.splice(index, 1);

  const edition = editions.find((e) => e.id === id);
  if (edition) {
    edition.articleIds = edition.articleIds.filter((articleIdRef) => articleIdRef !== articleId);
    edition.updatedAt = new Date().toISOString();
  }

  return apiSuccess(removed);
}
