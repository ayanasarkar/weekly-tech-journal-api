import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { editions } from "@/lib/mock-data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/editions/[id]/publish
 *
 * Body:
 *   { "action": "publish" }
 *   { "action": "schedule", "scheduledFor": "2026-08-30T09:00:00.000Z" }
 *
 * Moves an edition from "draft" to either "scheduled" or "published".
 * Kept as its own endpoint (rather than folded into the generic PATCH
 * on /api/editions/[id]) so publishing — a meaningful workflow action —
 * stays separate from routine metadata edits.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  const edition = editions.find((e) => e.id === id);
  if (!edition) {
    return apiError(`Edition '${id}' was not found.`, 404);
  }

  const action = body?.action;

  if (action === "schedule") {
    if (!body?.scheduledFor) {
      return apiError(
        "'scheduledFor' (ISO date string) is required to schedule an edition.",
        400
      );
    }
    edition.status = "scheduled";
    edition.scheduledFor = body.scheduledFor;
    edition.publishedAt = null;
  } else if (action === "publish") {
    edition.status = "published";
    edition.publishedAt = new Date().toISOString();
    edition.scheduledFor = null;
  } else {
    return apiError("'action' must be either 'publish' or 'schedule'.", 400);
  }

  edition.updatedAt = new Date().toISOString();

  return apiSuccess(edition);
}
