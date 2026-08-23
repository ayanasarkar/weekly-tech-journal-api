import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { editions, articles } from "@/lib/mock-data";
import { Article } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/editions/[id]/articles
 * List all articles that belong to a given edition.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const edition = editions.find((e) => e.id === id);

  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  return apiSuccess(articles.filter((a) => a.editionId === id));
}

/**
 * POST /api/editions/[id]/articles
 * Add a new article to an edition — the core Article Editor action.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const edition = editions.find((e) => e.id === id);

  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  const body = await request.json().catch(() => null);

  if (!body?.headline || !body?.summary || !body?.content || !body?.author?.name) {
    return apiError(
      "'headline', 'summary', 'content', and 'author.name' are required.",
      400
    );
  }

  const timestamp = new Date().toISOString();

  const newArticle: Article = {
    id: `article_${Date.now()}`,
    editionId: id,
    headline: body.headline,
    summary: body.summary,
    content: body.content,
    keyTakeaways: body.keyTakeaways ?? [],
    sources: body.sources ?? [],
    author: body.author,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  articles.push(newArticle);
  edition.articleIds.push(newArticle.id);
  edition.updatedAt = timestamp;

  return apiSuccess(newArticle, 201);
}
