import { NextResponse } from "next/server";

/**
 * Consistent success/error envelopes so every endpoint in the
 * Editor Panel returns predictable shapes for the frontend to consume.
 */

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { message, details } },
    { status }
  );
}
