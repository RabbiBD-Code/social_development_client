import { AtSign, Camera, Mail, MessageCircle, Video } from "lucide-react";
import Link from "next/link";

/**
 * Site footer — mounted in the root layout below <main>.
 * Server component: no client state, icons are imported directly.
 */
const socialLinks = [
  { label: "Email us", href: "mailto:hello@seba.org", icon: Mail },
  // Placeholder hrefs — swap in the real profile URLs once they exist.
  { label: "Facebook", href: "#", icon: MessageCircle },
  { label: "Instagram", href: "#", icon: Camera },
  { label: "X (Twitter)", href: "#", icon: AtSign },
  { label: "YouTube", href: "#", icon: Video },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          {/* Account links */}
          <nav
            aria-label="Account"
            className="flex items-center gap-5 text-sm font-semibold"
          >
            <Link
              href="/signin"
              className="text-teal-600 transition-colors hover:text-teal-700"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-teal-600 transition-colors hover:text-teal-700"
            >
              Sign up
            </Link>
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-1.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full text-teal-600 transition-colors outline-none hover:bg-teal-50 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground">
           © 2026 Seba — Social Development Events. All rights reserved. Seba — Social Development Events. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
