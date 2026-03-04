# Comprehensive Codebase Audit: The Repository

## 1. Executive Summary

```
AUDIT SCOPE: The Repository - Dual-mode research platform for Pfluger Architects R&B department
STACK: TypeScript/React 19, Vite 7, Supabase (PostgreSQL + Storage + Edge Functions), Cloudflare Pages
SCALE: 76 source files, ~14,632 lines of code
DATE: 2026-03-03

FINDINGS BY SEVERITY:
  CRITICAL: 7    HIGH: 19    MEDIUM: 25    LOW: 18    INFO: 2

FINDINGS BY DOMAIN:
  Security (Agents 1-3):     28
  Quality (Agents 4-5):      22
  Data (Agent 6):            14
  Operations (Agent 7):      13
  Performance (Agent 8):     17

TOP 5 MOST URGENT:
  1. RLS disabled on all Supabase tables - anyone with the anon key can read/write/delete all data (CRITICAL, Agent 1)
  2. Shared password hardcoded in client-side JavaScript bundle (CRITICAL, Agents 1/3)
  3. VITE_ANTHROPIC_API_KEY embeds the Anthropic secret key in the client bundle (CRITICAL, Agent 3)
  4. 2.5MB single JavaScript bundle with zero code splitting (CRITICAL, Agent 8)
  5. Edge Functions have CORS wildcard (*) and no rate limiting - API credit abuse possible (HIGH, Agents 1/2/3)

POSTURE:
  Security:      RED
  Architecture:  YELLOW
  Code Quality:  YELLOW
  Operations:    RED
  Performance:   RED
```

---

## 2. Critical Path Analysis

### CRIT-01: Supabase Row Level Security Disabled (Agent 1)

**Severity:** CRITICAL
**Files:** All Supabase tables (`users`, `pitches`, `pitch_comments`, `pitch_ai_sessions`, `repo_ai_sessions`, `projects`, `project_blocks`, `user_page_views`)
**Evidence:** SQL schema confirms `ALTER TABLE user_page_views DISABLE ROW LEVEL SECURITY;` and the comment says "using custom auth, not Supabase Auth." Since the Supabase anon key is in the client bundle, anyone can directly query, insert, update, or delete rows in any table.

**Exploitation scenario:** Open browser DevTools, find the Supabase URL and anon key in the JS bundle, then use `curl` or a Supabase client to read all user emails/roles, delete all pitches, modify project data, or escalate roles.

**Remediation:** Enable RLS on every table. At minimum:
- `projects` and `project_blocks`: SELECT for anon, no INSERT/UPDATE/DELETE for anon
- `pitches`, `pitch_comments`, `pitch_ai_sessions`: restrict write operations to authenticated users with ownership checks
- `users`: SELECT for authenticated only, no UPDATE for non-admin
- `user_page_views`: INSERT for anon (analytics), SELECT for authenticated only

**Effort:** 1-2 days
**Dependencies:** Should be done before or alongside proper auth migration

---

### CRIT-02: Shared Password in Client Bundle (Agents 1, 3)

**Severity:** CRITICAL
**File:** `src/components/System/AuthContext.tsx:20`
**Evidence:** `const SHARED_PASSWORD = '123456Softwares!';`

This password ships in the production JavaScript bundle. Anyone can extract it from browser DevTools or the bundled JS file. Combined with disabled RLS, this means authentication provides zero actual protection.

**Remediation:** Move password verification to a Supabase Edge Function. The function receives the password, validates it server-side, and returns a signed token. The password never leaves the server. Longer-term, migrate to Azure SSO.

**Effort:** 0.5-1 day for Edge Function approach
**Dependencies:** None

---

### CRIT-03: Anthropic API Key Exposed via VITE_ Prefix (Agent 3)

**Severity:** CRITICAL
**File:** `.env.local:9`
**Evidence:** `VITE_ANTHROPIC_API_KEY=sk-ant-api03-...` uses the VITE_ prefix. Vite injects ALL `VITE_`-prefixed env vars into the client bundle at build time. While no code currently references it directly, the key is embedded in the built output.

**Remediation:** Rename to `ANTHROPIC_API_KEY` (without VITE_ prefix). The Edge Functions already use `Deno.env.get('ANTHROPIC_API_KEY')` server-side, so the VITE_ version is unnecessary.

**Effort:** 5 minutes
**Dependencies:** None

---

### CRIT-04: No Password Hashing (Agent 1)

**Severity:** CRITICAL
**File:** `src/components/System/AuthContext.tsx:38`
**Evidence:** `if (password !== SHARED_PASSWORD)` -- plaintext string comparison in client-side JavaScript.

