/**
 * Domain types shared across the Editor Panel API.
 * Keeping these in one place means route handlers and (future)
 * database models stay in sync as the schema evolves.
 */

export type EditionStatus = "draft" | "scheduled" | "published" | "archived";

export interface Author {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface Article {
  id: string;
  editionId: string;
  headline: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
  sources: Source[];
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Edition {
  id: string;
  title: string;
  /** ISO date representing the Monday of the week this edition covers */
  weekOf: string;
  description?: string;
  status: EditionStatus;
  scheduledFor: string | null;
  publishedAt: string | null;
  articleIds: string[];
  createdAt: string;
  updatedAt: string;
}
