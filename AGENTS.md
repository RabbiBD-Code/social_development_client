<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Single Next.js 16.4.3 app (App Router under `src/app`). React 19.3 with the React Compiler enabled. UI: Tailwind CSS v4 + shadcn/ui (`base-nova` style) on Base UI primitives. No monorepo.

Routes: `/`, `/signin`, `/signup`, `/events`, `/events/[id]`, `/create-events`, plus `/api/auth/[...all]` (better-auth handler).

## Commands

- `npm run dev` — Turbopack dev server
- `npm run lint` — ESLint CLI (flat config). `next lint` was removed in Next 16 and `next build` does **not** run ESLint, so lint is always a separate step
- `npx tsc --noEmit` — typecheck (there is no `typecheck` script)
- `npm run build` — production build (runs the TypeScript check, not lint; compiles fine, then fails on TS errors)

Verify with: `npm run lint` → `npx tsc --noEmit` → `npm run build`.

**Both checks currently fail on pre-existing code — your change did not break them:**

- `npm run lint` exits 1: 2 errors (`react-hooks/set-state-in-effect`) in vendored `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`, plus 6 unused-var warnings in `src/app/events/[id]/event-detail.tsx` and `src/app/events/[id]/_components/JoinEvent.tsx`. Do not edit generated `src/components/ui/**` files just to make lint pass.
- `npx tsc --noEmit` (and the build's TS check) fails with 2 implicit-`any` errors in `src/app/events/[id]/_components/JoinEvent.tsx` (lines 7 and 9).

No test runner, Prettier, or CI workflows exist — don't invent commands or configs for them.

## Runtime prerequisites

- `.env` (gitignored) supplies `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`; Next loads it automatically (`- Environments: .env` in build output). `src/lib/auth.ts` also does `import "dotenv/config"`, but `dotenv` is **not** a declared dependency — it resolves only transitively via `shadcn`. Don't add more dotenv imports.
- Event data comes from a **separate backend hardcoded to `http://localhost:8000`** (not in this repo): `/events`, `/events/:id`, `/add-events`, `/recent-upcoming-events`, `/event/join`. The base URL is duplicated in each consumer file (no shared config), so it must be changed everywhere. `/events`, `/create-events`, and the home-page RecentEvents section need that backend running.
- Auth is only half-wired: signup calls `authClient.signUp.email` (`src/lib/auth-client.ts`); the signin submit handler is fully commented out (UI stub); `src/lib/auth-context.tsx` (`AuthProvider`/`useAuth`) is an unused demo placeholder that is not mounted in the layout (renamed from `auth.tsx` — it shadowed `@/lib/auth`, which must resolve to the server config `src/lib/auth.ts`). Server side is better-auth + MongoDB adapter, DB name hardcoded to `social-develop`.

## Next 16 gotchas

- `cacheComponents: true` + `partialPrefetching: true` (in `next.config.ts`): Partial Prerendering is the only rendering model. Async data in pages/components must be wrapped in Suspense or cached with `"use cache"`; the dev overlay reports the blocking error with labeled fixes.
- React Compiler is on (`reactCompiler: true` via `babel-plugin-react-compiler`). Synchronously calling setState inside an effect body is a lint **error** (`react-hooks/set-state-in-effect`) — subscribe to the external system instead.
- Globals like `LayoutProps<"/">` in `src/app/layout.tsx` are Next 16 generated typed-route types; use them in new layouts/pages.

## UI stack (differs from shadcn defaults)

- shadcn style is `base-nova` (`components.json`): primitives are `@base-ui/react` (Base UI), **not** Radix. Don't convert Base UI imports to Radix.
- Tailwind v4 is CSS-first — there is no `tailwind.config.*`. CSS is wired via the `@tailwindcss/turbopack` loader rule in `next.config.ts`; design tokens live in `src/app/globals.css` (`@import "shadcn/tailwind.css"` + `@theme inline` + `--*` vars). Don't add a Tailwind or PostCSS config.
- `cn` is the `cn` npm package (shadcn's drop-in clsx + tailwind-merge replacement): `import { cn } from "cn"` or `from "@/lib/utils"`. `clsx`/`tailwind-merge` are not installed.
- `src/components/ui/**` is vendored shadcn output — treat it as app code and edit directly. Add new components with `npx shadcn add <name>`. Path alias `@/*` → `./src/*`.
- `src/lib/highlighter.tsx` (shiki singleton) + `src/hooks/use-highlighted-code.ts` are a self-contained pair with no current consumers — reuse them for syntax highlighting instead of adding another highlighter.