**Remediation:** Move to server-side auth with bcrypt/argon2 hashing, or migrate to Azure SSO / Supabase Auth.

**Effort:** Included in CRIT-02 fix
**Dependencies:** CRIT-02

---

### CRIT-05: Authentication is Purely Client-Side (Agent 1)

**Severity:** CRITICAL
**File:** `src/components/System/AuthContext.tsx:36-68`
**Evidence:** The entire auth flow is: (1) check password in JS, (2) look up email in `users` table, (3) store result in localStorage. No session token, no JWT, no server-side session. The Supabase client uses the anon key for all requests regardless of auth state.

**Remediation:** Implement Supabase Auth or an Edge Function that validates credentials and returns a signed JWT. Use RLS policies tied to the authenticated user's identity.

**Effort:** 2-3 days
**Dependencies:** CRIT-01, CRIT-02

---

### CRIT-06: localStorage Auth Trivially Forgeable (Agent 1)

**Severity:** HIGH
**File:** `src/components/System/AuthContext.tsx:28-33`
**Evidence:** Auth state restored from `JSON.parse(localStorage.getItem('ezra-auth'))`. Any user can set `localStorage.setItem('ezra-auth', JSON.stringify({isAuthenticated: true, user: {username: 'software@pflugerarchitects.com', name: 'Dev User', role: 'admin'}}))` to gain full admin access.

**Remediation:** Replace with server-signed JWTs that cannot be forged client-side.

**Effort:** Included in CRIT-05 fix
**Dependencies:** CRIT-05

---

### CRIT-07: 2.5MB Single JavaScript Bundle (Agent 8)

**Severity:** CRITICAL
**File:** `vite.config.ts` (bare minimum config)
**Evidence:** Single JS bundle: 2,513 KB (711 KB gzip). Zero code splitting. All routes, mapbox-gl (~700KB), d3 (~250KB), recharts (~200KB), framer-motion (~150KB), and the Anthropic SDK are loaded eagerly on every page load.

**Remediation:**
1. Route-level code splitting with `React.lazy` and `Suspense`
2. Configure `build.rollupOptions.output.manualChunks` for vendor splitting
3. Replace `import * as d3 from 'd3'` with specific submodule imports
4. Remove unused `@anthropic-ai/sdk` dependency
5. Lazy-load block components in `BlockRenderer.tsx`

**Effort:** 1-2 days
**Dependencies:** None

---

## 3. Consolidated Findings Table

### Security Findings (Agents 1-3)

