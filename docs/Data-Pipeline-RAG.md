# Data Pipeline & RAG Architecture

This document explains how project content flows from TypeScript configs to Supabase to the RAG-powered AI assistant.

---

## Overview

```
TypeScript Configs (.ts)  →  Supabase Tables  →  RAG Search  →  Claude Response
     (source)                  (database)         (query)         (output)
```

---

## 1. Source: TypeScript Block Configs

Each research project has a config file defining its content using typed blocks.

**Location:** `src/data/projects/[ID]-[name]/project/[name]Config.ts`

**Example:**
```typescript
export const immersiveConfig: ProjectConfig = {
  id: 'X24-RB01',
  title: 'Immersive Learning',
  category: 'immersive',
  researcher: 'Alex Wickes',
  blocks: [
    {
      type: 'section',
      id: 'section-overview',
      data: { title: 'Overview', sources: [1, 2, 3] }
    },
    {
      type: 'text-content',
      id: 'overview-intro',
      data: {
        content: '**Immersive Learning** is learning with a physical experience...'
      }
    },
    {
      type: 'sources',
      id: 'sources-list',
      data: {
        sources: [
          { id: 1, title: 'Types of Experiential Learning', author: 'University of Tennessee', url: '...' },
          // ...
        ]
      }
    }
  ]
};
```

### Block Types (21 total)

| Block Type | Data Fields | Searchable Content |
|------------|-------------|-------------------|
| `text-content` | `content` | Full text content |
| `section` | `title`, `sources` | Section title |
| `key-findings` | `findings[]` | Finding titles + details |
| `workflow-steps` | `steps[]` | Step titles + descriptions |
| `stat-grid` | `stats[]` | Stat labels + values |
| `case-study-card` | `studies[]` | Study titles + descriptions |
| `comparison-table` | `headers[]`, `rows[]` | All text content |
| `sources` | `sources[]` | Source titles + authors |
| `product-options` | `lines[]` | Product names + descriptions |
| `tool-comparison` | `tools[]` | Tool names + descriptions |
| `bar-chart` | `groupedBars[]` | Bar titles/labels |
| `donut-chart` | `segments[]`, `centerLabel` | Segment labels |
| `timeline` | `events[]` or `projectEvents[]` | Event titles |
| `cost-builder` | `alternates[]` | Alternate names |
| `scenario-bar-chart` | `scenarios[]` | Scenario names |
| `survey-rating` | `title`, `ratings[]` | Title + rating labels |
| `feedback-summary` | `positives`, `concerns` | Theme names |
| `image-gallery` | `images[]` | Alt text + captions (optional) |
| `quotes` | `quotes[]` | Quote text |
| `activity-rings` | `rings[]` | Ring labels |

---

## 2. Database: Supabase Schema

### Tables

```sql
-- Core project data
projects (
  id TEXT PRIMARY KEY,        -- 'X24-RB01'
  title TEXT,
  description TEXT,
  category TEXT,
  phase TEXT,                 -- 'Pre-Research', 'Developmental', 'Completed'
  ...
)

-- Block content (RAG searches this)
project_blocks (
  id TEXT PRIMARY KEY,        -- 'overview-intro'
  project_id TEXT,            -- FK to projects
  block_type TEXT,            -- 'text-content', 'section', etc.
  block_order INTEGER,
  data JSONB,                 -- Original block data
  searchable_text TEXT,       -- ** CRITICAL FOR RAG **
  tags TEXT[],
  conclusions TEXT[],
  source_ids TEXT[],          -- Links to project_sources
  embedding VECTOR,           -- For vector search (future)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Academic sources/citations
project_sources (
  id TEXT PRIMARY KEY,
  project_id TEXT,            -- FK to projects
  title TEXT,
  author TEXT,
  url TEXT,
  ...
)
```

### Critical Column: `searchable_text`

**This is what the RAG searches against.** If `searchable_text` is NULL or empty, the RAG cannot find the block.

---

## 3. RAG Flow

```
User Query: "What is immersive learning?"
         ↓
    Text Search
    (searches searchable_text column)
         ↓
    Matching Blocks Retrieved
    (with project_id, source_ids)
         ↓
    Sources Joined
    (project_sources linked via source_ids)
         ↓
    Context Sent to Claude
    (blocks + sources + user query)
         ↓
    Claude Response
    (with citations like [1] X24-RB01 Title...)
```

