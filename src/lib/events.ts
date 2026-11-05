import type { LucideIcon } from "lucide-react";
import { GraduationCap, HeartPulse, Leaf, Tag, UtensilsCrossed } from "lucide-react";

/** Shape returned by `GET http://localhost:8000/add-events`. */
export interface CommunityEvent {
  _id: string;
  title: string;
  type: string;
  /** ISO date, e.g. `2026-11-10`. */
  date: string;
  location: string;
  image: string;
  description: string;
  /** Not returned by the API yet — rendered only when present. */
  organizer?: string;
}

interface CategoryStyle {
  icon: LucideIcon;
  badge: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Food Distribution": {
    icon: UtensilsCrossed,
    badge: "bg-amber-500/95 text-amber-50",
  },
  Education: { icon: GraduationCap, badge: "bg-sky-500/95 text-sky-50" },
  Healthcare: { icon: HeartPulse, badge: "bg-rose-500/95 text-rose-50" },
  Environment: { icon: Leaf, badge: "bg-emerald-500/95 text-emerald-50" },
};

const DEFAULT_STYLE: CategoryStyle = { icon: Tag, badge: "bg-teal-600/95 text-teal-50" };

export function categoryStyle(type: string): CategoryStyle {
  return CATEGORY_STYLES[type] ?? DEFAULT_STYLE;
}

/** `2026-11-10` -> a local Date at midnight (avoids the UTC off-by-one). */
export function parseEventDate(value?: string): Date {
  if (!value) return new Date(Number.NaN);

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date(Number.NaN);
  }

  return new Date(year, month - 1, day);
}
/** `2026-11-10` -> `Tue, Nov 10, 2026`. */
export function formatEventDate(value: string): string {
  const date = parseEventDate(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Events dated today or later stay on the board; past drives are dropped. */
export function isUpcoming(value: string): boolean {
  const date = parseEventDate(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}

/** Normalises whatever the API returns into `CommunityEvent[]`. */
export function normalizeEvents(payload: unknown): CommunityEvent[] {
  if (!Array.isArray(payload)) return [];
  return payload.filter(
    (item): item is CommunityEvent =>
      !!item &&
      typeof item === "object" &&
      typeof (item as CommunityEvent).title === "string" &&
      typeof (item as CommunityEvent).date === "string",
  );
}
