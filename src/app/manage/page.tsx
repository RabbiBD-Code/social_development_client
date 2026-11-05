import { ClipboardList } from "lucide-react";
import { Suspense } from "react";

import ManageEvents, { ManageEventsSkeleton } from "./manage-events";

/**
 * Static shell for the manage page. The session lookup and the event list
 * are dynamic, so they stream in behind a Suspense boundary.
 */
export default function ManagePage() {
  return (
    <>
      {/* Page header — ships in the static shell */}
      <section className="border-b border-border bg-gradient-to-b from-teal-50/70 to-background">
        <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:pt-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
            <ClipboardList className="size-3.5" />
            Organizer Tools
          </span>

          <div className="mt-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Manage Events
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every drive on your roster in one place. Open a card to fix the
              details, or remove an event that has been cancelled.
            </p>
          </div>
        </div>
      </section>

      {/* Session + event list stream in behind a boundary */}
      <Suspense fallback={<ManageEventsSkeleton />}>
        <ManageEvents />
      </Suspense>
    </>
  );
}