### Search Query (simplified)

```sql
SELECT b.*, p.title as project_title,
       array_agg(s.*) as sources
FROM project_blocks b
JOIN projects p ON b.project_id = p.id
LEFT JOIN project_sources s ON s.id = ANY(b.source_ids)
WHERE b.searchable_text ILIKE '%immersive%'
   OR b.searchable_text ILIKE '%learning%'
GROUP BY b.id, p.id;
```

---

## 4. Data Migration: .ts → Supabase

When migrating block configs to Supabase, **you must populate `searchable_text`**.

### Extraction Rules by Block Type

```sql
-- text-content: direct content
UPDATE project_blocks
SET searchable_text = data->>'content'
WHERE block_type = 'text-content';

-- section: title
UPDATE project_blocks
SET searchable_text = data->>'title'
WHERE block_type = 'section';

-- key-findings: aggregate findings
UPDATE project_blocks
SET searchable_text = (
  SELECT string_agg(f->>'title' || ': ' || COALESCE(f->>'detail', ''), ' | ')
  FROM jsonb_array_elements(data->'findings') f
)
WHERE block_type = 'key-findings';

-- sources: aggregate titles + authors
UPDATE project_blocks
SET searchable_text = (
  SELECT string_agg(s->>'title' || ' by ' || COALESCE(s->>'author', ''), ' | ')
  FROM jsonb_array_elements(data->'sources') s
)
WHERE block_type = 'sources';

-- workflow-steps: aggregate steps
UPDATE project_blocks
SET searchable_text = (
  SELECT string_agg(s->>'title' || ': ' || COALESCE(s->>'description', ''), ' | ')
  FROM jsonb_array_elements(data->'steps') s
)
WHERE block_type = 'workflow-steps';
```

### Full Migration Script

See: `scripts/populate-searchable-text.sql` (TODO: create this)

---

## 5. Troubleshooting

### RAG can't find a project

**Symptom:** User asks about a project, Claude gives vague answers without citations.

**Diagnosis:**
```sql
SELECT project_id,
       COUNT(*) as total_blocks,
       COUNT(searchable_text) as with_text
FROM project_blocks
GROUP BY project_id;
```

**Fix:** Run the extraction queries above for missing blocks.

### Example: Immersive Learning Bug (Jan 2026)

**Problem:** RAG found Sanctuary Spaces but not Immersive Learning.

**Root cause:**
| Project | Blocks | searchable_text populated |
|---------|--------|--------------------------|
| X25-RB01 (Sanctuary) | 18 | 9 |
| X24-RB01 (Immersive) | 45 | **0** |

**Solution:** Ran extraction queries to populate `searchable_text` for all 45 blocks.

---

## 6. Checklist: Adding a New Project

1. **Create TypeScript config** in `src/data/projects/[ID]-[name]/project/`
2. **Migrate to Supabase:**
   - Insert row in `projects` table
   - Insert rows in `project_blocks` table (one per block)
   - Insert rows in `project_sources` table
3. **Populate searchable_text** for each block using extraction rules
4. **Verify RAG can find it:**
   ```sql
   SELECT COUNT(*) FROM project_blocks
   WHERE project_id = '[ID]'
   AND searchable_text IS NOT NULL
   AND searchable_text != '';
   ```

---

## 7. Future: Vector Embeddings

The `project_blocks` table has an `embedding` column (type: VECTOR) for semantic search.

**Current status:** Not implemented (cost constraint)

**When implemented:**
1. Generate embeddings for each block's `searchable_text` via Claude/OpenAI API
2. Store in `embedding` column
3. Use pgvector similarity search instead of ILIKE
4. Better semantic matching (e.g., "VR in education" matches "immersive learning")

---

## Quick Reference

### Connection String (Session Pooler)
```
postgresql://postgres.bydkzxqmgsvsnjtafphj:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### Check All Projects Status
```sql
SELECT project_id,
       COUNT(*) as total,
       COUNT(searchable_text) as with_text,
       COUNT(*) FILTER (WHERE block_type = 'image-gallery') as images
FROM project_blocks
GROUP BY project_id
ORDER BY project_id;
```

### Populate Missing searchable_text (All Projects)
```sql
-- Run each block type's extraction query
-- See Section 4 above
```
