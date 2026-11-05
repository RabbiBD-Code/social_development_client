/** Placeholder shown while the events stream in from the API. */
export default function EventsSkeleton() {
  return (
    <section
      aria-busy
      aria-label="Loading upcoming events"
      className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6"
    >
      {/* Filter + search row */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-24 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
        <div className="h-9 w-full animate-pulse rounded-full bg-muted lg:w-72" />
      </div>

      {/* Card grid */}
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
