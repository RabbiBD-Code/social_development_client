import { CirclePlus, CalendarSearch } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import EventsExplorer from "./events-explorer";
import EventsSkeleton from "./events-skeleton";

export default function UpcomingEventsPage() {
  return (
    <>
      {/* Page header — ships in the static shell */}
      <section className="border-b border-border bg-gradient-to-b from-teal-50/70 to-background">
        <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:pt-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
            <CalendarSearch className="size-3.5" />
            Future Community Drives
          </span>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Upcoming Events
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Discover verified volunteer initiatives scheduled for upcoming
                dates. Past events are automatically excluded so you can focus
                on active drives that need support.
              </p>
            </div>

            <Button
              render={<Link href="/create-events" />}
              size="lg"
              className="h-10 shrink-0 gap-2 bg-teal-600 px-4 text-white hover:bg-teal-700"
            >
              <CirclePlus className="size-4" />
              Create Event
            </Button>
          </div>
        </div>
      </section>

      {/* Filters + results stream in behind a boundary */}
      <Suspense fallback={<EventsSkeleton />}>
        <EventsExplorer />
      </Suspense>
    </>
  );
}
