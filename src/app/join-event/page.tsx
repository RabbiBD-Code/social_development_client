import { HandHeart } from "lucide-react";
import { Suspense } from "react";

import JoinedEvents, { JoinedEventsSkeleton } from "./joined-events";

/**
 * Static shell for the "events I joined" page. The session lookup and the
 * join list are dynamic, so they stream in behind a Suspense boundary.
 */
export default function JoinEventPage() {
  return (
    <>
      {/* Page header — ships in the static shell */}
      <section className="border-b border-border bg-gradient-to-b from-teal-50/70 to-background">
        <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:pt-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
            <HandHeart className="size-3.5" />
            Your Sign-ups
          </span>

          <div className="mt-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Joined Events
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every community drive you have signed up for, sorted by event
              date so the soonest one always comes first.
            </p>
          </div>
        </div>
      </section>

      {/* Session + join list stream in behind a boundary */}
      <Suspense fallback={<JoinedEventsSkeleton />}>
        <JoinedEvents />
      </Suspense>
    </>
  );
}