| ID | Severity | Domain | Summary | File:Line | Remediation | Effort |
|----|----------|--------|---------|-----------|-------------|--------|
| AUTH-01 | CRITICAL | Auth | Hardcoded shared password in client bundle | AuthContext.tsx:20 | Move to server-side Edge Function | 1 day |
| AUTH-02 | CRITICAL | Access | RLS disabled on all Supabase tables | All tables | Enable RLS with appropriate policies | 1-2 days |
| AUTH-03 | CRITICAL | Auth | No password hashing, plaintext comparison | AuthContext.tsx:38 | Use bcrypt/argon2 server-side | With AUTH-01 |
| AUTH-04 | CRITICAL | Auth | Auth is purely client-side, no server verification | AuthContext.tsx:36-68 | Implement Supabase Auth or JWT via Edge Function | 2-3 days |
| S02 | CRITICAL | Secrets | VITE_ANTHROPIC_API_KEY exposes secret in bundle | .env.local:9 | Remove VITE_ prefix | 5 min |
| AUTH-05 | HIGH | Auth | localStorage auth state trivially forgeable | AuthContext.tsx:28-33 | Use server-signed JWTs | With AUTH-04 |
| AUTH-06 | HIGH | Auth | No JSON.parse error handling on localStorage | AuthContext.tsx:30 | Wrap in try/catch | 10 min |
| AUTH-07 | HIGH | Access | Role from users table trusted without verification | AuthContext.tsx:56 | Enable RLS, restrict UPDATE on role column | With AUTH-02 |
| AUTH-08 | HIGH | Access | No ownership validation on delete/update operations | pitchService.ts:350-362,521-533,297-338 | Enable RLS with ownership policies | With AUTH-02 |
| AUTH-09 | HIGH | Secrets | Mapbox token hardcoded in committed source | mapbox.ts:11 | Move to VITE_MAPBOX_TOKEN env var, add URL restrictions | 15 min |
| AUTH-10 | HIGH | Auth | User enumeration via timing differences | AuthContext.tsx:37-51 | Always perform both password check and DB lookup | 30 min |
| S03 | HIGH | Secrets | Supabase anon key hardcoded in committed script | scripts/insert-sanctuary-blocks.js:4 | Use dotenv, read from .env.local | 15 min |
| S04 | HIGH | Secrets | Credentials in .claude/settings.local.json (committed) | .claude/settings.local.json:18-20 | Add to .gitignore, remove from history | 15 min |
| S05 | HIGH | Secrets | Supabase pooler URL in tracked temp file | supabase/.temp/pooler-url:1 | Add supabase/.temp/ to .gitignore | 5 min |
| C01 | HIGH | Config | No security headers for Cloudflare Pages | Missing public/_headers | Create _headers file with CSP, HSTS, etc. | 30 min |
| C02 | HIGH | Config | Edge Function CORS wildcard allows any origin | claude/index.ts:7, web-search/index.ts:7 | Restrict to production domain | 15 min |
| INJ-01 | HIGH | XSS | dangerouslySetInnerHTML with unsanitized content | TextContentBlock.tsx:34,51 | Sanitize with DOMPurify or use React elements | 1 hour |
| INJ-02 | HIGH | Injection | LLM prompt injection in RAG chat | rag.ts:186,242-252 | Add input delimiters, use Anthropic system parameter | 2 hours |
| INJ-03 | HIGH | Injection | LLM prompt injection in Pitch chat | pitchAgent.ts:197-218 | Wrap user content in delimiters, use Messages API properly | 2 hours |
| INJ-04 | HIGH | Injection | Edge Function mixes system/user prompts | claude/index.ts:35 | Use Anthropic API system parameter | 1 hour |
| AUTH-11 | MEDIUM | Auth | No brute-force protection or account lockout | AuthContext.tsx:36-68 | Add rate limiting server-side | 2 hours |
| AUTH-12 | MEDIUM | Auth | No session expiry, localStorage persists forever | AuthContext.tsx:28-34 | Add TTL field, force re-auth after expiry | 1 hour |
| AUTH-14 | MEDIUM | Access | Admin role check is client-side only | PitchSubmission.tsx:188 | Enforce via RLS policies | With AUTH-02 |
| AUTH-15 | MEDIUM | Access | Edge Functions accept requests from any origin | claude/index.ts:7-9, web-search/index.ts:7-9 | Restrict CORS origin | 15 min |
| AUTH-16 | MEDIUM | Access | Edge Functions have no input validation | claude/index.ts:18 | Whitelist models, cap max_tokens | 1 hour |
| INJ-05 | MEDIUM | Injection | ILIKE wildcard characters not escaped | rag.ts:70 | Escape % and _ in search terms | 15 min |
| INJ-07 | MEDIUM | Auth | localStorage auth bypass, no integrity check | AuthContext.tsx:28-33 | Sign auth token or verify server-side | With AUTH-04 |
| INJ-08 | MEDIUM | Config | Open CORS on Edge Functions | claude/index.ts:7, web-search/index.ts:7 | Restrict to production domain | 15 min |
| INJ-09 | MEDIUM | Access | Unvalidated model/token selection on Edge Function | claude/index.ts:18,33-34 | Allowlist models, cap max_tokens | 1 hour |
| INJ-10 | MEDIUM | XSS | AI output URLs rendered as clickable links | TheRepo.tsx:403-407 | Validate URLs against domain allowlist | 1 hour |
| INJ-12 | MEDIUM | Input | No input length limits on any form or chat | Multiple files | Add maxLength to inputs, enforce in service layer | 2 hours |
| S09 | MEDIUM | Secrets | OpenAsset tokens use VITE_ prefix | .env.local:12-14 | Drop VITE_ prefix | 5 min |
| C03 | MEDIUM | XSS | dangerouslySetInnerHTML with regex-processed content | TextContentBlock.tsx:34,51 | Use DOMPurify or react-markdown | 1 hour |
| S10 | LOW | Config | Verbose console.log in production (17 in rag.ts) | rag.ts:36,51,55,etc. | ~~Strip console in prod builds~~ RESOLVED: all console.log removed, console.error kept | 30 min |
| AUTH-17 | LOW | Secrets | Unused VITE_ANTHROPIC_API_KEY reference risk | .env.local:9 | ~~Remove after renaming~~ RESOLVED: already removed from source | 5 min |
| AUTH-19 | LOW | Auth | All 17 users share one password, no accountability | AuthContext.tsx:20 | Migrate to Azure SSO | Planned |
| INJ-06 | HIGH | Auth | Credential exposure in client bundle | AuthContext.tsx:20 | Move server-side | With AUTH-01 |
| INJ-11 | LOW | XSS | Source URLs rendered unvalidated | TheRepo.tsx:432 | ~~Add URL protocol validation~~ RESOLVED: https?:// check added | 15 min |
| S07 | LOW | Secrets | Mapbox public token hardcoded (by design, but no URL restriction) | mapbox.ts:11 | Add URL restrictions on Mapbox dashboard | 15 min |

