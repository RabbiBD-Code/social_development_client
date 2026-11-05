import { format, parseISO } from "date-fns";
import { ArrowRight, CalendarCheck2, CirclePlus, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/recent-upcoming-events`;


type EventDoc = {
  _id: string;
  title?: string;
  type?: string;
  date?: string;
  location?: string;
  image?: string;
  description?: string;
};

const typeLabels: Record<string, string> = {
  relief: "Relief",
  food: "Food Distribution",
  education: "Education",
  health: "Healthcare",
  environment: "Environment",
};

async function getRecentEvents(): Promise<EventDoc[]> {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as EventDoc[]) : [];
  } catch {
    // Backend unreachable — show the empty state instead of crashing the page.
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "Date to be announced";
  try {
    return format(parseISO(value), "EEE, MMM d, yyyy");
  } catch {
    return value;
  }
}

function daysUntil(value?: string): string | null {
  if (!value) return null;
  try {
    const days = Math.round(
      (parseISO(value).getTime() - Date.now()) / 86_400_000
    );
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  } catch {
    return null;
  }
}

async function EventCard({ event }: { event: EventDoc }) {
  const label = event.type ? typeLabels[event.type] ?? event.type : null;
  const countdown = daysUntil(event.date);
  await connection()

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-teal-300">
      {/* Cover */}
      {event.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-provided URL, remotePatterns unknown
        <img
          src={event.image}
          alt={event.title ?? "Event photo"}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-600">
          <CalendarCheck2 className="size-10 text-white/80" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {label && (
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
              {label}
            </span>
          )}
          {countdown && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              {countdown}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug text-foreground">
          {event.title || "Untitled event"}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CalendarCheck2 className="size-3.5 shrink-0 text-teal-600" />
            {formatDate(event.date)}
          </p>
          {event.location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-teal-600" />
              {event.location}
            </p>
          )}
        </div>

        {event.description && (
          <p className="mt-3 flex-1 text-sm/relaxed text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        <Link
            href={`/events/${event._id}`}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            View Event
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
      </div>
    </div>
  );
}

export default async function RecentEvents() {
  const events = await getRecentEvents();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
          <Sparkles className="size-3.5" />
          Recent Upcoming Events
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Drives happening soon
        </h2>
        <p className="mt-3 text-sm/relaxed text-muted-foreground">
          The next six community events on the calendar — grab a spot before
          they fill up.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <CirclePlus className="size-9 text-teal-600" />
          <h3 className="mt-4 text-base font-bold text-foreground">
            No upcoming events yet
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Once an event is published through the Create Event page, it will
            show up right here.
          </p>
          <Link
            href="/create-events"
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            <CirclePlus className="size-4" />
            Create an event
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export function RecentEventsSkeleton() {
  return (
    <section
      aria-hidden
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-6 w-52 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto mt-4 h-9 w-80 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="h-40 w-full animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
