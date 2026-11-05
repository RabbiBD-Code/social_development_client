import { Camera, Sparkles } from "lucide-react";

type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  /** Grid span classes for the bento-style layout */
  span: string;
};

/**
 * Static showcase of community service photographs — no database fetch.
 * Spans create a bento grid on lg (4 cols): featured tile + smaller tiles.
 */
const photos: GalleryPhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=70",
    alt: "Volunteers packing boxes of donations together",
    caption: "Volunteer packing day — Dhaka",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=70",
    alt: "Hands joining together during a community service event",
    caption: "Hands joined for a cause",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1607827448387-a67db1383b59?auto=format&fit=crop&w=800&q=70",
    alt: "Food boxes being sorted for distribution",
    caption: "Food bank sorting",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=70",
    alt: "Healthcare worker at a free medical camp",
    caption: "Free medical camp",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=70",
    alt: "Volunteers planting tree saplings",
    caption: "Green city tree drive",
    span: "col-span-2 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=70",
    alt: "Group of volunteers cheering together",
    caption: "Team of the month",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=70",
    alt: "Community members cleaning up a public area",
    caption: "Neighbourhood clean-up",
    span: "col-span-1 row-span-1",
  },
];

export default function Gallery() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
            <Camera className="size-3.5" />
            Gallery
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Moments from the field
          </h2>
          <p className="mt-3 text-sm/relaxed text-muted-foreground">
            Photographs from community service events — clean-ups, food drives,
            medical camps and more, powered by volunteers like you.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] lg:auto-rows-[220px] lg:grid-cols-4">
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-muted ${photo.span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static remote photo, arbitrary host */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm">
                  <Sparkles className="size-3" />
                  {photo.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
