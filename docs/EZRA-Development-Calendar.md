# EZRA Development Calendar

**Target Launch:** End of January 2026
**Tech Stack Decision:** Wednesday, January 8 (1pm-2pm meeting)

---

## Current Codebase State

| Area | Status | Notes |
|------|--------|-------|
| Block System (21 types) | ✅ Done | All components working |
| Project Dashboards (9) | ✅ Done | Configs complete |
| Research Map | ✅ Done | Mapbox 3D |
| Portfolio/Gallery | ✅ Done | Year grouping |
| Pitch UI | ✅ Done | Form, chat panel |
| TheRepo UI | ✅ Done | Chat interface |
| Auth | ⚠️ Mock | Hardcoded creds |
| Database | ❌ None | CSV only |
| AI Integration | ❌ None | Pattern matching |
| Persistence | ❌ None | State lost on refresh |

**UI is ~90% complete. Backend/persistence needed.**

---

## Week 1: January 5-9

### Monday 1/6 - Tuesday 1/7 (Pre-Decision)
*No blockers - work that can proceed regardless of tech stack approval*

| Task | Priority | Est. Hours |
|------|----------|------------|
| Check block system accuracy | High | 2-3 |
| Check research.ts data accuracy | High | 1-2 |
| Audit project sources/citations | Medium | 3-4 |
| Build "My Research" page UI scaffold | High | 4-6 |
| Review/update project configs | Medium | 2-3 |

### Wednesday 1/8
- **1pm-2pm:** R&B Block 2 - Software & Infrastructure Meeting (CO, CM, LP, LF)
- **Decision Point:** Tech stack approved or not

### Thursday 1/9 - Friday 1/10

#### IF TECH STACK APPROVED ✅
| Task | Priority | Notes |
|------|----------|-------|
| Set up Cloudflare D1 database | Critical | Create account, initialize 5 tables |
| Create users table + auth | Critical | Simple email/password (no SSO) |
| Set up Resend account | Critical | Email notifications |
| Create pitches + research_objects tables | Critical | Schema documented below |

#### IF TECH STACK NOT APPROVED ❌
| Task | Priority | Notes |
|------|----------|-------|
| Document blockers for escalation | High | What's needed, why |
| Continue UI work (no backend) | Medium | Polish existing views |
| Prepare alternate hosting options | Medium | Bluehost fallback plan |
| Image asset collection | Medium | Gather real project photos |

---

## Week 2: January 12-16

### IF TECH STACK APPROVED ✅

| Day | Task | Priority |
|-----|------|----------|
| Mon 1/13 | D1 tables: users, pitches, research_objects | Critical |
| Mon 1/13 | D1 tables: chat_sessions, activity_log | Critical |
| Tue 1/14 | Replace hardcoded auth with users table | Critical |
| Tue 1/14 | Pitch submission → D1 | Critical |
| Wed 1/15 | Chat sessions → D1 (persist conversations) | High |
| Wed 1/15 | Claude API integration for TheRepo | High |
| Thu 1/16 | Form backend (Collaborate → Resend email) | High |
| Thu 1/16 | Activity logging | Medium |
| Fri 1/17 | Connect PitchSubmission.tsx to D1 APIs | Critical |

**Meetings:**
- **Thu 1/9 3pm-4pm:** Vision BD+I Dashboard (CC, DY, CO) - may spillover tasks

### IF TECH STACK NOT APPROVED ❌

| Day | Task | Priority |
|-----|------|----------|
| Mon 1/13 | Escalation meeting prep | High |
| Mon 1/13 | Cost/benefit documentation | High |
| Tue 1/14 | CSV-based pitch storage (temp) | Medium |
| Tue 1/14 | localStorage persistence (temp) | Medium |
| Wed 1/15 | Mock AI polish (pattern matching) | Low |
| Thu 1/16 | UI/UX refinements | Medium |
| Fri 1/17 | Content review with stakeholders | Medium |

---

## Week 3: January 19-23

### IF TECH STACK APPROVED ✅

| Day | Task | Priority |
|-----|------|----------|
| Mon 1/20 | Complete SSO integration | Critical |
| Mon 1/20 | Role-based permissions | Critical |
| Tue 1/21 | Claude RAG implementation | High |
| Tue 1/21 | TheRepo.tsx AI integration | High |
| Wed 1/22 | Real hours tracking (Schedule.tsx) | Medium |
| Wed 1/22 | GreenLit topics from D1 | Medium |
| Thu 1/23 | MY_PITCHES from D1 | Medium |
| Thu 1/23 | Replace Unsplash placeholders | Medium |
| Fri 1/24 | Integration testing | Critical |
| Fri 1/24 | Bug fixes | Critical |

