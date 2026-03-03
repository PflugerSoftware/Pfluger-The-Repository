# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Repository** is a dual-mode research platform for Pfluger Architects' Research & Benchmarking department. It serves as both a public showcase of research work and an internal management tool for the R&B team. The AI pitch assistant is named "Ezra".

**Technology Stack:**
- React 18 with TypeScript
- Vite build system
- Tailwind CSS v3 with Pfluger brand colors
- Supabase (PostgreSQL + Storage + Edge Functions)
- Mapbox GL JS for 3D interactive mapping
- Recharts for data visualization
- Framer Motion for animations
- Radix UI for accessible components

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:5173)
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=pfluger-the-repo
```

### Deployment

- **Host:** Cloudflare Pages
- **Project name:** `pfluger-the-repo`
- **Production URL:** `repository.pflugerarchitects.com`
- **Preview URL pattern:** `<hash>.pfluger-the-repo-67g.pages.dev`
- **Deploy via CLI:** `wrangler pages deploy dist --project-name=pfluger-the-repo`
- **Requires:** `wrangler` CLI authenticated (`wrangler login` if needed)
- **No auto-deploy on push.** Deploys are manual via CLI after `npm run build`.
- **Rollback:** Cloudflare Pages dashboard > Deployments > select previous deployment > "Rollback to this deploy"
- **Release tagging:** Tag releases before deploying: `git tag v1.x.x && git push origin v1.x.x`

### Database Access

- **Database:** Supabase PostgreSQL
- **Project ref:** `bydkzxqmgsvsnjtafphj`
- **psql connection:** Uses `DATABASE_URL` from `.env` (session pooler)
- **Storage bucket:** `Repository Bucket` (public, files listed via `storage.objects` table)
- **Edge functions:** `supabase/functions/claude/` (Anthropic proxy), `supabase/functions/web-search/`
- **Env vars (in `.env.local`, gitignored):**
  - Client-side (VITE_ prefix): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MAPBOX_TOKEN`
  - Server-side only (no VITE_ prefix): `DATABASE_URL`, `ANTHROPIC_API_KEY`, `OPENASSET_BASE_URL`, `OPENASSET_TOKEN_ID`, `OPENASSET_TOKEN_STRING`, `SUPABASE_SERVICE_ROLE_KEY`

## Application Architecture

### Dual-Mode System

The Repository operates in two modes controlled by authentication state:

**Public Mode (Default - No Login Required):**
- Research Campus (Map) - Interactive map of all projects
- Gallery - Showcase of completed research
- Collaborate - Contact form for partnerships

**Internal Mode (Pfluger Team Only - Login Required):**
- All public features PLUS:
- Research Hub - Dashboard with metrics
- Submit Pitch - Internal research proposal form
- Analytics - Detailed insights and KPIs

### Authentication Flow

Authentication uses **Supabase Auth** (server-side JWT sessions), managed through `AuthContext.tsx`:
- Users sign in with email + password via `supabase.auth.signInWithPassword()`
- Supabase Auth handles password hashing, JWT issuance, and session management
- Session persisted via Supabase (httpOnly cookies/localStorage managed by the SDK)
- Access tokens auto-refresh (~1hr access token, ~7 days refresh token)
- On login, user profile (name, role, office) fetched from `users` table
- `auth.uid()` in Supabase matches `users.id` (same UUID), enabling RLS policies
- Admin account: `software@pflugerarchitects.com` (Dev User), all others are researchers
- 17 users across Austin, San Antonio, and Dallas offices
- Login page at `/login`, accessed via "Team Sign In" button
- Upon login, internal views appear in navigation
- RLS policies enforce access: public tables readable by anyone, internal tables require auth
- Migration script: `scripts/migrate-to-supabase-auth.ts` (requires `SUPABASE_SERVICE_ROLE_KEY`)
- RLS policies: `scripts/apply-rls-policies.sql`
- Will migrate to Azure SSO in the future

### Data Architecture

**Supabase-Based Data:**
- All project data lives in the Supabase `projects` table
- Project dashboard content lives in the `project_blocks` table (see Block System below)
- Loaded via `loadProjects.ts` (project list) and `services/projects.ts` (block configs)
- Global state managed through `ProjectsContext`
- `is_confidential = true` projects are excluded from public views

