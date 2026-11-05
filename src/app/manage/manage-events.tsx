import { CalendarX2, CirclePlus } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { normalizeEvents, type CommunityEvent } from "@/lib/events";
import ManageEventCard from "./manage-event-card";

const JOINING_URL = `${process.env.NEXT_PUBLIC_API_URL}/manage-events`;

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

async function getManagedEvents(email: string): Promise<CommunityEvent[]> {
  try {
    const res = await fetch(
      `${JOINING_URL}/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch events (${res.status})`);
    }

    return normalizeEvents(extractEvents(await res.json()));
  } catch (error) {
    // Backend unreachable — show the empty state instead of crashing the page.
    console.error("Failed to load managed events:", error);
    return [];
  }
}

/** Cards with Edit/Delete actions, streamed in behind the page's Suspense. */
export default async function ManageEvents() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  const email = session?.user?.email;
  if (!email) redirect("/signin");

  const events = await getManagedEvents(email);
  console.log(events, "manage evnet");

  if (events.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CalendarX2 className="size-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            Nothing to manage yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Events you create will show up here, ready to edit or delete.
          </p>
          <Link
            href="/create-events"
            className="mt-1 inline-flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <CirclePlus className="size-4" />
            Create event
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <p className="mt-6 text-sm text-muted-foreground">
        {events.length} {events.length === 1 ? "event" : "events"} on your
        roster — use the buttons on a card to update or remove it.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <ManageEventCard
            key={event._id ?? `${event.title}-${event.date}`}
            event={event}
          />
        ))}
      </div>
    </section>
  );
}

/** Placeholder shown while the session and event list stream in. */
export function ManageEventsSkeleton() {
  return (
    <section
      aria-busy
      aria-label="Loading managed events"
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
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
