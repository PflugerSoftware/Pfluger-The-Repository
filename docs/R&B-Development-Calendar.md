# EZRA Development Calendar

**Target Launch:** End of January 2026
**Tech Stack:** Supabase (PostgreSQL + Auth) - Approved
**Last Updated:** January 27, 2026

---

## Current Codebase State

| Area | Status | Notes |
|------|--------|-------|
| Block System (21 types) | ✅ Done | All components working |
| Project Dashboards (8) | ✅ Done | Configs complete |
| Research Map | ✅ Done | Mapbox 3D (pflugerarchitects account) |
| Portfolio/Gallery | ✅ Done | Year grouping |
| Pitch UI | ✅ Done | Form, chat panel, auto-save |
| Repository UI | ✅ Done | Chat interface with RAG |
| Auth | ⚠️ Mock | Hardcoded creds (Azure SSO pending) |
| Database Schema | ✅ Done | 17 tables in Supabase |
| Frontend-DB Integration | ✅ Done | Full persistence via services |
| AI Integration | ✅ Done | RAG + Pitch AI (Ezra) fully wired |
| Persistence | ✅ Done | Pitches, chats, comments all persist |

**Live at:** https://repository.pflugerarchitects.com (Cloudflare Pages, DNS via Bluehost)

---

## Completed: Week 1 (January 5-9)

- [x] Tech stack decision meeting (1/8) - **Approved Supabase**
- [x] R&B Launch Planning meeting (1/9)
- [x] Supabase project created
- [x] Database schema designed and implemented (17 tables)
- [x] Supabase Auth configured
- [x] RLS policies set up

---

## Completed: Week 2 (January 12-16)

- [x] Set up psql on local machine
- [x] Connected to Supabase via Session Pooler (IPv4)
- [x] Verified all 17 tables accessible
- [x] Install @supabase/supabase-js
- [x] Create Supabase client config
- [x] Load research_projects from Supabase
- [ ] Connect auth to Supabase Auth - Skipped (using Azure SSO)
- [ ] Azure SSO integration - Blocked (Craig/Austin)
- [ ] Connect collaboration form to collaboration_requests - Deferred
- [ ] Set up Resend for email notifications - Deferred

---

## Completed: Week 3 (January 19-23)

- [x] Claude API integration setup (1/16)
- [x] TheRepo.tsx real AI responses (1/16)
- [x] Claude RAG with project data (1/16)
- [x] Pitch system full database integration (1/20)
  - pitches, pitch_ai_sessions, pitch_comments tables
  - pitchService.ts with full CRUD
  - PitchSubmission.tsx loads from Supabase
  - PitchChatPanel.tsx AI integration with Ezra
  - GreenLit pitches (status='greenlit', user_id=null)
  - Auto-save on all pitch edits
  - Comment system with user attribution
- [x] repo_ai_sessions table (renamed from chat_sessions)
- [x] chatHistory.ts service updated
- [x] User accounts overhauled, testers added
- [ ] Real hours tracking (Schedule.tsx) - Deferred
- [ ] Replace Unsplash placeholders - Deferred

---

## Current: Week 4 (January 27-30)

**Launch Target:** End of January 2026

### Remaining Pre-Launch Tasks

| Priority | Task | Status |
|----------|------|--------|
| Critical | Final QA testing | To Do |
| Critical | Test pitch submission end-to-end | To Do |
| Critical | Test Repository chat with all 8 projects | To Do |
| Critical | Verify analytics tracking | To Do |
| High | Update Mapbox account (if not done) | ✅ Done |
| High | Test all navigation flows | To Do |
| Medium | Replace Unsplash placeholders (if any) | To Do |
| Medium | Collaboration form Supabase integration | Deferred |
| Medium | Email notifications via Resend | Deferred |
| Low | Azure SSO integration | Blocked (post-launch) |

### Launch Week Schedule

| Day | Task | Priority |
|-----|------|----------|
| Mon 1/27 | QA testing and bug fixes | Critical |
| Tue 1/28 | Stakeholder demo | Critical |
| Wed 1/29 | Bug fixes from demo | High |
| Thu 1/30 | Production deployment | Critical |
| Thu 1/30 | **LAUNCH** + monitoring | Critical |

---

---

## Pitch System Workflow (Detailed)

### Current State (Updated Jan 27, 2026)

