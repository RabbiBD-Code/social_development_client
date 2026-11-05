
import { connection } from "next/server";
import EventsBrowser from "@/components/EventsBrowser";
import type { CommunityEvent } from "@/lib/events";

export default async function EventsExplorer() {
  await connection();

  let events: CommunityEvent[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    events = await res.json();

    console.log("Total events fetched:", events.length);
  } catch (error) {
    console.error("Failed to load events:", error);
  }

  return <EventsBrowser events={events} />;
}
