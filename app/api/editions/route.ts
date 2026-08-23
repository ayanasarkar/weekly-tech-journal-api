import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { editions } from "@/lib/mock-data";
import { Edition } from "@/lib/types";

/**
 * GET /api/editions
 * List all editions. Supports optional ?status= filtering
 * (draft | scheduled | published | archived).
 */
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");

  const results = status
    ? editions.filter((edition) => edition.status === status)
    : editions;

  return apiSuccess(results);
}

/**
 * POST /api/editions
 * Create a new draft edition. Every edition starts as a "draft"
 * and moves to "scheduled"/"published" via the /publish endpoint.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.weekOf) {
    return apiError(
      "'title' and 'weekOf' are required to create an edition.",
      400
    );
  }

  const timestamp = new Date().toISOString();

  const newEdition: Edition = {
    id: `edition_${Date.now()}`,
    title: body.title,
    weekOf: body.weekOf,
    description: body.description ?? "",
    status: "draft",
    scheduledFor: null,
    publishedAt: null,
    articleIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  editions.push(newEdition);

  return apiSuccess(newEdition, 201);
}
