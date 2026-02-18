# Adding a New Project to The Repository

This document covers everything needed to add a new research project from scratch — database schema, block types with JSON examples, code changes, and the SQL template. An agent should be able to one-shot a new project using this file alone.

---

## Overview: What Needs to Happen

1. Insert a row into the `projects` table in Supabase
2. Insert block rows into `project_blocks` in Supabase
3. Add project metadata to `src/services/projects.ts`
4. Add the project ID to `PROJECTS_WITH_DASHBOARDS` in `src/views/Explore/Portfolio.tsx`
5. ~~Add a row to the CSV~~ — no longer needed, Supabase is the only source

Steps 1 and 2 are SQL. Steps 3 and 4 are small code edits. Step 5 is a CSV append.

---

## Project ID Format

Projects follow the format `X[YY]-RB[NN]`:
- `X` = prefix
- `YY` = two-digit year (e.g., 26 for 2026)
- `RB` = Research & Benchmarking
- `NN` = two-digit sequence number

Examples: `X24-RB01`, `X25-RB13`, `X26-RB01`

---

## Shareable URL Slugs

Projects can have a short, human-readable URL in addition to their ID-based URL.

- `/explore/X26-RB01` — always works (ID-based)
- `/explore/MidlandFFE` — works if a slug is set

To add a slug to a project:
```sql
UPDATE projects SET slug = 'YourSlug' WHERE id = 'X26-RB01';
```

Slugs are unique across all projects. The app resolves slugs dynamically from Supabase — no code changes needed to add or change a slug.

---

## Step 1: Insert into `projects` Table

### Schema

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | text | yes | Project ID, e.g. `X26-RB01` |
| `title` | text | yes | Short project name |
| `description` | text | yes | 1-2 sentence summary |
| `category` | text | yes | See valid values below |
| `phase` | text | yes | `Pre-Research`, `Developmental`, or `Completed` |
| `latitude` | numeric | yes | Map coordinates |
| `longitude` | numeric | yes | Map coordinates |
| `start_date` | date | yes | Format: `YYYY-MM-DD` |
| `completion_date` | date | no | Null if ongoing |
| `office` | text | yes | See valid values below — check constraint enforced |
| `total_hours` | numeric | yes | Estimated or actual hours |
| `is_confidential` | boolean | yes | `false` for public projects |
| `accent_color` | text | yes | Hex color, e.g. `#B5BD00` |
| `created_at` | timestamptz | yes | Use `now()` |
| `updated_at` | timestamptz | yes | Use `now()` |
| `created_by` | uuid | no | FK to `users.id`, can be null |

### Valid `category` Values
- `psychology`
- `sustainability`
- `immersive`
- `health-safety`
- `campus-life`
- `fine-arts`
- `documentation`
- `recognition`

### Valid `office` Values (check constraint: `projects_office_check`)
- `Austin`
- `San Antonio`
- `Corpus Christi`
- `Dallas`

> If adding a new office, run this first:
> ```sql
> ALTER TABLE projects DROP CONSTRAINT projects_office_check;
> ALTER TABLE projects ADD CONSTRAINT projects_office_check CHECK (office IN ('Austin', 'San Antonio', 'Corpus Christi', 'Dallas', 'NewOffice'));
> ```

### Accent Colors by Category
| Category | Color |
|----------|-------|
| Psychology | `#9A3324` |
| Health & Safety | `#f16555` |
| Sustainability | `#67823A` |
| Immersive Learning | `#00A9E0` |
| Campus Life | `#B5BD00` |
| Fine Arts | `#F2A900` |

### Example INSERT
```sql
INSERT INTO "public"."projects" (
  "id", "title", "description", "category", "phase",
  "latitude", "longitude", "start_date", "completion_date",
  "office", "total_hours", "is_confidential", "accent_color",
  "created_at", "updated_at", "created_by"
) VALUES (
  'X26-RB01',
  'Midland Furniture Pilot',
  'Classroom FFE survey analysis from a one-semester furniture pilot across 4 Midland ISD campuses',
  'campus-life',
  'Completed',
  '31.99730000', '-102.07790000',
  '2025-09-01', '2026-02-07',
  'Dallas', '20', 'false', '#B5BD00',
  now(), now(), null
);
```