### Architecture & Quality Findings (Agents 4-5)

| ID | Severity | Domain | Summary | File:Line | Remediation | Effort |
|----|----------|--------|---------|-----------|-------------|--------|
| ARC-01 | HIGH | SRP | PitchSubmission.tsx: 1,490 lines, 19 useState hooks, 9 responsibilities | PitchSubmission.tsx | Decompose into 6+ sub-components + custom hook | 1-2 days |
| ARC-02 | MEDIUM | DRY | callClaude() duplicated in rag.ts and pitchAgent.ts | rag.ts:655, pitchAgent.ts:158 | Extract to shared services/claude.ts | 1 hour |
| ARC-03 | MEDIUM | DRY | getInitials() duplicated in 2 files | PitchSubmission.tsx:165, TopNavbar.tsx:121 | ~~Extract to lib/utils.ts~~ RESOLVED | 15 min |
| ARC-04 | MEDIUM | DRY | PROJECTS_WITH_DASHBOARDS divergent (2 vs 10 entries) | ResearchMap.tsx:13, Portfolio.tsx:5 | ~~**DATA BUG** - unify to single source of truth~~ RESOLVED: both use hasProject() | 30 min |
| ARC-05 | MEDIUM | DRY | Confidential project IDs hardcoded 4 times | ResearchMap.tsx:107,195,251,255 | ~~Use is_confidential flag from DB~~ RESOLVED: dead code removed (loadProjects filters server-side) | 30 min |
| ARC-06 | MEDIUM | Deps | Domain types in components/blocks/types.ts | services/projects.ts imports from components/ | Move to src/types/ or src/models/ | 1 hour |
| ARC-07 | MEDIUM | Deps | AuthContext makes direct Supabase calls | AuthContext.tsx | Extract to services/auth.ts | 30 min |
| ARC-08 | MEDIUM | Arch | Services layer not abstracted from Supabase | All service files | Low priority, acceptable for project scale | Deferred |
| ARC-09 | MEDIUM | Hardcode | Schedule.tsx has 84 lines of hardcoded data | Schedule.tsx:40-84 | Move to database or config | 1 hour |
| CQ-01 | HIGH | Types | BlockConfig has `data: any`, undermines type safety | blocks/types.ts:28 | Convert to discriminated union | 2-3 hours |
| CQ-02 | MEDIUM | Complexity | StackedAreaChart: 180-line useEffect | Schedule.tsx:161-362 | Extract D3 helpers | 1 hour |
| CQ-03 | MEDIUM | Complexity | queryRAG: 3 identical fallback patterns | rag.ts:506-568 | Extract handleFallbackResponse() | 30 min |
| CQ-04 | MEDIUM | DRY | ChatMessage interface defined 3 times | chatHistory.ts:5, ChatPanel.tsx:4, PitchChatPanel.tsx:8 | REVIEWED: interfaces have different shapes per context, no forced unification needed | 15 min |
| CQ-05 | MEDIUM | Consistency | Mixed async patterns (.then vs async/await) | App.tsx, TheRepo.tsx vs PitchSubmission.tsx | Standardize on async/await | 1 hour |
| CQ-06 | MEDIUM | Dead | 9 unused exported functions | pitchService.ts, projects.ts, analytics.ts | Remove dead exports | 15 min |
| CQ-07 | LOW | Dead | Unused onNavigate prop in Dashboard, TheRepo, Home | Dashboard.tsx:27, TheRepo.tsx:31, Home.tsx:5 | ~~Remove vestigial props~~ RESOLVED | 15 min |
| CQ-08 | LOW | Consistency | No Prettier configured, inconsistent formatting | Project root | Add .prettierrc | 15 min |
| CQ-09 | LOW | Consistency | 67 console.log/warn/error calls across 12 files | Multiple | Create logger utility with levels | 1 hour |
| CQ-10 | LOW | Types | as casts in pitchService (eslint-disable any) | pitchService.ts:559-560 | Type Supabase join responses | 30 min |
| CQ-11 | LOW | Dead | Unused @anthropic-ai/sdk dependency | package.json | ~~npm uninstall~~ RESOLVED: already removed | 5 min |
| CQ-12 | LOW | Dead | deepAnalysis() exported but never called | rag.ts:396 | ~~Remove or implement~~ RESOLVED: removed (was unused Phase 3 concept) | 5 min |

