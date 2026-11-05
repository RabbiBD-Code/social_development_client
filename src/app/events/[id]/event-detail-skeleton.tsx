/** Placeholder for the event detail view while the API responds. */
export default function EventDetailSkeleton() {
  return (
    <div
      aria-busy
      aria-label="Loading event"
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12"
    >
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] animate-pulse rounded-2xl bg-muted" />
          <div className="mt-6 h-9 w-4/5 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-36 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="size-9 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-11 w-full animate-pulse rounded-lg bg-muted" />
          <div className="mt-3 h-11 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