---

## Step 2: Insert into `project_blocks` Table

### Schema

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | text | yes | Unique block ID, e.g. `x26-rb01-section-intro` |
| `project_id` | text | yes | FK to `projects.id` — must exist first |
| `block_type` | text | yes | One of 21 block types (see below) |
| `block_order` | int | yes | Sequential display order starting at 1 |
| `data` | jsonb | yes | Block-specific JSON content (see schemas below) |
| `summary` | text | no | RAG: short summary for AI search |
| `tags` | text[] | no | RAG: searchable tag array |
| `searchable_text` | text | no | RAG: full-text content for search |
| `conclusions` | text[] | no | RAG: key takeaways for AI synthesis |

### Block ID Convention
`[project-id-lowercase]-[block-type]-[descriptor]`
Example: `x26-rb01-section-intro`, `x26-rb01-feedback-students`

### SQL Format (use dollar-quoting to avoid JSON escaping issues)
```sql
INSERT INTO project_blocks (id, project_id, block_type, block_order, data) VALUES
('x26-rb01-section-intro', 'X26-RB01', 'section', 1, $${"title": "My Section Title"}$$::jsonb),
('x26-rb01-stat-grid', 'X26-RB01', 'stat-grid', 2, $${"columns": 4, "stats": [...]}$$::jsonb);
```

> Always use `$$...$$::jsonb` dollar-quoting. Single-quoted JSON strings fail on newline characters.

---

## Step 3: Block Type Reference

### `section`
Section divider with large title. Use to break up the dashboard into named parts.

```json
{
  "title": "Section Title",
  "sources": [1, 2]
}
```
- `sources`: optional array of source ID numbers, shown as small badges

---

### `stat-grid`
Grid of key metrics. Good for top-of-page summary numbers.

```json
{
  "columns": 4,
  "stats": [
    { "label": "Students Surveyed", "value": "321", "detail": "Across 4 campuses", "trend": "up" }
  ]
}
```
- `columns`: 2, 3, or 4
- `trend`: `"up"`, `"down"`, or `"neutral"` (optional)

---

### `text-content`
Markdown-rendered text block. Supports headers (`##`), bold (`**text**`), bullets, and newlines (`\n`).

```json
{
  "content": "## Overview\n\nThis is a paragraph.\n\n**Key point:** Something important."
}
```

---

### `timeline`
Project event timeline, horizontal or vertical.

```json
{
  "layout": "horizontal",
  "events": [
    { "date": "Fall 2025", "title": "Pilot Semester", "description": "One semester pilot", "status": "complete" },
    { "date": "May 2026", "title": "Sample Rodeo", "description": "Stakeholder presentation", "status": "pending" }
  ]
}
```
- `layout`: `"horizontal"` or `"vertical"`
- `status`: `"complete"`, `"in-progress"`, or `"pending"`

---

### `key-findings`
Icon-based finding cards. Good for top insights.

```json
{
  "findings": [
    { "title": "Size Matters", "value": "45%", "detail": "Students prioritize workspace size above comfort", "icon": "Maximize2" }
  ]
}
```
- `icon`: any Lucide icon name (e.g., `"Brain"`, `"Leaf"`, `"Users"`, `"TrendingUp"`)

---

### `bar-chart`
Horizontal bar chart. Supports four modes.

**Single bar (simple):**
```json
{
  "items": [
    { "label": "Chair 3", "value": 46.6, "color": "#9A3324" },
    { "label": "Chair 1", "value": 20.1 }
  ],
  "unit": "%",
  "showValues": true
}
```