### IF TECH STACK NOT APPROVED ❌

| Day | Task | Priority |
|-----|------|----------|
| Mon 1/20 | Public-only launch prep | Medium |
| Tue 1/21 | Content finalization | Medium |
| Wed 1/22 | Branding review | Medium |
| Thu 1/23 | Static deployment | Medium |
| Fri 1/24 | Internal demo (limited features) | Medium |

---

## Week 4: January 28-30 (Short Week)

### IF TECH STACK APPROVED ✅

| Day | Task | Priority |
|-----|------|----------|
| Tue 1/28 | Final QA testing | Critical |
| Tue 1/28 | Production deployment | Critical |
| Wed 1/29 | Stakeholder demo | Critical |
| Wed 1/29 | Bug fixes from demo | High |
| Thu 1/30 | **LAUNCH** 🚀 | - |
| Thu 1/30 | Monitor + hotfixes | Critical |

### IF TECH STACK NOT APPROVED ❌

| Day | Task | Priority |
|-----|------|----------|
| Tue 1/28 | Public-only deployment | Medium |
| Wed 1/29 | Limited launch (no internal features) | Medium |
| Thu 1/30 | Document what's missing for Q2 | Medium |

---

---

## Pitch System Workflow (Detailed)

### Current State
The UI exists but everything is mock data:

| Component | File | Status |
|-----------|------|--------|
| Pitch submission form | `PitchSubmission.tsx` | ✅ UI done |
| AI chat builder | `PitchChatPanel.tsx` | ⚠️ Pattern-matching only (no real AI) |
| Pitch card (form) | `PitchCard.tsx` | ✅ UI done |
| GreenLit topics | `PitchSubmission.tsx:49-90` | ❌ Hardcoded |
| My Pitches list | `PitchSubmission.tsx:93-123` | ❌ Mock data |
| Submit action | `PitchSubmission.tsx:215-235` | ❌ console.log + alert() |
| Comment thread | `PitchSubmission.tsx:446-470` | ⚠️ UI only, no backend |

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

### Current Data Sources (CSV - No Database)

| File | Purpose |
|------|---------|
| `/public/data/research_projects.csv` | Project list for map/portfolio |
| `/public/data/district_attributes.csv` | District info |
| `/public/data/district_shapes.csv` | District geometry for map |

*No existing database. Building from scratch with Cloudflare D1.*

---

### D1 Schema (Final - 5 Tables)

---

#### Table 1: `users`
*Simple auth - no SSO*

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK (uuid) |
| name | TEXT | Display name |
| email | TEXT | Unique |
| password_hash | TEXT | Hashed password |
| role | TEXT | 'user' / 'reviewer' / 'admin' |
| created_at | DATETIME | |
| last_login | DATETIME | |

---

#### Table 2: `pitches`
*Includes GreenLit topics (pre-approved pitches)*

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK (P-2026-001) |
| user_id | TEXT | FK to users, NULL for unclaimed GreenLit |
| title | TEXT | |
| description | TEXT | |
| category | TEXT | psychology, sustainability, etc. |
| methodology | TEXT | |
| scope_tier | TEXT | 'simple' / 'medium' / 'complex' |
| partners | TEXT | JSON array |
| sources | TEXT | JSON array |
| status | TEXT | See status values below |
| is_greenlit_topic | BOOLEAN | TRUE = pre-approved |
| submitted_at | DATETIME | |
| reviewed_at | DATETIME | |
| reviewed_by | TEXT | Reviewer's name |
| comments | TEXT | JSON array |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

#### Table 3: `research_objects`
*Created from greenlit pitches*

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK (X26-RB01) |
| pitch_id | TEXT | FK to pitches |
| title | TEXT | |
| description | TEXT | |
| category | TEXT | |
| methodology | TEXT | |
| scope_tier | TEXT | 'simple' / 'medium' / 'complex' |
| partners | TEXT | JSON array |
| sources | TEXT | JSON array |
| status | TEXT | 'draft' / 'in_progress' / 'review' / 'approved' |
| researchers | TEXT | JSON array of user names |
| blocks | TEXT | JSON array - block configs |
| comments | TEXT | JSON array |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