### Data Layer Findings (Agent 6)

| ID | Severity | Domain | Summary | File:Line | Remediation | Effort |
|----|----------|--------|---------|-----------|-------------|--------|
| DAT-01 | MEDIUM | N+1 | 8 sequential ilike queries in fallback search | rag.ts:66-81 | Use Promise.all or single .or() query | 1 hour |
| DAT-02 | MEDIUM | N+1 | expandSectionBlocks queries per project in loop | rag.ts:437-441 | Deduplicate by project_id, batch query | 1 hour |
| DAT-03 | MEDIUM | Unbounded | SELECT * on user_page_views with no LIMIT | analytics.ts:122-134 | Add server-side aggregation or LIMIT | 1 hour |
| DAT-04 | MEDIUM | Unbounded | Chat sessions loaded with full JSONB messages | chatHistory.ts:52-56 | Fetch lightweight list, lazy-load messages | 1 hour |
| DAT-05 | MEDIUM | State | ProjectsContext re-renders all consumers on any change | ProjectsContext.tsx | Split contexts or memoize value | 1 hour |
| DAT-06 | MEDIUM | State | No project block caching, re-fetches on every mount | DynamicProjectDashboard.tsx | Add in-memory cache | 1 hour |
| DAT-07 | MEDIUM | Race | Non-atomic pitch ID generation (collision risk) | PitchSubmission.tsx:307-381 | Use database sequence or UUID | 1 hour |
| DAT-08 | MEDIUM | Integrity | Multi-step pitch creation without rollback | PitchSubmission.tsx:307-381 | Use Supabase RPC for atomic operation | 2 hours |
| DAT-09 | MEDIUM | State | localStorage auth: no expiry, no schema validation | AuthContext.tsx:28-33 | Add TTL, try/catch, shape validation | 30 min |
| DAT-10 | LOW | Race | Check-then-act in savePitchAiSession | pitchService.ts:420-462 | ~~Use upsert()~~ RESOLVED | 15 min |
| DAT-11 | LOW | Perf | RAG pipeline: 6 sequential API calls per query | rag.ts:492-623 | Consider streaming, batch where possible | 2 hours |
| DAT-12 | LOW | State | Message ID collision potential (Date.now()) | TheRepo.tsx:194 | ~~Use crypto.randomUUID()~~ RESOLVED | 5 min |
| DAT-13 | LOW | State | Chat saves fire on every message state change | TheRepo.tsx:83-87 | ~~Debounce saves~~ RESOLVED: duplicate of PERF-08, 800ms debounce added | 30 min |
| DAT-14 | LOW | Perf | getPitches fires 2-3 sequential queries | pitchService.ts:170-229 | Parallelize with Promise.all | 30 min |

### Operations Findings (Agent 7)

| ID | Severity | Domain | Summary | File:Line | Remediation | Effort |
|----|----------|--------|---------|-----------|-------------|--------|
| OPS-01 | HIGH | Observability | No error tracking service (Sentry, etc.) | N/A | Implement Sentry or Cloudflare error reporting | 2 hours |
| OPS-02 | HIGH | Reliability | No React Error Boundary - runtime errors crash app | main.tsx | Add top-level ErrorBoundary | 1 hour |
| OPS-03 | HIGH | CI/CD | No CI/CD pipeline, fully manual build and deploy | N/A | Add GitHub Actions: lint on PR, build on merge | 2 hours |
| OPS-04 | HIGH | Deploy | No rollback strategy or release versioning | N/A | Tag releases, document rollback process | 30 min |
| OPS-05 | HIGH | Data | Dev and prod share the same Supabase database | N/A | Create separate Supabase project for dev | 2 hours |
| OPS-06 | HIGH | Data | No database migration tracking | No supabase/migrations/ | Begin tracking with supabase migration workflow | 2 hours |
| OPS-07 | MEDIUM | Logs | PII in production logs (emails, search queries) | PitchSubmission.tsx:181, rag.ts | Remove PII from console output | 30 min |
| OPS-08 | MEDIUM | Config | Storage URL hardcoded in 3 different places | storage.ts:3, ImageCarousel.tsx:4, scripts | Derive from VITE_SUPABASE_URL | 30 min |
| OPS-09 | MEDIUM | Deploy | No build artifact verification before deploy | N/A | Add post-build checks | 1 hour |
| OPS-10 | LOW | Config | No .env.example file | N/A | ~~Create template with required var names~~ RESOLVED: .env.example created | 15 min |
| OPS-11 | LOW | Deps | Deno std@0.168.0 in Edge Functions (very old) | supabase/functions/ | Update to recent Deno std | 15 min |
| OPS-12 | LOW | Monitoring | No uptime monitoring | N/A | Add UptimeRobot or equivalent | 15 min |
| OPS-13 | LOW | Monitoring | No performance monitoring (Core Web Vitals) | N/A | Consider Cloudflare Web Analytics | 15 min |