**Multi-bar (multiple bar sets):**
```json
{
  "bars": [
    { "title": "Students", "items": [{ "label": "Chair 3", "value": 46.6 }] },
    { "title": "Teachers", "items": [{ "label": "Chair 4", "value": 40 }] }
  ]
}
```

**Grouped (collapses on hover):**
```json
{
  "groups": [
    { "label": "Comfort", "color": "#00A9E0", "items": [{ "label": "Chair 1", "value": 96 }] }
  ]
}
```

- `legendPosition`: `"inline"`, `"end"`, or `"none"`

---

### `donut-chart`
Circular donut chart with center label.

```json
{
  "centerLabel": "Total",
  "total": 321,
  "segments": [
    { "label": "Chair 3", "value": 130, "color": "#9A3324" },
    { "label": "Chair 1", "value": 56, "color": "#00A9E0" }
  ]
}
```

---

### `comparison-table`
Side-by-side comparison table. Good for feature matrices.

```json
{
  "headers": ["Feature", "Chair 1", "Chair 2", "Chair 3"],
  "rows": [
    { "label": "Comfort Rating", "values": ["96.4%", "93.3%", "90.0%"], "highlight": true },
    { "label": "Backpack Hook", "values": ["Yes", "No", "No"] }
  ]
}
```
- `highlight`: optional boolean to visually emphasize a row

---

### `image-gallery`
Responsive image grid with lightbox on click.

```json
{
  "columns": 3,
  "images": [
    { "src": "projects/x26-rb01/chair-3.jpg", "alt": "Chair 3", "caption": "Most popular student chair" }
  ]
}
```
- `src`: path within Supabase Storage bucket (`Repository Bucket/`)
- `columns`: 2, 3, or 4

---

### `survey-rating`
1–5 star rating distribution bar chart.

```json
{
  "title": "How comfortable is Chair 3?",
  "totalResponses": 130,
  "averageRating": 4.2,
  "color": "#9A3324",
  "ratings": [
    { "rating": 5, "count": 60, "label": "Very Comfortable" },
    { "rating": 4, "count": 40 },
    { "rating": 3, "count": 20 },
    { "rating": 2, "count": 7 },
    { "rating": 1, "count": 3 }
  ]
}
```

---

### `feedback-summary`
Split positive/negative theme list with animated activity rings. Score is 0–100 for ring fill.

```json
{
  "positives": {
    "title": "What Works",
    "score": 93,
    "themes": [
      { "theme": "Comfort", "mentions": 137, "description": "Most cited reason for preferring a chair" }
    ]
  },
  "concerns": {
    "title": "What Needs Work",
    "score": 62,
    "themes": [
      { "theme": "Desk Size", "mentions": 49, "description": "Desks need to be bigger" }
    ]
  }
}
```

---

### `quotes`
Testimonial/quote cards in a grid.

```json
{
  "columns": 2,
  "quotes": [
    { "text": "because it is wide and also big for a person", "author": "Student #1, Midland Freshman", "rating": 5 }
  ]
}
```
- `columns`: 1, 2, or 3
- `rating`: optional 1–5 star display
- `source`: optional small label (e.g., `"Survey page 4"`)

---

### `product-options`
Product line showcase with expandable comparison. Each `line` is a product, each `option` within a line is a variant.

```json
{
  "columns": 4,
  "showSpecs": true,
  "lines": [
    {
      "name": "Chair 3",
      "subtitle": "Student Favorite — 46.6%",
      "image": "projects/x26-rb01/chair-3.jpg",
      "options": [
        {
          "name": "Chair 3",
          "price": 0,
          "color": "#9A3324",
          "specs": [
            { "label": "Students preferred", "value": "46.6%" },
            { "label": "Comfort rating", "value": "90.0%" }
          ],
          "costs": [
            { "label": "Labor", "value": 60, "color": "#9A3324" },
            { "label": "Materials", "value": 40, "color": "#F2A900" }
          ]
        }
      ]
    }
  ]
}
```
- `price`: required number, shows as currency — use 0 if no pricing data
- `costs`: optional percentage breakdown bar (values should sum to 100)
- `image`: optional Supabase Storage path

