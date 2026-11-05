import Banner from "@/components/Banner";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import RecentEvents, { RecentEventsSkeleton } from "@/components/RecentEvents";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Banner />
      <Suspense fallback={<RecentEventsSkeleton />}>
        <RecentEvents />
      </Suspense>
      <Features />
      <Gallery />
    </>
  );
}