### Performance Findings (Agent 8)

| ID | Severity | Domain | Summary | File:Line | Remediation | Effort |
|----|----------|--------|---------|-----------|-------------|--------|
| PERF-01 | CRITICAL | Bundle | 2.5MB single JS bundle, zero code splitting | vite.config.ts | Route-level lazy loading, vendor chunking | 1-2 days |
| PERF-02 | HIGH | Bundle | Mapbox (~700KB) loaded for all visitors | ResearchMap.tsx | React.lazy for ResearchMap | 30 min |
| PERF-03 | HIGH | Bundle | Full D3 imported (import * as d3) | Schedule.tsx, DonutChartBlock.tsx | Import specific submodules | 30 min |
| PERF-04 | HIGH | Bundle | Unused @anthropic-ai/sdk in dependencies | package.json | Remove dependency | 5 min |
| PERF-05 | HIGH | Images | No lazy loading on any images | ImageCarousel.tsx, Portfolio.tsx | Add loading="lazy", srcset | 1 hour |
| PERF-06 | MEDIUM | Async | 5+ unhandled promise rejections across useEffects | App.tsx:43,101, TheRepo.tsx:45, PitchChatPanel.tsx:41 | Add .catch() handlers | 1 hour |
| PERF-07 | MEDIUM | Memory | requestAnimationFrame loops without cancellation | StatGridBlock.tsx:56, CostBuilderBlock.tsx:35 | ~~Add cancelAnimationFrame in cleanup~~ RESOLVED | 15 min |
| PERF-08 | MEDIUM | Writes | Chat saves fire on every message change (no debounce) | TheRepo.tsx:83-87, PitchChatPanel.tsx:66-76 | ~~Debounce save operations~~ RESOLVED: 800ms debounce | 30 min |
| PERF-09 | MEDIUM | Render | Zero React.memo, useCallback, useMemo optimization | Multiple | Add memoization to heavy components | 2 hours |
| PERF-10 | MEDIUM | Perf | PitchSubmission mount: 4 sequential Supabase queries | PitchSubmission.tsx:174-215 | Use Promise.all for independent queries | 30 min |
| PERF-11 | MEDIUM | Perf | Analytics fires Supabase INSERT on every navigation | App.tsx:114-120 | Batch and debounce page views | 1 hour |
| PERF-12 | LOW | Async | Nested setTimeout without cleanup (AnimatedHero) | AnimatedHero.tsx:35-38 | ~~Track and clear inner timeout~~ RESOLVED | 15 min |
| PERF-13 | LOW | Async | setTimeout for form reset not cleaned up | Collaborate.tsx:27-30 | ~~Store ID in ref, clean up on unmount~~ RESOLVED | 10 min |
| PERF-14 | LOW | Render | categoryColors object re-created every render | ResearchMap.tsx:30-33 | ~~Wrap in useMemo~~ RESOLVED | 5 min |
| PERF-15 | LOW | Render | D3 chart destroys/rebuilds entire SVG on re-render | Schedule.tsx:166-347 | Acceptable at current scale | Deferred |
| PERF-16 | LOW | Async | CostBuilderBlock animation reads stale state | CostBuilderBlock.tsx:23-39 | Use ref for animated value | 15 min |
| PERF-17 | LOW | Bundle | No block-level code splitting | BlockRenderer.tsx | Lazy-load block components | 1 hour |

---

## 4. 12-Factor Scorecard

| Factor | Status | Key Finding | Recommendation |
|--------|--------|-------------|----------------|
| I. Codebase | PASS | Single repo in Git, one deploy target | None needed |
| II. Dependencies | PASS | All declared in package.json, lockfile committed | None needed |
| III. Config | FAIL | Shared password, Mapbox token, Supabase URLs hardcoded in source | Move all to env vars |
| IV. Backing Services | PARTIAL | Supabase client uses env vars, but storage URL hardcoded in 3 places | Derive all URLs from VITE_SUPABASE_URL |
| V. Build/Release/Run | PARTIAL | Separate build/deploy steps but no versioning, no CI/CD | Add release tagging, CI pipeline |
| VI. Processes | PASS | SPA is stateless by nature | N/A |
| VII. Port Binding | N/A | Static hosting on Cloudflare Pages CDN | N/A |
| VIII. Concurrency | PASS | CDN + Supabase handle scaling | None needed |
| IX. Disposability | PASS | Fast SPA load, ephemeral Edge Functions | None needed |
| X. Dev/Prod Parity | PARTIAL | Dev and prod share same Supabase instance | Create separate dev database |
| XI. Logs | FAIL | Unstructured console.log everywhere, PII in logs, no log levels | Add logger utility, strip debug in prod |
| XII. Admin Processes | PARTIAL | Scripts exist but no migration tracking | Begin using supabase migration workflow |

