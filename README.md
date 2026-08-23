# Weekly Tech Journal — Editor Panel API

Backend API prototype for the Editor Panel, built on the Next.js App Router.
Covers the two core workflows: the **Edition Manager** (create, edit, preview,
schedule, publish) and the **Article Editor** (headline, summary, full body,
key takeaways, sources, author).

## Tech stack

- Next.js (App Router, Route Handlers) — `--api` template, no UI
- TypeScript
- In-memory mock data store (placeholder for a real database — see [Known limitations](#known-limitations))

## Getting started

```bash
npx create-next-app@latest weekly-tech-journal-api --typescript --api --eslint --import-alias "@/*"
cd weekly-tech-journal-api
npm run dev
```

Then drop the `app/api` and `lib` folders from this prototype into the
generated project (merging into the existing `app/` directory).

## Folder structure

```
app/
  api/
    editions/
      route.ts                          GET  (list)      POST (create draft)
      [id]/
        route.ts                        GET  (fetch)      PATCH (edit meta)   DELETE
        preview/
          route.ts                      GET  (assemble read-only preview)
        publish/
          route.ts                      PATCH (schedule or publish)
        articles/
          route.ts                      GET  (list)       POST (add article)
          [articleId]/
            route.ts                    GET  (fetch)       PATCH (edit)   DELETE
lib/
  types.ts             Shared TypeScript interfaces (Edition, Article, Author, Source)
  api-response.ts       apiSuccess() / apiError() — consistent JSON envelopes
  mock-data.ts          In-memory seed data shared across route handlers
```

**Why articles are nested under editions:** an article only exists in the
context of a weekly edition, so `/api/editions/:id/articles/...` mirrors the
actual content hierarchy and keeps ownership checks simple (an article
lookup always confirms it belongs to the parent edition).

**Why `publish` is its own route instead of a field on the generic `PATCH`:**
publishing/scheduling is a state-machine transition with its own validation
rules (e.g. `scheduledFor` is required to schedule), not a routine metadata
edit. Separating it keeps both handlers small and makes the workflow action
explicit in the URL.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/editions` | List editions (optional `?status=draft\|scheduled\|published\|archived`) |
| POST | `/api/editions` | Create a new draft edition |
| GET | `/api/editions/:id` | Fetch one edition |
| PATCH | `/api/editions/:id` | Edit title / description / weekOf |
| DELETE | `/api/editions/:id` | Remove an edition |
| GET | `/api/editions/:id/preview` | Read-only edition + its articles, as the preview pane would render it |
| PATCH | `/api/editions/:id/publish` | Schedule (`{ action: "schedule", scheduledFor }`) or publish now (`{ action: "publish" }`) |
| GET | `/api/editions/:id/articles` | List articles in an edition |
| POST | `/api/editions/:id/articles` | Add an article to an edition |
| GET | `/api/editions/:id/articles/:articleId` | Fetch one article |
| PATCH | `/api/editions/:id/articles/:articleId` | Edit article fields |
| DELETE | `/api/editions/:id/articles/:articleId` | Remove an article |

## Response format

Every handler returns the same envelope, so the frontend can branch on
`success` without inspecting status codes:

```jsonc
// Success
{ "success": true, "data": { /* ... */ } }

// Error
{ "success": false, "error": { "message": "...", "details": null } }
```

## Data model

```ts
Edition {
  id, title, weekOf, description,
  status: "draft" | "scheduled" | "published" | "archived",
  scheduledFor, publishedAt, articleIds, createdAt, updatedAt
}

Article {
  id, editionId, headline, summary, content,
  keyTakeaways: string[], sources: { label, url }[],
  author: { name, role?, bio?, avatarUrl? },
  createdAt, updatedAt
}
```

## Conventions followed

- **Route params are awaited**, per the Next.js 15+/16 async `params` API
  (`const { id } = await params`).
- **Validation before mutation** — required fields are checked and a `400`
  with a descriptive message is returned before touching the store.
- **404s for missing resources**, `400`s for bad input — no silent failures.
- **No business logic in route handlers beyond orchestration** — types and
  data access are isolated in `lib/`, so swapping the mock store for a real
  database later only touches `lib/mock-data.ts`.

## Known limitations

This is a prototype: `lib/mock-data.ts` is a plain in-memory array, so it
resets on server restart and won't be reliably shared across serverless
invocations. Before shipping, replace it with a real data layer (e.g.
Prisma + Postgres) behind the same function signatures, and add:

- Request validation with a schema library (e.g. Zod)
- Authentication/authorization on write endpoints
- Optimistic concurrency or transactions for the publish workflow
- Automated tests for each route handler
