# Caption Genius

Caption Genius is a Next.js app for generating social-media captions with configurable tone and style preferences.

## Tech Stack
- Next.js (App Router) + React + TypeScript
- Supabase (auth + data)
- OpenAI API (caption generation)
- Tailwind CSS

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an environment file (`.env.local`) with the required values:
   ```env
   OPENAI_API_KEY=...
   OPENAI_MODEL=gpt-4o-mini
   DAILY_CAPTION_LIMIT=30

   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Start development:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint on `src`

## Project Structure
The codebase is organized by runtime boundary first (`app`, `components`, `lib`, `services`), then by domain.

```text
src/
├─ app/                    # Routes, layouts, providers, API handlers
│  ├─ api/
│  │  ├─ auth/             # Auth route handlers
│  │  └─ generate-caption/ # Caption generation endpoint
│  └─ */page.tsx           # Route pages (dashboard, caption, etc.)
├─ components/
│  ├─ ui/                  # Shared primitive components
│  ├─ layout/              # Header/Footer and layout-level UI
│  └─ dashboard/           # Dashboard-specific components
├─ data/                   # Static app data/config used by views
├─ features/               # Feature-scoped hooks/helpers
├─ lib/
│  ├─ supabase/            # Supabase client/server helpers
│  ├─ validation/          # Input/data validation logic
│  └─ utils/               # Generic utility helpers
├─ services/               # External service wrappers (OpenAI)
└─ types/                  # Shared TypeScript declarations
```

## Navigation & Maintainability Guidelines
To keep this repository easy to navigate:

- **Route code stays in `src/app`**: keep page-level orchestration in route files and move reusable logic outward.
- **UI primitives in `components/ui` only**: domain-specific UI should live in a feature folder (`dashboard`, etc.).
- **Server/client integrations isolated**: Supabase helpers in `lib/supabase`; third-party API wrappers in `services`.
- **Validation close to shared libs**: schema/guard logic belongs in `lib/validation` so APIs and pages can reuse it.
- **Feature hooks under `features/<feature>/hooks`**: keeps hook ownership obvious.

## Recommended Placement for New Code
- New route/API: `src/app/...`
- New reusable component: `src/components/ui/...`
- New feature-specific component: `src/components/<feature>/...`
- New service integration: `src/services/...`
- New shared utility/type: `src/lib/...` or `src/types/...`

## Current Test Status
There are currently no dedicated test files (`*.test.*` / `*.spec.*`) in this repository. If tests are added, prefer colocating them near the feature they validate.
