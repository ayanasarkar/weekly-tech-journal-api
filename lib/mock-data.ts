import { Article, Edition } from "./types";

/**
 * TEMPORARY in-memory store for prototyping only.
 *
 * This lets every route handler share the same dummy data during a
 * dev session without wiring up a database yet. Replace with a real
 * data layer (Prisma + Postgres, etc.) before this goes anywhere near
 * production — module-level arrays do not persist across serverless
 * invocations or survive a restart.
 */

const now = new Date().toISOString();

export const editions: Edition[] = [
  {
    id: "edition_1",
    title: "Weekly Tech Journal — Issue #1",
    weekOf: "2026-08-17",
    description: "AI infrastructure, chip shortages, and the rise of edge computing.",
    status: "draft",
    scheduledFor: null,
    publishedAt: null,
    articleIds: ["article_1"],
    createdAt: now,
    updatedAt: now,
  },
];

export const articles: Article[] = [
  {
    id: "article_1",
    editionId: "edition_1",
    headline: "Edge Computing Is Eating the Cloud's Lunch",
    summary:
      "Latency-sensitive workloads are moving closer to users, reshaping infrastructure spend.",
    content: "Full article body goes here...",
    keyTakeaways: [
      "Edge deployments cut latency significantly for real-time apps.",
      "Hyperscalers are investing heavily in regional micro-datacenters.",
    ],
    sources: [{ label: "IEEE Spectrum", url: "https://spectrum.ieee.org" }],
    author: { name: "Jordan Lee", role: "Senior Infrastructure Editor" },
    createdAt: now,
    updatedAt: now,
  },
];
