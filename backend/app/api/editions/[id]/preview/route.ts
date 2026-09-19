import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { editions, articles } from "@/lib/mock-data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/editions/[id]/preview
 * Read-only view of an edition with its articles inlined, exactly as
 * the frontend preview pane would render it before publishing.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const edition = editions.find((e) => e.id === id);

  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  const editionArticles = articles.filter((a) => a.editionId === id);

  return apiSuccess({ ...edition, articles: editionArticles });
}