#### Table 4: `chat_sessions`
*AI conversations for pitch builder, research workspace, and TheRepo*

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK (uuid) |
| user_id | TEXT | FK to users |
| context_type | TEXT | 'pitch' / 'research' / 'repo' |
| context_id | TEXT | FK to pitch or research, NULL for repo |
| messages | TEXT | JSON array (see below) |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

#### Table 5: `activity_log`
*Track actions for metrics*

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK (uuid) |
| user_id | TEXT | FK to users |
| action | TEXT | 'created_pitch', 'submitted', 'commented', etc. |
| target_type | TEXT | 'pitch' / 'research' / 'chat' |
| target_id | TEXT | FK to target |
| metadata | TEXT | JSON - extra details |
| created_at | DATETIME | |

---

### JSON Structures

**sources** (pitches, research_objects):
```json
[
  { "id": 1, "title": "ANSI/ASA S12.60", "author": "ASA" },
  { "id": 2, "title": "Classroom Acoustics", "url": "https://..." }
]
```

**partners** (pitches, research_objects):
```json
["UT Austin", "Texas A&M", "TASA"]
```

**comments** (pitches, research_objects):
```json
[{ "user_name": "Alex Wickes", "message": "...", "timestamp": "2026-01-15T10:30:00Z" }]
```

**researchers** (research_objects):
```json
["Alex Wickes", "Brenda Swirczynski"]
```

**messages** (chat_sessions):
```json
[
  { "role": "user", "content": "I want to research acoustic design...", "timestamp": "..." },
  { "role": "assistant", "content": "Great topic! Let me help...", "timestamp": "..." }
]
```

**metadata** (activity_log):
```json
{ "old_status": "draft", "new_status": "pending", "ip": "..." }
```

---

### Status Values

**Pitch:**
| Status | Description |
|--------|-------------|
| greenlit_available | Pre-approved, unclaimed |
| draft | User working on it |
| pending | Awaiting review |
| revise | Needs changes |
| greenlit | Approved → becomes Research Object |
| rejected | Not approved |

**Research Object:**
| Status | Description |
|--------|-------------|
| draft | Just created |
| in_progress | Active work |
| review | Final review |
| approved | Live on Portfolio |

---

### Status Flows

**GreenLit Topic:** `greenlit_available` → claim → `greenlit` → Research Object

**Custom Pitch:** `draft` → `pending` → `greenlit` / `revise` / `rejected`

**Research:** `draft` → `in_progress` → `review` → `approved`

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
│  • Appears on TheRepo                                               │
│  • Has project dashboard with blocks                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Research Object Schema (New Table)

**Table: research_objects**
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | Primary key (X26-RB01) |
| pitch_id | TEXT | FK to pitches (origin) |
| title | TEXT | From pitch or updated |
| status | TEXT | 'draft', 'in_progress', 'review', 'approved' |
| researchers | TEXT | JSON array of user_ids |
| config_data | TEXT | JSON - the research.ts content being built |
| blocks | TEXT | JSON array - block configs for dashboard |
| metrics | TEXT | JSON - uploaded metrics data |
| images | TEXT | JSON array - image URLs/references |
| comments | TEXT | JSON array (see below) |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**Comments Structure (JSON in research_objects.comments):**
```json
[
  {
    "id": "c1",
    "user_name": "Alex Wickes",
    "user_id": "azure-oid-123",
    "message": "Added the survey results from Phase 1",
    "timestamp": "2026-01-15T10:30:00Z"
  },
  {
    "id": "c2",
    "user_name": "Christian Owens",
    "user_id": "azure-oid-456",
    "message": "Looks good, can we add the comparison chart?",
    "timestamp": "2026-01-15T14:22:00Z"
  }
]
```

### Permissions Model

**Simple approach - no roles table needed:**

| User Type | Pitches | Research Objects |
|-----------|---------|------------------|
| **Regular User** | See own pitches only | See research they're assigned to |
| **Reviewer** | See ALL pitches | See ALL research objects |

**Implementation:**
```typescript
// Check if user is reviewer (hardcoded list or Azure AD group)
const REVIEWERS = ['christian.owens@pfluger', 'alex.wickes@pfluger'];
const isReviewer = REVIEWERS.includes(user.email);

// Pitch query
const pitches = isReviewer
  ? await db.select().from('pitches')
  : await db.select().from('pitches').where('user_id', user.id);

// Research query
const research = isReviewer
  ? await db.select().from('research_objects')
  : await db.select().from('research_objects')
      .where('researchers', 'LIKE', `%${user.id}%`);
```

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

### Pitch Workflow Development Tasks

