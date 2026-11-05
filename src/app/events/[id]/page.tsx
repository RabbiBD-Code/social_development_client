import { Suspense } from "react";

import EventDetail from "./event-detail";
import EventDetailSkeleton from "./event-detail-skeleton";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * `params` is a promise in Next 16 and must be unwrapped inside a Suspense
 * boundary so the route can still prerender its static shell.
 */
export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <EventDetail params={params} />
    </Suspense>
  );
}