**Data Models:**
- `ResearchProject` interface (src/data/loadProjects.ts)
- `id`: Unique identifier (format: X[YY]-RB[NN], e.g. X26-RB01)
- `title`: Project name
- `researcher`: From `PROJECT_METADATA` in `src/services/projects.ts`
- `category`: Research category (psychology, sustainability, etc.)
- `phase`: Pre-Research | Developmental | Completed
- `description`: Project summary
- `position`: [latitude, longitude] tuple from Supabase
- `startDate` / `completionDate`: Date strings from Supabase
- `image_url`: Optional card thumbnail (Supabase Storage URL)
- `slug`: Optional short URL identifier (e.g. `MidlandFFE`)

### Block System

Project dashboards are built from composable blocks stored in the `project_blocks` Supabase table. Each block has a `block_type`, `block_order`, and `data` (JSONB).

**How it works:**
1. `services/projects.ts` — `getProjectConfig()` fetches blocks from Supabase and merges with `PROJECT_METADATA`
2. `components/blocks/BlockRenderer.tsx` — routes each block type to its component
3. `components/blocks/types.ts` — TypeScript interfaces for all block types and data shapes
4. `views/projects/DynamicProjectDashboard.tsx` — loads config and renders `ProjectDashboard`

**Available block types (21):**
`section`, `stat-grid`, `bar-chart`, `donut-chart`, `line-chart`, `comparison-table`, `image-gallery`, `text-content`, `timeline`, `key-findings`, `sources`, `tool-comparison`, `case-study-card`, `workflow-steps`, `scenario-bar-chart`, `cost-builder`, `survey-rating`, `feedback-summary`, `quotes`, `activity-rings`, `product-options`

**Block data is DB-only** — no block content lives in code. To add/modify blocks, update the `project_blocks` table in Supabase. See `docs/R&B-Adding-a-New-Project.md` for the full guide including all block type JSON schemas.

**RAG fields** on blocks (`summary`, `tags`, `searchable_text`, `conclusions`) power Ezra's AI search.

### Supabase Storage

- **Bucket:** `Repository Bucket` (public)
- **Base URL:** `https://bydkzxqmgsvsnjtafphj.supabase.co/storage/v1/object/public/Repository%20Bucket`
- **Project images:** stored under `projects/[ProjectID]/` (e.g. `projects/X26RB01/x26rb01-chair-1.png`)
- **Naming convention:** `[project-prefix]-[descriptive-name].[ext]` (lowercase, hyphens)
- **Config:** `src/config/storage.ts` — `getStorageUrl()` transforms local paths to Supabase URLs
- **Usage:** Block data can reference images as full URLs (pass-through) or local paths (transformed by `getStorageUrl`)

### Component Organization

