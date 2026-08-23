import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { editions } from "@/lib/mock-data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/editions/[id]
 * Fetch a single edition by id.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const edition = editions.find((e) => e.id === id);

  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  return apiSuccess(edition);
}

/**
 * PATCH /api/editions/[id]
 * Edit edition metadata (title, description, weekOf).
 * Use /api/editions/[id]/publish to change status instead.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const edition = editions.find((e) => e.id === id);

  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return apiError("Request body must be valid JSON.", 400);
  }

  const { title, description, weekOf } = body;
  if (title !== undefined) edition.title = title;
  if (description !== undefined) edition.description = description;
  if (weekOf !== undefined) edition.weekOf = weekOf;
  edition.updatedAt = new Date().toISOString();

  return apiSuccess(edition);
}

/**
 * DELETE /api/editions/[id]
 * Remove an edition (typically only allowed while still a draft).
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const index = editions.findIndex((e) => e.id === id);

  if (index === -1) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  const [removed] = editions.splice(index, 1);
  return apiSuccess(removed);
}