---

### `tool-comparison`
Rating rings with pros/cons. Good for comparing software tools or methods.

```json
{
  "columns": 3,
  "tools": [
    {
      "name": "Rhino",
      "rating": 85,
      "color": "#00A9E0",
      "price": "$995",
      "category": "3D Modeling",
      "description": "Surface modeling for complex geometry",
      "pros": ["Flexible", "Plugin ecosystem"],
      "cons": ["Learning curve"]
    }
  ]
}
```
- `rating`: 0–100 for the ring fill percentage

---

### `case-study-card`
Scrollable project/case study cards with expandable detail modals.

```json
{
  "columns": 2,
  "studies": [
    {
      "id": "cs-001",
      "title": "Canyon ISD",
      "subtitle": "Flexible Learning Pilot",
      "image": "projects/x25-rb01/canyon-isd.jpg",
      "tags": ["K-12", "Texas", "Retrofit"],
      "description": "Redesigned two classrooms with flexible furniture...",
      "metrics": [{ "label": "Student satisfaction", "value": "+22%" }],
      "strategies": [{ "name": "Flexible seating", "impact": "High" }],
      "location": "Canyon, TX",
      "year": 2024
    }
  ]
}
```

---

### `workflow-steps`
Numbered process steps with findings, deliverables, and outcomes.

```json
{
  "steps": [
    {
      "number": 1,
      "title": "Data Collection",
      "status": "complete",
      "findings": ["321 student responses collected", "7 teacher responses collected"],
      "deliverables": ["Raw CSV exports", "Survey question mapping"],
      "outcomes": ["Clean dataset ready for analysis"]
    }
  ]
}
```
- `status`: `"complete"`, `"active"`, or `"pending"`

---

### `scenario-bar-chart`
Cost scenario comparison with a base total and cost-per-SF.

```json
{
  "baseTotal": 5000000,
  "unit": "USD",
  "scenarios": [
    { "name": "Base Scope", "total": 5000000, "costPerSF": 250 },
    { "name": "Add Mass Timber", "total": 5750000, "costPerSF": 287 }
  ]
}
```

---

### `cost-builder`
Interactive budget builder with toggleable add/deduct alternates.

```json
{
  "baseTotal": 5000000,
  "area": 20000,
  "alternates": [
    { "id": 1, "description": "Upgrade to mass timber structure", "amount": 750000, "type": "add" },
    { "id": 2, "description": "Remove decorative facade", "amount": 200000, "type": "deduct" }
  ]
}
```

---

### `activity-rings`
Apple-style concentric rings in a grid. Good for multi-metric comparisons by vendor or category.

```json
{
  "columns": 3,
  "groups": [
    {
      "vendor": "Manufacturer A",
      "color": "#9A3324",
      "items": [
        {
          "title": "Chair 3",
          "subtitle": "Student favorite",
          "centerValue": "46.6%",
          "centerLabel": "preferred",
          "rings": [
            { "name": "Preferred", "value": 47, "color": "#9A3324" },
            { "name": "Comfortable", "value": 90, "color": "#F2A900" },
            { "name": "Can sit all class", "value": 89, "color": "#67823A" }
          ]
        }
      ]
    }
  ]
}
```
- Each item supports up to 3 rings
- `value`: 0–100 for ring fill percentage

---

### `sources`
Citation list at the end of a project.

```json
{
  "sources": [
    { "id": 1, "title": "Student Survey Questions", "author": "Midland ISD", "url": "https://..." }
  ]
}
```
- `id`: number that matches `[n]` citation references used elsewhere
- `url`: optional

---

## Step 4: Code Changes

### `src/services/projects.ts`
Add to `PROJECT_METADATA`:

```typescript
'X26-RB01': {
  id: 'X26-RB01',
  title: 'Midland Furniture Pilot',
  code: 'X26-RB01',
  subtitle: 'Classroom FFE Survey Analysis',
  category: 'campus-life',
  researcher: 'Wendy Rosamond, Alexander Wickes',
  totalHours: 20,
  accentColor: '#B5BD00',
},
```

### `src/views/Explore/Portfolio.tsx`
Add the project ID to `PROJECTS_WITH_DASHBOARDS`:

```typescript
const PROJECTS_WITH_DASHBOARDS = [
  'X24-RB01', 'X25-RB01', ..., 'X26-RB01', 'X00-DEMO'
];
```

---

---

## Database Foreign Key Map

| Table | Column | References |
|-------|--------|-----------|
| `calendar_events` | `created_by` | `users.id` |
| `calendar_events` | `project_id` | `projects.id` |
| `collaboration_requests` | `reviewed_by` | `users.id` |
| `contact_projects` | `project_id` | `projects.id` |
| `contact_projects` | `contact_id` | `contacts.id` |
| `contacts` | `created_by` | `users.id` |
| `pitch_ai_sessions` | `pitch_id` | `pitches.id` |
| `pitch_ai_sessions` | `user_id` | `users.id` |
| `pitch_collaborators` | `pitch_id` | `pitches.id` |
| `pitch_collaborators` | `user_id` | `users.id` |
| `pitch_comments` | `pitch_id` | `pitches.id` |
| `pitch_comments` | `user_id` | `users.id` |
| `pitches` | `user_id` | `users.id` |
| `project_blocks` | `project_id` | `projects.id` |
| `project_partners` | `project_id` | `projects.id` |
| `project_researchers` | `project_id` | `projects.id` |
| `project_researchers` | `user_id` | `users.id` |
| `project_sources` | `project_id` | `projects.id` |
| `project_updates` | `project_id` | `projects.id` |
| `project_updates` | `user_id` | `users.id` |
| `projects` | `created_by` | `users.id` |
| `repo_ai_sessions` | `user_id` | `users.id` |
| `user_page_views` | `user_id` | `users.id` |

---

## Full SQL Template

Copy this pattern for a new project. Run both statements in order in the Supabase SQL editor.

```sql
-- 1. Insert project (must come before blocks)
INSERT INTO "public"."projects" (
  "id", "title", "description", "category", "phase",
  "latitude", "longitude", "start_date", "completion_date",
  "office", "total_hours", "is_confidential", "accent_color",
  "created_at", "updated_at", "created_by"
) VALUES (
  'X26-RB02',               -- project ID
  'Project Title',
  'One to two sentence description of what this project is about.',
  'campus-life',            -- see valid category values above
  'Developmental',          -- Pre-Research | Developmental | Completed
  '30.26720000',            -- latitude
  '-97.74310000',           -- longitude
  '2026-01-01',             -- start_date
  null,                     -- completion_date (null if ongoing)
  'Austin',                 -- office (check constraint enforced)
  '40',                     -- total_hours
  'false',                  -- is_confidential
  '#00A9E0',                -- accent_color
  now(), now(), null
);

-- 2. Insert blocks (use $$...$$ dollar-quoting for all JSON)
INSERT INTO project_blocks (id, project_id, block_type, block_order, data) VALUES
('x26-rb02-section-intro', 'X26-RB02', 'section', 1,
  $${"title": "Project Title"}$$::jsonb),

('x26-rb02-stat-grid', 'X26-RB02', 'stat-grid', 2,
  $${"columns": 4, "stats": [{"label": "Label", "value": "100", "detail": "Context", "trend": "up"}]}$$::jsonb),

('x26-rb02-text-overview', 'X26-RB02', 'text-content', 3,
  $${"content": "## Overview\n\nProject description here."}$$::jsonb),

('x26-rb02-sources', 'X26-RB02', 'sources', 4,
  $${"sources": [{"id": 1, "title": "Source Title", "author": "Author Name"}]}$$::jsonb);
```
