import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  CirclePlus,
  HandHeart,
  Moon,
  Shirt,
  Sparkles,
  Sun,
  TreePine,
  Users,
} from "lucide-react";
import Link from "next/link";

const highlights = [
  { icon: Users, label: "18,500+ volunteers mobilized" },
  { icon: Shirt, label: "Winter clothes drives every season" },
  { icon: TreePine, label: "Green city clean-up campaigns" },
  { icon: Moon, label: "Night shelter & food programs" },
];

export default function Banner() {
  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white">
        {/* Decorative pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-teal-400/20 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-teal-50 ring-1 ring-white/20">
              <Sparkles className="size-3.5" />
              Volunteer &amp; Community Action Platform
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Lend a hand.
              <br />
              Change a <span className="text-amber-300">community.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base/relaxed text-teal-50/90">
              Seba connects everyday people with verified social development
              drives — from winter clothes distribution to food banks and city
              clean-ups. Join an upcoming drive near you, or organize one and
              rally volunteers for the causes you care about.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/upcoming-events">
                <Button
                  size="lg"
                  className="h-11 gap-2 bg-white px-6 text-teal-700 hover:bg-teal-50"
                >
                  <CalendarCheck2 className="size-4" />
                  Browse Upcoming Events
                </Button>
              </Link>
              <Link href="/create-events" />
              <Button
                size="lg"
                variant="outline"
                className="h-11 gap-2 border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <CirclePlus className="size-4" />
                Create an Event
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium text-teal-50/90">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2"
                >
                  <item.icon className="size-4 text-amber-300" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration cards */}
          <div className="relative hidden justify-end gap-4 lg:flex">
            <div className="flex flex-col gap-4">
              <div className="w-56 rounded-2xl bg-white p-4 text-slate-900 shadow-xl">
                <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Shirt className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold">
                  Winter Clothes Distribution
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dhaka North • Jan 18
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-teal-100">
                  <div className="h-full w-[78%] rounded-full bg-teal-600" />
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-teal-700">
                  78% — 156 volunteers joined
                </p>
              </div>

              <div className="w-56 translate-x-6 rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/25 backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/15">
                  <Users className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold">Community Clean-Up</p>
                <p className="mt-1 text-xs text-white/70">
                  Dhanmondi Lake • Jan 25
                </p>
              </div>
            </div>

            <div className="mt-10">
              <div className="w-56 rounded-2xl bg-white p-4 text-slate-900 shadow-xl">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Sun className="size-5" />
                </div>
                <p className="mt-3 text-sm font-bold">Food Bank Weekend</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mirpur • Every Saturday
                </p>
                <div className="mt-3 flex -space-x-2">
                  {["A", "K", "M", "S"].map((initial) => (
                    <span
                      key={initial}
                      className="flex size-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white"
                    >
                      {initial}
                    </span>
                  ))}
                  <span className="flex size-7 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700 ring-2 ring-white">
                    +9
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/25 backdrop-blur">
                <HandHeart className="size-8 text-amber-300" />
                <p className="text-sm font-semibold leading-snug">
                  Small acts, big impact — start today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting strip */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 text-center sm:px-6">
          {[
            ["120+", "Active drives"],
            ["12", "Districts covered"],
            ["18.5k", "Volunteers"],
            ["96", "Partner NGOs"],
          ].map(([value, label]) => (
            <div key={label} className="flex min-w-28 flex-col gap-0.5">
              <span className="text-2xl font-extrabold text-teal-600">
                {value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
