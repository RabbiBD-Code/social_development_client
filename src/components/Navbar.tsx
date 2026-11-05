"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  ChevronUp,
  CircleCheck,
  CirclePlus,
  HandHeart,
  LogOut,
  Moon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";

const user = {
  name: "Rafi Ahmed",
  email: "rafi@seba.org",
};

function handleToggleTheme() {
  document.documentElement.classList.toggle("dark");
}

/**
 * The centre nav link reads `usePathname()`, which is URL data that isn't
 * known while prerendering a dynamic route such as `/upcoming-events/[id]`.
 * Keeping the read in its own leaf lets the rest of the header prerender.
 */
function EventsNavLinkShell({ isActive }: { isActive: boolean }) {
  return (
    <Link
      href="/events"
      className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-sm font-semibold transition-colors md:flex ${
        isActive ? "text-teal-700" : "text-teal-600 hover:text-teal-700"
      }`}
    >
      <CalendarDays className="size-4" />
      Upcoming Events
    </Link>
  );
}

function EventsNavLink() {
  const pathname = usePathname();
  return <EventsNavLinkShell isActive={pathname === "/upcoming-events"} />;
}

export default function Navbar() {
  const router = useRouter();

   const { data: session, isPending, error } =
    authClient.useSession();

  const user = session?.user;

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleSignOut = () =>{
    authClient.signOut()
    router.push('/')
  }
  console.log(user, "user login");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm">
            <HandHeart className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold text-teal-600">Seba</span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              Social Development
            </span>
          </span>
        </Link>

        {/* Primary nav */}
        <Suspense fallback={<EventsNavLinkShell isActive={false} />}>
          <EventsNavLink />
        </Suspense>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="rounded-full text-teal-600 hover:bg-teal-50"
            onClick={handleToggleTheme}
          >
            <Moon className="size-4" />
          </Button>

          {
            user?  <DropdownMenu >
            <DropdownMenuTrigger
              aria-label="Open user menu"
              className="flex items-center gap-1 rounded-full p-0.5 outline-none hover:bg-muted aria-expanded:bg-muted"
            >
              <Avatar>
                <AvatarImage src={user?.image || undefined} alt={user?.name?? "user"}/>
                <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <ChevronUp className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="gap-2.5 py-1.5"
                  onClick={() => router.push("/create-events")}
                >
                  <CirclePlus className="size-4 text-teal-600" />
                  Create Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2.5 py-1.5"
                  onClick={() => router.push("/manage")}
                >
                  <Settings className="size-4 text-teal-600" />
                  Manage Events
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2.5 py-1.5"
                  onClick={() => router.push(`/join-event`)}
                >
                  <CircleCheck className="size-4 text-teal-600" />
                  Joined Events
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" className="gap-2.5 py-1.5">
                <Button variant='link' className='w-full' onClick={handleSignOut}> Sign Out</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>:<Link href={'/signin'}>
          <Button>Login</Button>
          </Link>
          
          }
          
        </div>
      </nav>
    </header>
  );
}
