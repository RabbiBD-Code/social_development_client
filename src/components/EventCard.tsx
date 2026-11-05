import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

import {
  categoryStyle,
  formatEventDate,
  type CommunityEvent,
} from "@/lib/events";

interface EventCardProps {
  event: CommunityEvent;
}

/**
 * Shared event card used by the events board and the joined-events list.
 * The root keeps the `group` class so the hover transitions inside still
 * animate when the card is embedded in another component.
 */
export default function EventCard({ event }: EventCardProps) {
  const category = categoryStyle(event.type);
  const formattedDate = formatEventDate(event.date);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg">
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        <span
          className={cn(
            "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
            category.badge,
          )}
        >
          <category.icon className="size-3" />
          {event.type}
        </span>

        {formattedDate ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <CalendarDays className="size-3.5" />
            {formattedDate}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-teal-700">
          {event.title}
        </h3>

        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin
            aria-hidden
            className="mt-px size-3.5 shrink-0 text-teal-500"
          />
          {event.location}
        </p>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        {event.organizer ? (
          <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
            <Users aria-hidden className="size-3.5 text-teal-500" />
            {event.organizer}
          </p>
        ) : null}

        {event._id ? (
          <Link
            href={`/events/${event._id}`}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            View Event
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
