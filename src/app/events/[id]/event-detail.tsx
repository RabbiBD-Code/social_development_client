import {
  ArrowLeft,
  CalendarDays,
  HandHeart,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  categoryStyle,
  formatEventDate,
  type CommunityEvent,
} from "@/lib/events";
import JoinEvent from "./_components/JoinEvent";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const EVENTS_URL = "http://localhost:8000/events";

interface EventDetailProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolves a single drive from the API. There is no by-id endpoint yet, so we
 * fetch the collection and pick the match. Runs behind the page's Suspense
 * boundary, which keeps `params` and the fetch out of the static shell.
 */
export default async function EventDetail({ params }: EventDetailProps) {
  const { id } = await params;

 const token = await getTokenFromServer()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,{
      headers: {
    Authorization: `Bearer ${token}`,
  },
      cache: "no-store"
    });
   
      const event = await res.json();
      console.log(event);
 

  const category = categoryStyle(event?.type);
  const formattedDate = formatEventDate(event?.date);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
      >
        <ArrowLeft className="size-4" />
        Back to events
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            {event?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event?.image}
                alt={event?.title}
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}

            <span
              className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${category.badge}`}
            >
              <category.icon className="size-3.5" />
              {event?.type}
            </span>

            {formattedDate ? (
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                <CalendarDays className="size-4" />
                {formattedDate}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {event?.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
              <CalendarDays className="size-3.5" />
              {formattedDate || "Date to be announced"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
              <MapPin className="size-3.5" />
              {event?.location}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">
              About this drive
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {event?.description}
            </p>
          </div>
        </div>

        {/* Summary card */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Tag className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <span className="text-sm font-semibold text-foreground">
                    {event?.type}
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <CalendarDays className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Date</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formattedDate || "To be announced"}
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <MapPin className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Location</span>
                  <span className="text-sm font-semibold text-foreground">
                    {event?.location}
                  </span>
                </span>
              </li>

              {event?.organizer ? (
                <li className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Users className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Organized by
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {event?.organizer}
                    </span>
                  </span>
                </li>
              ) : null}
            </ul>

            {/* TODO: wire this up once a join endpoint exists. */}
            
            <JoinEvent event={event}/>

            <Link
              href="/events"
              className="mt-3 flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Browse other drives
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
