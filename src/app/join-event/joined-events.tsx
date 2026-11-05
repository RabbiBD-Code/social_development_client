import { CalendarX2, HandHeart } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import EventCard from "@/components/EventCard";
import { auth } from "@/lib/auth";
import {
  normalizeEvents,
  parseEventDate,
  type CommunityEvent,
} from "@/lib/events";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const JOINING_URL = `${process.env.NEXT_PUBLIC_API_URL}/joining`;

/**
 * The backend joins the caller's details onto the event document, so the
 * payload may come back as a bare array or wrapped in an object. Fall back
 * to the first array we can find before treating it as empty.
 */
function extractEvents(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) return value;
    }
  }
  return [];
}

/** Soonest first; entries without a usable date sink to the end. */
function byEventDate(a: CommunityEvent, b: CommunityEvent): number {
  const aTime = parseEventDate(a.date).getTime();
  const bTime = parseEventDate(b.date).getTime();
  const aValue = Number.isNaN(aTime) ? Number.POSITIVE_INFINITY : aTime;
  const bValue = Number.isNaN(bTime) ? Number.POSITIVE_INFINITY : bTime;
  return aValue - bValue;
}

async function getJoinedEvents(email: string): Promise<CommunityEvent[]> {

  const token = await getTokenFromServer()

  try {
  const res = await fetch(
    `${JOINING_URL}/${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

    if (!res.ok) {
      throw new Error(`Failed to fetch joined events (${res.status})`);
    }

    const events = normalizeEvents(extractEvents(await res.json()));
    return events.sort(byEventDate);
  } catch (error) {
    // Backend unreachable — show the empty state instead of crashing the page.
    console.error("Failed to load joined events:", error);
    return [];
  }
}

export default async function JoinedEvents() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  const userEmail = session?.user?.email;
  if (!userEmail) redirect("/signin");

  const events = await getJoinedEvents(userEmail);

  if (events.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CalendarX2 className="size-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            You haven&apos;t joined any events yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pick a drive from the events board — your sign-ups will show up
            here, ordered by date.
          </p>
          <Link
            href="/events"
            className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <HandHeart className="size-4" />
            Browse events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <p className="mt-6 text-sm text-muted-foreground">
        {events.length} joined {events.length === 1 ? "event" : "events"} —
        soonest first.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event._id ?? `${event.title}-${event.date}`}
            event={event}
          />
        ))}
      </div>
    </section>
  );
}

/** Placeholder shown while the session and join list stream in. */
export function JoinedEventsSkeleton() {
  return (
    <section
      aria-busy
      aria-label="Loading joined events"
      className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6"
    >
      <div className="mt-6 h-4 w-56 animate-pulse rounded bg-muted" />

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[16/10] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
