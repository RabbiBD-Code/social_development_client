import {
  CalendarSearch,
  CirclePlus,
  GraduationCap,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: CalendarSearch,
    title: "Discover Upcoming Drives",
    description:
      "Browse verified, future-dated community initiatives — winter clothes distribution, food banks, clean-ups — so you always see only drives you can still join.",
    href: "/upcoming-events",
    linkLabel: "Browse events",
  },
  {
    icon: CirclePlus,
    title: "Create & Publish Events",
    description:
      "Organize a drive in minutes. Add a date, location and description, publish it, and let nearby volunteers discover it on their schedule.",
    href: "/create-events",
    linkLabel: "Create an event",
  },
  {
    icon: Users,
    title: "Volunteer Tracking",
    description:
      "Live join counts and progress bars show how full every drive is, so organizers know when they have enough hands and volunteers know they're needed.",
    href: "/upcoming-events",
    linkLabel: "See progress",
  },
  {
    icon: ListChecks,
    title: "Manage Your Events",
    description:
      "Organizers keep everything in one place — update dates, adjust volunteer needs, or close a drive once it's fully staffed.",
    href: "/create-events",
    linkLabel: "Manage events",
  },
  {
    icon: GraduationCap,
    title: "Personal Volunteering History",
    description:
      "Every drive you join becomes part of your record, making it easy to track the causes you support and share your community impact.",
    href: "/upcoming-events",
    linkLabel: "View your drives",
  },
  {
    icon: ShieldCheck,
    title: "Verified Community Actions",
    description:
      "Submissions are reviewed before they go live, keeping the platform spam-free and ensuring volunteers only meet genuine, trustworthy drives.",
    href: "/create-events",
    linkLabel: "Learn more",
  },
];

export default function Features() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
          Why Seba
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Everything a community drive needs
        </h2>
        <p className="mt-3 text-sm/relaxed text-muted-foreground">
          From finding the cause to gathering the team — Seba keeps the whole
          social development journey in one simple 
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/40"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
              <feature.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 flex-1 text-sm/relaxed text-muted-foreground">
              {feature.description}
            </p>
            <Link
              href={feature.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
            >
              {feature.linkLabel}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