**System/** - Core infrastructure
- `ThemeManager.tsx` - Pfluger brand colors and theme utilities
- `AuthContext.tsx` - Authentication state management
- `LoginModal.tsx` - Login UI component

**Views/** - Top-level page components
- `ResearchMap.tsx` - Main map view with Leaflet
- `Portfolio.tsx` - Gallery of completed projects
- `Collaborate.tsx` - Public contact form
- `Dashboard.tsx` - Internal hub (requires auth)
- `PitchSubmission.tsx` - Internal pitch form (requires auth)
- `Analytics.tsx` - Internal metrics (requires auth)

**Context/** - Global state
- `ProjectsContext.tsx` - Research projects state provider

**Data/** - Data loading
- `loadProjects.ts` - Supabase project loader

### Key Design Patterns

**Theme System:**
All colors are centralized in `ThemeManager.tsx` to match Pfluger brand:
- `APP_COLORS` - Pfluger primary and secondary palette
- `RESEARCH_CATEGORY_COLORS` - Category-specific colors with icons
- `DARK_THEME` - Material Design dark theme (#121212)
- `getPhaseColor()` - Adjust brightness based on project phase
- `getResearchCategoryColor()` - Get category styling

**Research Categories:**
Each category has dedicated color and Lucide icon:
- Psychology: Brick Red (#9A3324), Brain icon
- Health & Safety: Salmon (#f16555), Heart icon
- Sustainability: Olive Green (#67823A), Sprout icon
- Immersive Learning: Sky Blue (#00A9E0), Monitor icon
- Campus Life: Chartreuse (#B5BD00), Home icon
- Fine Arts: Orange (#F2A900), Palette icon

**Map Markers:**
- Custom circular icons with category colors
- Lucide SVG icons embedded in markers
- 3D effect with inner drop shadows
- Consistent 36px size
- Confidential projects (RB09, RB10, RB11) use gray with lock icon

**Authentication Pattern:**
```typescript
// AuthContext provides user with id, username, name, role
const { user, isAuthenticated, login, logout } = useAuth();
// user.id is the Supabase Auth UUID (same as users.id in the DB)
// Protected routes use <ProtectedRoute> wrapper
// Supabase client auto-includes JWT in all requests when logged in
```

**Project Loading:**
```typescript
// Project list loaded on mount via Context
const { projects, loading } = useProjects();

// Project dashboard config (blocks from Supabase)
const config = await getProjectConfig('X26-RB01');
```

### Important File Paths

```
src/
├── App.tsx                              # Main app with navigation
├── main.tsx                             # Vite entry point
├── components/
│   ├── System/
│   │   ├── ThemeManager.tsx             # Theme colors & utilities
│   │   ├── AuthContext.tsx              # Auth state
│   │   └── LoginModal.tsx               # Login UI
│   ├── blocks/                          # Block system components
│   │   ├── types.ts                     # All block type interfaces
│   │   ├── BlockRenderer.tsx            # Routes block_type → component
│   │   ├── ProductOptionsBlock.tsx      # Product showcase cards
│   │   ├── ImageGalleryBlock.tsx        # Image grid with lightbox
│   │   ├── FeedbackSummaryBlock.tsx     # Positive/negative themes
│   │   └── ...                          # 17 more block components
│   └── ui/                              # Radix UI primitives
├── views/
│   ├── Campus/ResearchMap.tsx           # Main map view
│   ├── Explore/Portfolio.tsx            # Gallery of projects
│   ├── Contact/Collaborate.tsx          # Contact form
│   ├── Dashboard.tsx                    # Internal hub
│   ├── Pitch/PitchSubmission.tsx        # Internal pitch
│   ├── Analytics.tsx                    # Internal metrics
│   └── projects/
│       ├── ProjectDashboard.tsx         # Block-based project view
│       └── DynamicProjectDashboard.tsx  # Loads config from Supabase
├── services/
│   └── projects.ts                      # PROJECT_METADATA + block loader
├── config/
│   ├── supabase.ts                      # Supabase client
│   ├── storage.ts                       # getStorageUrl() helper
│   └── mapbox.ts                        # Mapbox access token
├── data/
│   └── loadProjects.ts                  # Supabase project list loader
├── context/
│   └── ProjectsContext.tsx              # Global project state
└── styles/
    └── index.css                        # Global styles

tailwind.config.js                       # Pfluger brand colors
vite.config.ts                           # Vite configuration
```

### Map Integration

The Research Campus map (ResearchMap.tsx) uses Mapbox GL JS with:
- Mapbox Standard Night style with 3D buildings
- Mercator projection for fast loading
- Default Mapbox pin markers colored by category
- Smooth flyTo animations on marker/project click
- Search and filter functionality
- Interactive project list and detail panel

**3D Map Features:**
- Initial pitch: 30° for 3D perspective view
- Click zoom: 11 with 45° pitch for optimal project viewing
- Zoom range: 3 (min) to 18 (max)
- Built-in 3D building extrusions from Standard Night style
- Smooth 2-second flyTo animations
- Antialias enabled for smooth 3D rendering

**Map Configuration:**
- Mapbox access token stored in `src/config/mapbox.ts`
- Free tier: 50,000 map loads per month
- Default center: Austin, Texas (-97.7431, 30.2672)
- Projection: Mercator (disables globe for faster loading)
- POI labels and street names hidden for cleaner appearance

**Map Features:**
- Full-height left sidebar (80-width) with:
  - Search box for filtering by title/researcher
  - Category dropdown filter
  - Scrollable project list
  - Color-coded legend
- Project detail panel (96-width) slides in from left showing:
  - Project title, ID, researcher
  - Phase badge
  - Description
  - Timeline (start/completion dates)
  - Research partners
- Default Mapbox pin markers:
  - Colored by research category
  - Scale: 1 (full size)
  - Popups on hover with title and ID
  - Click to open detail panel and fly to location
- Confidential projects (RB09, RB10, RB11):
  - Gray markers (#666666)
  - Special styling in detail panel
  - Lock icon indicator

### Confidential Projects

Projects X25-RB09, X25-RB10, and X25-RB11 are marked confidential:
- Gray gradient background
- Dashed border
- Lock icon instead of category icon
- "CONFIDENTIAL" badge in lists
- Special styling in detail panels

### Color System

**Pfluger Brand Palette:**
```typescript
primary: {
  brick: '#9A3324',
  black: '#000000',
  mediumGray: '#707372',
  lightGray: '#C7C9C7',
  white: '#FFFFFF'
}

secondary: {
  darkBlue: '#003C71',
  skyBlue: '#00A9E0',      // Primary accent
  oliveGreen: '#67823A',
  chartreuse: '#B5BD00',
  orange: '#F2A900',
  salmon: '#f16555'
}
```

**Dark Theme:**
- Background: `#121212` (Material Design)
- Cards: `#1e1e1e`
- Borders: `#2a2a2a`
- Accent: Sky Blue `#00A9E0`

### Working with Authentication

To test both modes:
1. **Public Mode**: Visit app without logging in
2. **Internal Mode**: Click "Team Sign In" at `/login`, use any email from the `users` table + password `123456Softwares!`
3. **Admin Mode**: Use `software@pflugerarchitects.com` + same password

Authentication is handled by Supabase Auth. The Supabase JS client automatically includes the JWT in all requests when a session exists. RLS policies on all tables enforce access control server-side.

When implementing features:
- Use `useAuth()` hook to check `isAuthenticated` and get `user` (with `id`, `username`, `name`, `role`)
- `user.id` is the Supabase Auth UUID, same as `users.id` in the database
- Use `<ProtectedRoute>` wrapper for auth-required routes
- RLS policies enforce data access server-side. No need for client-side data filtering for security.
- Edge functions should verify the JWT from the `Authorization` header for authenticated endpoints

### Project Data Updates

To add/modify research projects, update the Supabase `projects` and `project_blocks` tables. See `docs/R&B-Adding-a-New-Project.md` for the full guide including schema, all 21 block type JSON schemas, valid field values, RAG fields, and SQL templates.

### Future Enhancements (Planned)

1. **Interactive Network Visualization**
   - Click project to show connections
   - Lines show shared researchers, partners, categories
   - "Show All Connections" toggle
   - Color-coded relationship types

2. **Advanced Analytics**
   - Research impact metrics
   - Publication tracking
   - Collaboration network graphs
   - Time-series visualizations

3. **Azure SSO**
   - Replace hardcoded auth with Azure SSO integration

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Leverage ThemeManager for all colors (no hardcoded colors)
- Use Lucide icons consistently
- Prefer Framer Motion for animations

### Component Patterns
- Functional components with hooks
- Props interfaces defined with TypeScript
- Use React Context for global state
- Lazy load heavy components when needed

### Styling
- Tailwind utility classes preferred
- Use theme colors from ThemeManager
- Material Design dark theme principles
- Responsive design (mobile-first)

### Performance
- React.memo for expensive components
- useMemo/useCallback for optimization
- Lazy loading for routes
- Code splitting where appropriate

## CI/CD

- **GitHub Actions:** `.github/workflows/ci.yml` runs `tsc --noEmit` and `npm run build` on every push to `main` and on PRs
- **No auto-deploy.** CI validates the build. Deploy remains manual via `wrangler pages deploy dist`.

## Database Migrations

- **Directory:** `supabase/migrations/`
- **Baseline:** Not yet captured. Run `supabase login && supabase link --project-ref bydkzxqmgsvsnjtafphj && supabase db pull` to capture current schema as baseline.
- **New migrations:** `supabase migration new <name>`, then edit the generated SQL file
- **Apply:** Migrations run automatically on `supabase db push`

## Dev vs. Production Database

- **Current state:** Dev and prod share the same Supabase project (`bydkzxqmgsvsnjtafphj`)
- **Planned:** Create a separate Supabase project for development
- **When created:** Add dev credentials to `.env.development.local`, keep prod in `.env.local`
- **Vite auto-loads** `.env.development.local` in dev mode and `.env.local` in production builds

## Known Limitations

- Authentication uses Supabase Auth with shared password (Azure SSO migration planned)
- Edge functions do not yet verify JWT (auth check planned for post-migration)
- No file upload functionality in-app (images uploaded directly to Supabase Storage)
- Export features not implemented
- Project connections are currently hardcoded arrays (being reimplemented)

## Testing

Currently no automated tests. Manual testing checklist:
- [ ] Public mode displays correctly
- [ ] Login flow works
- [ ] Internal views appear after login
- [ ] Map loads projects correctly
- [ ] Filters work on map
- [ ] Gallery shows completed projects
- [ ] Collaborate form submits
- [ ] Sign out returns to public mode

## Contact

For questions about The Repository development, contact the Pfluger Architects Research & Benchmarking team.