**Fully integrated with Supabase:**

| Component | File | Status |
|-----------|------|--------|
| Pitch submission form | `PitchSubmission.tsx` | ✅ Full database integration |
| AI chat builder (Ezra) | `PitchChatPanel.tsx` | ✅ AI + persistence working |
| Pitch card (form) | `PitchCard.tsx` | ✅ Auto-save to database |
| GreenLit topics | `pitchService.ts` | ✅ Loads from Supabase |
| My Pitches list | `PitchSubmission.tsx` | ✅ Loads from Supabase |
| Submit action | `PitchSubmission.tsx` | ✅ Creates pitch in database |
| Comment thread | `PitchSubmission.tsx` | ✅ Persists to pitch_comments |
| Chat persistence | `chatHistory.ts` | ✅ repo_ai_sessions table |

### Pitch Data Model (PitchCard.tsx:16-25)
```typescript
interface PitchData {
  researchIdea: string;
  alignment: 'current-project' | 'thought-leadership' | '';
  methodology: string;
  scopeTier: 'simple' | 'medium' | 'complex' | '';
  impact: string;
  resources: string;
  timeline: string;
  partners: string;
}
```

### Data Sources

**Legacy (CSV - being migrated):**
| File | Purpose |
|------|---------|
| `/public/data/research_projects.csv` | Project list for map/portfolio |
| `/public/data/district_attributes.csv` | District info |
| `/public/data/district_shapes.csv` | District geometry for map |

**Production (Supabase):**
All data will be served from Supabase PostgreSQL. CSV files retained for fallback.

---

### Supabase Schema (17 Tables - Implemented)

Connection: `postgresql://postgres.bydkzxqmgsvsnjtafphj:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres`

#### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | id (uuid), email, name, role, office (Austin/CC/Dallas) |
| `projects` | Research projects | id (X25-RBxx), title, category, phase, office |
| `research_projects` | Legacy map data (CSV) | id, title, researcher, latitude, longitude |
| `pitches` | All pitch submissions | id (P-YYYY-XXX), user_id (uuid, null for greenlit), title, status, research_idea |
| `project_blocks` | Dashboard content blocks | id, project_id, block_type, block_order, data (jsonb), summary, tags |

#### Relationship Tables

| Table | Purpose |
|-------|---------|
| `project_researchers` | Many-to-many projects/users |
| `project_partners` | Many-to-many projects/partners |
| `project_sources` | Project citations |
| `project_blocks` | Dashboard block configs |
| `project_updates` | Activity log per project |
| `contact_projects` | Many-to-many contacts/projects |

#### Communication Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `repo_ai_sessions` | TheRepo RAG chat sessions | id (uuid), user_id (uuid), title, messages (jsonb) |
| `pitch_ai_sessions` | Ezra pitch chat sessions | id (uuid), pitch_id (text), user_id (uuid), messages (jsonb) |
| `pitch_comments` | Comments on pitches | id (uuid), pitch_id (text), user_id (uuid), message, created_at |
| `collaboration_requests` | Public contact form | id, name, email, message, status |
| `contacts` | Partner database | id, name, organization, contact_type |
| `calendar_events` | Timeline events | id, title, event_type, event_date, project_id |
| `user_page_views` | Analytics tracking | id (uuid), user_id (uuid), session_id, page_name, timestamp |

#### Roles (users.role)

| Role | Access |
|------|--------|
| `admin` | Full access to all data |
| `researcher` | CRUD own projects/pitches |
| `contributor` | Create pitches, view projects |
| `viewer` | Read-only |

#### Status Values

**pitches.status:** `pending` | `revise` | `greenlit` | `rejected` | `converted`

**projects.phase:** `Pre-Research` | `Developmental` | `Completed`

**collaboration_requests.status:** `new` | `reviewed` | `responded` | `archived`

---

### Status Flows

**GreenLit Pitch:**
- Created with `status='greenlit'` and `user_id=null`
- User claims pitch → `user_id` assigned
- Shows in "My Pitches"
- Eventually converts to Project

**Custom Pitch:**
- Created with `status='pending'`
- Review → `greenlit` / `revise` / `rejected`
- If greenlit → converts to Project

**Project:**
- `Pre-Research` → `Developmental` → `Completed`

### Full Workflow: Pitch → Research → Live