---

## 5. Architecture Quality Summary

| Principle | Status | Key Evidence |
|-----------|--------|-------------|
| Single Responsibility | VIOLATION | PitchSubmission.tsx: 1,490 lines, 19 useState hooks, 9 mixed responsibilities |
| Open/Closed | PASS | Block system is well-designed for extension (21 types, clean renderer) |
| Liskov Substitution | PASS | No interface violations detected |
| Interface Segregation | PASS | Contexts are focused, no fat interfaces |
| Dependency Inversion | VIOLATION | All 6 service files import concrete Supabase client, 2 bypass it entirely with raw fetch |
| Layer Separation | CONCERN | Services conflate business logic with data access; AuthContext makes direct DB calls |
| Module Boundaries | PASS | No circular dependencies; clean dependency graph |
| Domain Modeling | CONCERN | Types in wrong directory (components/ instead of types/), business rules in view layer |

---

## 6. Cross-Cutting Themes

### Theme 1: No Server-Side Security Boundary

The most pervasive issue across the audit. Auth is client-side, RLS is disabled, Edge Functions have no access control, and secrets are in the client bundle. Every security finding traces back to the absence of a server-side trust boundary. The Supabase anon key is the only credential, and it grants unrestricted access to everything.

**Root cause:** The app was built as an internal tool with placeholder auth, but it's deployed to a public URL with real data.

**Structural fix:** Enable RLS, implement Supabase Auth or JWT-based auth via Edge Functions, restrict Edge Function CORS. This single architectural change addresses AUTH-01 through AUTH-08, AUTH-14, INJ-06, INJ-07, and partially addresses AUTH-11, AUTH-12.

### Theme 2: Single-Bundle, No-Split Architecture

The entire application (public + internal features, all heavy libraries) ships as one 2.5MB bundle. This affects every public visitor's experience and wastes bandwidth on features they'll never see. The fix (route-level code splitting) is mechanical and high-impact.

### Theme 3: Inconsistent Error Handling

Services silently return empty arrays/null on errors. Some views show error states, others don't. Some async operations have .catch(), others don't. No global error boundary exists. A single runtime error crashes the entire app.

**Structural fix:** Add a top-level React Error Boundary, standardize on async/await with try/catch in all effects, and implement consistent error states in the UI.

### Theme 4: Data Duplication and Staleness

Project metadata, dashboard-eligible project lists, and confidential project IDs are hardcoded in multiple files with divergent values. The `PROJECTS_WITH_DASHBOARDS` mismatch between ResearchMap (2 projects) and Portfolio (10 projects) is a concrete bug. Schedule data, navigation items, and other config will go stale as projects are added.

**Structural fix:** Single source of truth for project metadata, derived from the database wherever possible.

---

## 7. Remediation Roadmap

### Immediate (this week)

These can be done quickly and have outsized impact:

1. **Rename VITE_ANTHROPIC_API_KEY** - drop the VITE_ prefix (5 min)
2. **Rename VITE_OPENASSET_ tokens** - drop VITE_ prefix (5 min)
3. **Add supabase/.temp/ to .gitignore** (5 min)
4. **Add .claude/settings.local.json to .gitignore** (5 min)
5. **Remove hardcoded anon key from insert-sanctuary-blocks.js** - use dotenv (15 min)
6. **Restrict Edge Function CORS** to production domain (15 min)
7. **Add input validation to Edge Functions** - model whitelist, max_tokens cap (1 hour)
8. **Wrap localStorage JSON.parse in try/catch** in AuthContext (10 min)
9. **Remove unused @anthropic-ai/sdk dependency** (5 min)
10. **Create public/_headers** with security headers for Cloudflare Pages (30 min)

### Short-term (2 weeks)

1. **Enable Supabase RLS** on all tables with appropriate policies (1-2 days)
2. **Move password check server-side** via Edge Function (0.5-1 day)
3. **Add React Error Boundary** at app root (1 hour)
4. **Implement route-level code splitting** with React.lazy (1-2 days)
5. **Add lazy image loading** throughout the app (1 hour)
6. **Fix D3 imports** - use specific submodules instead of full library (30 min)
7. **Unify PROJECTS_WITH_DASHBOARDS** to single source (30 min - fixes bug)
8. **Add .catch() handlers** to all unhandled promises (1 hour)
9. **Fix requestAnimationFrame leaks** in StatGridBlock and CostBuilderBlock (15 min)
10. **Sanitize TextContentBlock** - add DOMPurify for dangerouslySetInnerHTML (1 hour)

