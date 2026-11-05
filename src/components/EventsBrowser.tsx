"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "cn";

import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import type { CommunityEvent } from "@/lib/events";

interface EventsBrowserProps {
  events: CommunityEvent[];
}

export default function EventsBrowser({ events }: EventsBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(events.map((event) => event.type)))],
    [events],
  );
  console.log(events, 'event allll');

  const visibleEvents = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      if (activeType !== "All" && event.type !== activeType) return false;
      if (!needle) return true;
      return `${event.title} ${event.location} ${event.description} ${event.type}`
        .toLowerCase()
        .includes(needle);
    });
  }, [events, activeType, query]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-20 sm:px-6">
      {/* Filters + search */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = category === activeType;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveType(category)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-teal-300 hover:text-teal-700",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events or area..."
            aria-label="Search events or area"
            className="h-9 rounded-full pr-4 pl-9"
          />
        </div>
      </div>

      {/* Results */}
      {visibleEvents.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <Search className="size-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            {events.length === 0
              ? "No upcoming drives yet"
              : "No events match your search"}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {events.length === 0
              ? "Check back soon — verified organizers are always adding new community initiatives."
              : "Try a different keyword or clear the filters to see every upcoming drive."}
          </p>
          {query || activeType !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveType("All");
              }}
              className="mt-1 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