```
┌─────────────────────────────────────────────────────────────────────┐
│                           PITCH PHASE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐      ┌─────────┐      ┌────────┐                      │
│  │  DRAFT  │ ──▶  │ PENDING │ ──▶  │GREENLIT│ ─────────────────┐   │
│  └─────────┘      └────┬────┘      └────────┘                  │   │
│                        │                                        │   │
│                        ▼                                        │   │
│                   ┌─────────┐      ┌──────────┐                 │   │
│                   │ REVISE  │      │ REJECTED │                 │   │
│                   └────┬────┘      └──────────┘                 │   │
│                        │ resubmit                               │   │
│                        ▼                                        │   │
│                   ┌─────────┐                                   │   │
│                   │ PENDING │                                   │   │
│                   └─────────┘                                   │   │
└─────────────────────────────────────────────────────────────────┼───┘
                                                                  │
                    Agent creates Research Object + X26-RBxx      │
                                                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RESEARCH PHASE                              │
│                      (appears on "My Research")                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐      ┌───────────┐      ┌────────┐      ┌──────────┐  │
│  │  DRAFT  │ ──▶  │IN PROGRESS│ ──▶  │ REVIEW │ ──▶  │ APPROVED │  │
│  └─────────┘      └───────────┘      └────┬───┘      └─────┬────┘  │
│       │                                   │                 │       │
│       │          User works with agent:   │                 │       │
│       │          • Upload metrics         │ revisions       │       │
│       │          • Add images             ▼                 │       │
│       │          • Build research.ts  ┌───────────┐         │       │
│       │          • Comments/chat      │IN PROGRESS│         │       │
│       │                               └───────────┘         │       │
│       │                                                     │       │
│       └── Agent scaffolds working document                  │       │
│                                                             │       │
└─────────────────────────────────────────────────────────────┼───────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           LIVE PHASE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Research Object becomes researchConfig.ts                          │
│  • Appears on Portfolio (Work)                                      │
│  • Appears on Repository                                               │
│  • Has project dashboard with blocks                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Projects Table (replaces research_objects concept)

In Supabase, greenlit pitches convert to `projects` table entries via `pitches.converted_to_project_id`.

**Related tables:**
- `project_researchers` - who's working on it
- `project_partners` - external collaborators
- `project_sources` - citations
- `project_blocks` - dashboard block configs
- `project_updates` - activity/comments

### Permissions Model

Uses Supabase RLS + `users.role`:

| Role | Pitches | Projects |
|------|---------|----------|
| `viewer` | None | Read-only |
| `contributor` | Own only | Read-only |
| `researcher` | Own only | Assigned projects |
| `admin` | All | All |

### "My Research" Page

**Shows:**
1. Research Objects where user is in `researchers` array
2. Status badge (draft/in_progress/review/approved)
3. Click to open research workspace

**Research Workspace:**
- Left: Chat with agent (builds config_data)
- Right: Live preview of blocks
- Bottom: Comments thread
- Actions: Upload images, add metrics, submit for review

### Agent Workflow (GreenLit → Research Object)

When pitch is GreenLit:
1. Agent creates new `research_objects` row
2. Agent scaffolds initial `config_data` from pitch:
   - Title, description from pitch
   - Suggested blocks based on methodology
   - Empty sections for user to fill
3. Assigns researchers (pitch submitter + any tagged)
4. Status = 'draft'
5. Appears on "My Research" page

### Pitch Workflow Implementation (Supabase)

**Tables implemented:** `pitches`, `pitch_ai_sessions`, `pitch_comments`

**Completed (Jan 20, 2026):**
- [x] pitchService.ts with full CRUD operations
- [x] PitchSubmission.tsx connected to Supabase
- [x] GreenLit pitches (status='greenlit', user_id=null)
- [x] Claim pitch functionality
- [x] Load user's pitches from Supabase
- [x] Auto-save all pitch edits
- [x] pitch_comments for review threads
- [x] PitchChatPanel.tsx saves Ezra conversations
- [x] Pitch status transitions
- [x] 5 seed pitches (P-2026-001 through P-2026-005)

### Resolved Questions

1. **Who reviews pitches?** ✅
   - Reviewers = hardcoded list or Azure AD group
   - Reviewers see all pitches and research
   - Regular users see only their own

2. **What happens after "GreenLit"?** ✅
   - Agent auto-creates Research Object
   - Agent assigns project number (X26-RBxx)
   - Agent scaffolds initial config from pitch
   - Appears on "My Research" page

3. **Can users edit after submit?** ✅
   - Pitches: Only if status = 'revise'
   - Research: Always editable until status = 'approved'

4. **Comments system?** ✅
   - JSON array in the object itself
   - {user_name, user_id, message, timestamp}
   - Renders as chat thread UI

### Open Questions

1. **Notifications:** Email (Resend) vs in-app vs both?
2. **Image storage:** Supabase Storage vs OpenAsset integration?
3. **VP code integration:** Auto-generate or manual entry?

---

## Current Status (January 27, 2026)

### Completed
- [x] Tech stack decision - Supabase approved
- [x] Database schema design and implementation (17 tables)
- [x] Supabase Auth configuration
- [x] RLS policies setup
- [x] psql local connection established
- [x] Claude API integration (Edge Function proxy)
- [x] RAG system implemented (rag.ts)
  - Haiku for intent analysis + relevance filtering
  - Sonnet for answer synthesis with citations
  - Section expansion (sections act as entry points to child blocks)
  - 25 block search limit, 8 terms, 10 results per term
- [x] source_ids populated for all projects (66-100% coverage)
- [x] Citations use actual source IDs (match project page)
- [x] @supabase/supabase-js installed
- [x] Supabase client config created
- [x] Frontend connected to Supabase (projects loading from DB)
- [x] **Pitch System Full Integration (Jan 20)**
  - pitchService.ts with full CRUD
  - PitchSubmission.tsx database integration
  - PitchChatPanel.tsx AI (Ezra) integration
  - pitch_ai_sessions table for chat persistence
  - pitch_comments table for review threads
  - GreenLit pitch claiming workflow
  - Auto-save on all edits
- [x] **Chat Persistence**
  - repo_ai_sessions table (renamed from chat_sessions)
  - chatHistory.ts service
  - TheRepo chat persists to database
- [x] **Analytics Tracking**
  - user_page_views table
  - analytics.ts service
- [x] User accounts overhauled, testers added
- [x] Mapbox updated to pflugerarchitects account
- [x] Cloudflare Pages deployment configured
- [x] DNS mapped via Bluehost → repository.pflugerarchitects.com

### Blocked (Post-Launch)
- [ ] Azure SSO integration (waiting on Craig/Austin)

### Pre-Launch QA (This Week)
- [ ] End-to-end pitch submission testing
- [ ] Repository chat testing (all 8 projects)
- [ ] Navigation flow testing
- [ ] Analytics verification
- [ ] Bug fixes from testing

### Deferred to Post-Launch
| Task | Status |
|------|--------|
| Azure SSO integration | Blocked (Craig/Austin) |
| Collaboration form → Supabase | Deferred |
| Email notifications (Resend) | Deferred |
| VP code integration | Pending decisions (LP, LF, JS) |
| Staff assignment features | Pending communication chain |
| Marketing pipeline | Pending sign-off (CO, CC) |

---

## Risk Assessment

**Current timeline:** 2.5 weeks to launch (Jan 30)

| Area | Risk | Mitigation |
|------|------|------------|
| Auth integration | Medium | Supabase Auth is ready, just need frontend |
| Claude API | Medium | Can launch with pattern matching, add AI later |
| Data migration | Low | CSV fallback available |
| SSO | High | May defer to post-launch |

**Fallback options:**
1. **Public-only launch** - No internal features, just showcase
2. **Phased launch** - Public first, internal features in February
3. **Demo mode** - Full UI with mock data, real backend in Q2

---

## Key Meetings This Month

| Date | Time | Meeting | Attendees | Status |
|------|------|---------|-----------|--------|
| Wed 1/8 | 1-2pm | Software & Infrastructure | CO, CM, LP, LF | Done - Supabase approved |
| Thu 1/9 | 11am-noon | R&B Launch Planning | CO | Done |
| Thu 1/9 | 3-4pm | Vision BD+I Dashboard | CC, DY, CO | Done |
| TBD | TBD | Project Prism | Terry, Tavo, AW | Pending |
| TBD | TBD | Turf Melting | CO, TS | Pending |

---

*Last updated: January 27, 2026*
