# The Repo - Research Platform

**The Repo** is Pfluger Architects' Research & Benchmarking platform. It serves as both a public showcase of research work and an internal management tool for the R&B team.

## Overview

The platform serves two audiences:
- **Public Mode**: Showcase research portfolio to school districts, partners, and the public
- **Internal Mode**: Research management tools for Pfluger team members (login required)

## Technology Stack

- **React 18** with TypeScript
- **Vite** - Build tooling
- **Tailwind CSS v3** - Styling with custom dark theme
- **Mapbox GL JS** - 3D interactive mapping
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **PapaParse** - CSV data parsing

## Features

### Navigation

The app uses a centered top navigation bar with expandable mega-menu dropdowns:

- **Campus** - Interactive map of research projects by office location
- **Explore** - Portfolio of research work organized by year
- **Dashboard** (internal) - Project management, schedule, contacts
- **Pitch** (internal) - Submit and manage research proposals
- **Connect** - Contact form for partnership inquiries
- **About** - Information about the R&B department

### About Section

- **Research & Benchmarking** - Department overview and team
- **Our Process** - Six-step research methodology
- **Our Tools** - Software and custom tools used
- **Use of AI** - Transparency about AI in research
- **Sources & Citations** - APA formatting standards

### Research Campus Map

- Floating glassmorphism sidebar
- Projects organized by office (Austin, Corpus Christi, etc.)
- Search functionality
- Project detail panel with dashboard links

### Team

- Alexander Wickes, RA, LEED BD+C - Design Performance Leader, Research
- Christian Owens, AIA - Director of Design
- Brenda Swirczynski, MSc, ALEP - Education Facilities Planner

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

## Authentication

For internal team members, click the login icon in the top navigation:
- Email: `apps@pflugerarchitects.com`
- Password: `123456`

*Note: Hardcoded for development. Production will use proper authentication.*

## Project Structure

```
src/
├── components/
│   ├── Navigation/
│   │   └── TopNavbar.tsx           # Main navigation bar
│   ├── System/
│   │   ├── ThemeManager.tsx        # Theme colors & utilities
│   │   └── AuthContext.tsx         # Authentication state
│   ├── blocks/                     # Block system components
│   │   ├── BlockRenderer.tsx       # Renders blocks by type
│   │   ├── types.ts                # Block type definitions
│   │   └── *Block.tsx              # Individual block components
│   └── ui/                         # Radix UI components
├── views/
│   ├── Home.tsx                    # Landing page with carousel
│   ├── Campus/ResearchMap.tsx      # Interactive map
│   ├── Explore/Portfolio.tsx       # Research gallery by year
│   ├── Connect/Collaborate.tsx     # Contact page
│   ├── Repo/                       # Internal dashboard views
│   ├── About/                      # About section views
│   └── projects/
│       └── ProjectDashboard.tsx    # Project detail overlay
├── data/
│   ├── loadProjects.ts             # CSV data loader
│   └── projects/                   # Project configurations
│       ├── X24RB01-immersive/      # 2024 projects
│       ├── X25RB01-sanctuary/      # 2025 projects
│       └── X00-block-showcase/     # Block demo project
├── context/
│   └── ProjectsContext.tsx         # Global project state
public/
└── data/
    └── research_projects.csv       # Research project data
```

## Block System

Project dashboards use a composable block system. Each project has a config file defining its content using typed blocks.

### Available Blocks (21 types)

| Block | Purpose |
|-------|---------|
| `section` | Section divider with title and optional source refs |
| `text-content` | Markdown-like text with headers, bullets, bold |
| `stat-grid` | Grid of key metrics with trends |
| `key-findings` | Icon-based findings cards |
| `bar-chart` | Horizontal bars (simple, grouped, multi-bar) |
| `donut-chart` | Circular chart with center label |
| `comparison-table` | Side-by-side feature comparison |
| `image-gallery` | Responsive image grid with lightbox |
| `timeline` | Project timeline (horizontal/vertical) |
| `workflow-steps` | Process steps with findings/deliverables |
| `case-study-card` | Scrollable project cards with detail modals |
| `tool-comparison` | Rating rings with pros/cons |
| `scenario-bar-chart` | Cost scenario comparison |
| `cost-builder` | Interactive budget builder with toggles |
| `survey-rating` | 1-5 star rating distribution |
| `feedback-summary` | Positive/negative theme analysis |
| `quotes` | Testimonial cards |
| `activity-rings` | Apple-style concentric rings |
| `product-options` | Product lines with pricing/specs |
| `sources` | Citation list |

### Creating a Project Dashboard

1. Create folder: `src/data/projects/[ID]-[name]/project/`
2. Create config: `[name]Config.ts`
3. Define `ProjectConfig` with blocks array
4. Import in `App.tsx` and add to `openProject()` switch
5. Add to `PROJECTS_WITH_DASHBOARDS` in Portfolio.tsx

### Block Showcase

View all blocks in action: Open the X00-DEMO project from the Portfolio page.

## Current Projects

### 2024
- **X24-RB01** - Immersive Learning (GPISD immersive technology research)

### 2025
- **X25-RB01** - Sanctuary Spaces (Psychology of sanctuary spaces in schools)
- **X25-RB02** - Modulizer Part 2 (Flour Bluff CTE design iterations)
- **X25-RB03** - A4LE Design Awards (Design award submissions)
- **X25-RB05** - Mass Timber (Psychological effects of timber in buildings)
- **X25-RB06** - Timberlyne Study (Mass timber design assist)
- **X25-RB08** - Modulizer Part 1 (Energy and massing strategies)
- **X25-RB13** - Modulizer Part 3 (Design concept survey analysis)