#### Week 1 (Pre-Decision): Can Do Now
- [ ] Design D1 schema (tables above)
- [ ] Document API endpoints needed
- [ ] Audit existing UI for gaps

#### Week 2 (If Approved): Backend Integration
| Day | Task |
|-----|------|
| Mon | Create D1 tables (pitches, research_objects) |
| Mon | Seed GreenLit topics (pitches with is_greenlit_topic=TRUE) |
| Tue | API: POST /pitches (create custom pitch) |
| Tue | API: GET /pitches (my pitches + available GreenLit topics) |
| Tue | API: POST /pitches/:id/claim (claim a GreenLit topic) |
| Wed | API: PATCH /pitches/:id (edit, add comment) |
| Wed | API: PATCH /pitches/:id/status (reviewer action) |
| Thu | Connect PitchSubmission.tsx to APIs |
| Thu | GreenLit status → create Research Object |
| Fri | Replace hardcoded MY_PITCHES + GREENLIT_TOPICS |

#### Week 3 (If Approved): Research Workspace + Polish
| Day | Task |
|-----|------|
| Mon | "My Research" page (list view) |
| Mon | Research Workspace layout (chat + preview + comments) |
| Tue | GreenLit → Research Object flow |
| Tue | Comment thread component (reuse for pitch + research) |
| Wed | Replace mock data in TheRepo.tsx with Claude API |
| Wed | RAG with project data |
| Thu | "Submit for Review" + "Approve" actions |
| Thu | Approved → goes live on Portfolio |
| Fri | Integration testing + bug fixes |

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

### Remaining Questions

1. **Notifications:**
   - Email on status change? (Resend)
   - In-app notifications?
   - Both?

2. **Image storage:**
   - Cloudflare R2?
   - OpenAsset integration?
   - Direct upload or URL reference?

3. **VP code integration:**
   - Does Research Object ID map to VP code?
   - Who creates the VP code? (Manual vs auto)

---

## Summary: What's Blocked vs Not Blocked

### NOT BLOCKED (Can Do Now)
- [ ] Block system accuracy check
- [ ] Research.ts data accuracy
- [ ] D1 schema design (documented above: pitches, research_objects)
- [ ] API endpoint documentation
- [ ] "My Research" page UI scaffold (list view)
- [ ] Research Workspace UI scaffold (chat + preview + comments layout)
- [ ] Reusable Comment Thread component
- [ ] Project sources audit
- [ ] Replace Unsplash images (if assets available)
- [ ] UI polish and refinements

### BLOCKED BY TECH STACK DECISION
- [ ] D1 database setup (pitches + research_objects tables)
- [ ] SSO/Azure AD integration
- [ ] Claude API integration (agent for research workspace)
- [ ] RAG implementation
- [ ] Email notifications (Resend)
- [ ] Image storage (Cloudflare R2)
- [ ] Claim GreenLit topic → assign user
- [ ] GreenLit status → create Research Object
- [ ] Research Object → researchConfig.ts generation
- [ ] Real hours tracking backend

### BLOCKED BY OTHER DECISIONS
| Task | Blocked By |
|------|------------|
| VP code integration | Decision #5 (LP, LF, JS) |
| Staff assignment features | Decision #5 communication chain |
| Public content | Decision #3 sign-off (CO, CC) |
| Marketing pipeline | Decision #3 (CO, CC) |

---

## Risk Mitigation

**If tech stack delayed past 1/8:**
- Every week of delay compresses the schedule
- SSO alone needs ~1 week of work
- D1 + forms need ~1 week
- Claude RAG needs ~0.5-1 week
- Minimum viable: 2.5 weeks from approval to launch

**Fallback options:**
1. **Public-only launch** - No internal features, just showcase
2. **Phased launch** - Public first, internal features in February
3. **Demo mode** - Full UI with mock data, real backend in Q2

---

## Key Meetings This Month

| Date | Time | Meeting | Attendees | Decision |
|------|------|---------|-----------|----------|
| Wed 1/8 | 1-2pm | Software & Infrastructure | CO, CM, LP, LF | Tech stack |
| Thu 1/9 | 11am-noon | R&B Launch Planning | CO | Launch date |
| Thu 1/9 | 3-4pm | Vision BD+I Dashboard | CC, DY, CO | Vision rollout |
| TBD | TBD | Project Prism | Terry, Tavo, AW | SaaS model |
| TBD | TBD | Turf Melting | CO, TS | RB11 scope |

---

*Last updated: January 7, 2026*