### Medium-term (1 month)

1. **Implement Supabase Auth or Azure SSO** with proper JWT flow (2-3 days)
2. **Decompose PitchSubmission.tsx** into sub-components + custom hook (1-2 days)
3. **Extract shared claude.ts service** - deduplicate callClaude() (1 hour)
4. **Add prompt injection defenses** - input delimiters, system parameter usage (2 hours)
5. **Set up CI/CD pipeline** - GitHub Actions for lint/build/deploy (2 hours)
6. **Implement error tracking** (Sentry or equivalent) (2 hours)
7. **Create separate dev Supabase project** (2 hours)
8. **Begin database migration tracking** (2 hours)
9. **Add debouncing to chat saves** (30 min)
10. **Convert BlockConfig to discriminated union** for type safety (2-3 hours)

### Long-term (quarter)

1. **Complete Azure SSO migration** - per-user credentials, proper RBAC
2. **Add automated test suite** - zero test files currently
3. **Extract domain types** to src/types/ directory
4. **Implement server-side aggregation** for analytics
5. **Add performance monitoring** (Core Web Vitals)
6. **Add uptime monitoring**
7. **Implement structured logging** with configurable levels
8. **Consider React Query/SWR** for data fetching and caching
9. **Add release versioning and rollback documentation**

### Dependency Graph

```
VITE_ prefix fixes -----> (no dependencies, do first)
                    |
Edge Function CORS -+---> RLS policies ---> Supabase Auth/SSO
                    |         |
Security headers ---+    Server-side auth ---> Per-user RBAC
                              |
                         JWT-based sessions ---> Session expiry
                                                    |
Code splitting -----> (independent)           Azure SSO migration
                                                    |
Error Boundary -----> Error tracking (Sentry)  Migration tracking
                                                    |
CI/CD pipeline -----> Release versioning       Automated tests
```

---

## 8. Positive Patterns

The codebase does several things well that should be preserved:

1. **Block system architecture** - The 21-block-type system with `BlockRenderer`, typed interfaces, and DB-driven content is genuinely well-designed. Data-driven, extensible, and clean.

2. **Consistent Supabase error checking** - Every `.from()` call checks the `error` return value. This discipline is applied across all service files.

3. **Clean service layer separation** - Service files are organized by domain (projects, pitches, RAG, analytics, chat) with clear converter functions (`rowToPitch`, `rowToSession`, etc.).

4. **Explicit column selection** - `loadProjects.ts` and `projects.ts` use explicit column selection rather than `SELECT *`. Good practice for performance.

5. **Context providers are focused** - `ProjectsContext` and `AuthContext` each handle a single concern. No god-context pattern.

6. **No circular dependencies** - The dependency graph flows cleanly: views -> components + services + context -> config.

7. **ThemeManager centralization** - All brand colors, category colors, and theme utilities are centralized. No hardcoded colors scattered through components.

8. **Fallback search strategy** - The RAG service has a reasonable fallback from full-text search to ILIKE when FTS yields no results.

9. **Recent dependency versions** - React 19, Vite 7, TypeScript 5.9, and Supabase JS 2.90 are all recent releases, minimizing known CVE exposure.

---

## Methodology Notes

### Areas Not Assessable via Static Analysis
- **Supabase RLS policies** - Cannot verify from client code alone; need to check Supabase dashboard
- **Runtime performance** - Actual bundle sizes, LCP, FID require browser profiling
- **Network topology** - Cloudflare configuration, DNS, SSL settings
- **Supabase Edge Function environment** - Server-side env vars, runtime config
- **Production Cloudflare Pages configuration** - Redirects, headers at CDN level

### Assumptions Made
- The application is deployed publicly at `repository.pflugerarchitects.com`
- The Supabase project is the same for dev and prod (confirmed by single project ref)
- RLS is disabled based on the SQL schema file evidence and the auth pattern used
- The `.env.local` file has never been committed to git (gitignored via `*.local`)

### Recommended Follow-Up
1. **Supabase dashboard audit** - Verify RLS status on all tables directly
2. **Lighthouse CI run** - Measure actual Core Web Vitals
3. **npm audit** - Check for known CVEs in dependency tree
4. **Bundle analysis** - Run `npx vite-bundle-visualizer` for precise chunk sizes
5. **Penetration test** - Validate the auth bypass and data access findings