### 2026
- **X26-RB03** - Gyp Concrete (Material usage and life cycle impacts)

## Data Management

Research projects are stored in `/public/data/research_projects.csv`:

| Field | Description |
|-------|-------------|
| `id` | Project identifier (e.g., X25-RB01) |
| `title` | Project name |
| `researcher` | Lead researchers (comma-separated) |
| `category` | Research category |
| `phase` | Pre-Research, Developmental, or Completed |
| `description` | Project summary |
| `latitude` / `longitude` | Map coordinates |
| `partners` | Collaborating organizations (pipe-separated) |
| `startDate` / `completionDate` | Project timeline |
| `office` | Office location (Austin, Corpus Christi, etc.) |

## Theme & Design

The app uses an Apple-inspired dark theme with glassmorphism effects:

**Colors:**
- Background: `#181019` (deep purple)
- Cards: `#221a28`
- Borders: `#2d2435`

**Typography:**
- SF Pro system font stack

**UI Patterns:**
- Floating glassmorphism panels with backdrop blur
- White pill buttons for primary actions
- Minimal, clean layouts
- Smooth Framer Motion animations

## Research Categories

Each category has a dedicated color:
- **Psychology** - Brick Red `#9A3324`
- **Health & Safety** - Salmon `#f16555`
- **Sustainability** - Olive Green `#67823A`
- **Immersive Learning** - Sky Blue `#00A9E0`
- **Campus Life** - Chartreuse `#B5BD00`
- **Fine Arts** - Orange `#F2A900`

## Tools

### Software
- Custom Development (React, Python, D3.js, Mapbox, APIs)
- Revit
- Rhino + Grasshopper
- Enscape
- ArcGIS
- Qualtrics

### Custom Tools
- The Repo (this platform)
- Modulizer
- POE Dashboard (in development)
- Region Intel (in development)

## Production Roadmap

### Critical Priority

- [ ] **SSO Authentication** - Replace hardcoded credentials with Pfluger SSO
  - Current: Hardcoded `apps@pflugerarchitects.com` / `123456` in `AuthContext.tsx`
  - Integrate Microsoft Entra ID (Azure AD) for Pfluger accounts
  - Add role-based permissions (Admin, Researcher, Viewer)
  - Session management and token refresh

- [ ] **Database Integration (Cloudflare D1)**
  - Pitch submissions storage and retrieval
  - User preferences and saved states
  - Research hours tracking (currently mock data in `Schedule.tsx`)
  - GreenLit topics management

- [ ] **Form Backend & Notifications**
  - Collaborate form: Connect to Zapier or Resend for email notifications
  - Pitch submission: Store in D1, notify GreenLight team
  - Email templates for submission confirmations
  - Slack/Teams webhook for internal alerts

### High Priority

- [ ] **Claude AI Integration** - Replace mock chat in `TheRepo.tsx`
  - Current: Rule-based pattern matching, no real AI
  - Integrate Claude API for research assistant
  - Context-aware responses using project data
  - RAG with research documents

- [ ] **Asset Management**
  - Replace Unsplash placeholder images with real project photos
  - Files affected: `ImageCarousel.tsx`, `loadProjects.ts`, project configs
  - Set up Cloudflare R2 or similar for image hosting
  - Add image upload for project managers

- [ ] **OpenAsset Integration**
  - Connect to Pfluger's OpenAsset DAM
  - Pull project images automatically
  - Sync with project metadata

### Medium Priority

- [ ] **Audit Project Sources**
  - Verify all project configs have complete sources blocks
  - Check URLs are valid and not broken
  - Ensure APA formatting consistency
  - Add missing citations for referenced content

- [ ] **Data Tables & Grids**
  - Add sortable/filterable data tables for project lists
  - Export to CSV/Excel functionality
  - Bulk operations for project management

- [ ] **Real Hours Tracking**
  - Replace mock data in `Schedule.tsx` (lines 70-84)
  - Time entry interface for researchers
  - Integration with project management tools
  - Burndown charts and capacity planning

- [ ] **Pitch System Enhancements**
  - Replace hardcoded GreenLit topics with D1 data
  - Replace MY_PITCHES mock data (lines 93-123)
  - Pitch review workflow for admins
  - Status updates and notifications

- [ ] **Analytics Dashboard**
  - Real metrics instead of placeholder stats
  - Research impact tracking
  - Publication and citation metrics
  - Partner engagement analytics

### Low Priority

- [ ] **Remove Demo Content**
  - Option to hide X00-DEMO from production
  - Environment-based feature flags
  - Separate dev/staging/prod configs

- [ ] **Production Logging**
  - Replace console.log/error with proper logging service
  - Error tracking (Sentry or similar)
  - Performance monitoring

- [ ] **PWA Features**
  - Offline support for field research
  - Push notifications for updates
  - Mobile-optimized views

### Technical Debt

| File | Issue | Line(s) |
|------|-------|---------|
| `AuthContext.tsx` | Hardcoded credentials | 17-19, 40 |
| `TopNavbar.tsx` | Auto-login hardcoded | 148 |
| `Collaborate.tsx` | Simulated form submission | 16-31 |
| `PitchSubmission.tsx` | Console.log + alert() | 215-235 |
| `PitchSubmission.tsx` | Hardcoded GreenLit topics | 49-90 |
| `PitchSubmission.tsx` | Mock MY_PITCHES data | 93-123 |
| `Schedule.tsx` | Mock hours data | 70-84 |
| `TheRepo.tsx` | Mock AI responses | 89-140 |
| `loadProjects.ts` | Unsplash placeholders | 60-61, 81-91 |
| `ImageCarousel.tsx` | Unsplash hero images | 6, 12, 18, 24 |

## License

Proprietary - Pfluger Architects
