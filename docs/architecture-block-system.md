# EZRA Block-Based Project Page Architecture

## Overview

This document outlines the architecture for EZRA's project page system, designed to:
1. Enable easy creation of new project pages without code changes
2. Support AI/RAG integration for The Repo search
3. Maintain UI/UX consistency across varied research types
4. Separate working documents (Egnyte) from published content (EZRA)

---

## Architecture Diagram

```
Egnyte (Working Space)              EZRA (Published Space)
        │                                   │
        ├── Drafts                          ├── content/projects/*.json
        ├── Research docs                   ├── BlockRenderer component
        ├── Raw data                        ├── The Repo (AI search)
        ├── Collaboration                   └── Rendered project pages
        └── File storage

        "Kitchen"                           "Restaurant"
```

---

## The Block System

### Concept

Instead of custom React components per project, pages are composed of reusable **blocks**. Each project is defined by a JSON configuration file that specifies which blocks to render and in what order.

**Benefits:**
- No code changes to add new projects
- Consistent UI/UX across all projects
- AI can read/search structured JSON data (RAG-ready)
- Infinite flexibility through block composition
- Single source of truth for UI and AI

### Block Types

| Block Type | Purpose | Data Structure |
|------------|---------|----------------|
| `hero` | Page header with title, subtitle, image | `{ title, subtitle, image?, category, phase }` |
| `text` | Markdown content sections | `{ content: "## Heading\n..." }` |
| `metrics` | Key statistics cards | `{ items: [{ label, value, unit?, change? }] }` |
| `chart-bar` | Bar/column comparisons | `{ title, data: [{ name, values }] }` |
| `chart-donut` | Composition breakdown | `{ title, data: [{ category, value, color }] }` |
| `chart-line` | Trends over time | `{ title, data: [{ date, value }] }` |
| `timeline` | Project phases | `{ phases: [{ name, start, end, hours? }] }` |
| `comparison` | Before/after, A vs B | `{ before: {...}, after: {...} }` |
| `gallery` | Image grid | `{ images: [{ src, caption? }] }` |
| `findings` | Key takeaways list | `{ items: ["Finding 1", "Finding 2"] }` |
| `table` | Data tables | `{ headers: [...], rows: [[...]] }` |
| `quote` | Callout/testimonial | `{ text, author?, source? }` |
| `embed` | Video, PDF, external | `{ type: "video"|"pdf", url }` |

---

## File Structure

```
content/
  projects/
    X25-RB01.json
    X25-RB02.json
    X25-RB05.json
    X25-RB07.json
    ...

src/
  components/
    blocks/
      HeroBlock.tsx
      TextBlock.tsx
      MetricsBlock.tsx
      ChartBarBlock.tsx
      ChartDonutBlock.tsx
      ChartLineBlock.tsx
      TimelineBlock.tsx
      ComparisonBlock.tsx
      GalleryBlock.tsx
      FindingsBlock.tsx
      TableBlock.tsx
      QuoteBlock.tsx
      EmbedBlock.tsx
      index.tsx          # BlockRenderer component

  views/
    ProjectPage.tsx      # Generic page that loads JSON and renders blocks
```

---

## JSON Schema

### Example: Post-Occupancy Study

```json
{
  "id": "X25-RB01",
  "title": "Sanctuary Spaces",
  "subtitle": "Post-Occupancy Evaluation of Quiet Rooms in K-12",
  "category": "Psychology",
  "phase": "Completed",
  "team": ["Katherine Wiley", "Braden Haley", "Alex Wickes"],
  "dates": {
    "start": "2024-08-01",
    "end": "2025-01-15"
  },
  "blocks": [
    {
      "type": "hero",
      "image": "hero.jpg"
    },
    {
      "type": "text",
      "content": "## Research Question\n\nHow do dedicated quiet spaces impact student well-being and self-regulation in elementary school environments?"
    },
    {
      "type": "metrics",
      "items": [
        { "label": "Survey Responses", "value": 247 },
        { "label": "Schools Studied", "value": 5 },
        { "label": "Satisfaction Rate", "value": 87, "unit": "%" }
      ]
    },
    {
      "type": "chart-bar",
      "title": "Usage by Grade Level",
      "data": [
        { "name": "K-2", "value": 45 },
        { "name": "3-5", "value": 62 },
        { "name": "6-8", "value": 38 }
      ]
    },
    {
      "type": "findings",
      "items": [
        "Students using quiet rooms showed 34% reduction in reported anxiety",
        "Teachers observed improved focus in afternoon classes",
        "Optimal room size is 80-120 sq ft for individual use"
      ]
    },
    {
      "type": "gallery",
      "images": [
        { "src": "room-1.jpg", "caption": "Manor ISD Elementary" },
        { "src": "room-2.jpg", "caption": "Pflugerville Middle School" }
      ]
    }
  ],
  "assets": {
    "path": "/images/projects/X25-RB01/"
  }
}
```

### Example: Experimental Design Study

```json
{
  "id": "X25-RB07",
  "title": "VR Classroom Experiment",
  "subtitle": "Measuring Engagement in Immersive Learning Environments",
  "category": "Immersive Learning",
  "phase": "Developmental",
  "team": ["Alex Wickes", "Jordan Lee"],
  "blocks": [
    {
      "type": "hero",
      "video": "intro.mp4"
    },
    {
      "type": "text",
      "content": "## Hypothesis\n\nStudents in VR-enhanced classrooms will demonstrate 20% higher engagement metrics compared to traditional settings."
    },
    {
      "type": "comparison",
      "title": "Traditional vs VR Classroom",
      "before": {
        "label": "Traditional",
        "metrics": { "engagement": 62, "retention": 71 }
      },
      "after": {
        "label": "VR-Enhanced",
        "metrics": { "engagement": 84, "retention": 89 }
      }
    },
    {
      "type": "timeline",
      "phases": [
        { "name": "Literature Review", "start": "2025-02", "end": "2025-03", "hours": 40 },
        { "name": "Experiment Design", "start": "2025-03", "end": "2025-04", "hours": 60 },
        { "name": "Data Collection", "start": "2025-05", "end": "2025-07", "hours": 80 },
        { "name": "Analysis", "start": "2025-08", "end": "2025-09", "hours": 40 }
      ]
    },
    {
      "type": "chart-line",
      "title": "Engagement Over Session Duration",
      "data": [
        { "minute": 0, "traditional": 80, "vr": 85 },
        { "minute": 15, "traditional": 70, "vr": 88 },
        { "minute": 30, "traditional": 55, "vr": 82 },
        { "minute": 45, "traditional": 45, "vr": 78 }
      ]
    },
    {
      "type": "quote",
      "text": "The immersive environment helped me stay focused longer than I expected.",
      "author": "Study Participant",
      "source": "Exit Interview"
    }
  ]
}
```

---

## Workflow

### Adding a New Project

**Before (old system):**
1. Create data file in `src/data/projects/`
2. Create dashboard component in `src/views/projects/`
3. Create custom chart components
4. Update routing in `App.tsx`
5. Update `PROJECTS_WITH_DASHBOARDS` arrays
6. Build and deploy

**After (block system):**
1. Add `X25-RB##.json` to `content/projects/`
2. Done

### Researcher Workflow

```
1. Researcher completes work in Egnyte
   └── research.md, data files, images

2. Researcher (or admin) uses Claude Teams
   └── Prompt: "Convert this research to EZRA blocks JSON"
   └── Input: Paste research.md content
   └── Output: Valid JSON configuration

3. Drop JSON in content/projects/
   └── Page automatically available

4. Add images to /public/images/projects/{id}/
   └── Referenced by JSON
```

### Claude Teams Prompt Template

```
You help build project pages for EZRA. Convert the following research document
into a blocks JSON configuration.

Available block types:
- hero: Page header (title, subtitle, image)
- text: Markdown content
- metrics: Key statistics cards
- chart-bar: Bar comparisons
- chart-donut: Composition breakdown
- chart-line: Trends over time
- timeline: Project phases
- comparison: Before/after analysis
- gallery: Image grid
- findings: Key takeaways
- table: Data tables
- quote: Callouts/testimonials
- embed: Video/PDF embeds

Output valid JSON only. Structure:
{
  "id": "X25-RB##",
  "title": "...",
  "subtitle": "...",
  "category": "...",
  "phase": "Pre-Research|Developmental|Completed",
  "team": [...],
  "blocks": [...]
}

Research document:
[PASTE CONTENT HERE]
```

---

## AI/RAG Integration

### The Repo Search Architecture

```
content/projects/*.json
         │
         ├──► EZRA BlockRenderer (UI)
         │
         └──► The Repo indexer (AI)
                    │
                    ├── Load all project JSONs
                    ├── Index blocks by type and content
                    ├── Search on user query
                    └── Return relevant excerpts + project refs
```

### Search Capabilities

With structured JSON, The Repo can answer:

| Query | How It Works |
|-------|--------------|
| "Which projects studied energy?" | Search all JSONs for "energy" in title, text blocks, findings |
| "What did we learn about orientation?" | Find findings blocks mentioning "orientation" |
| "Show me POE studies" | Filter by category or methodology keywords |
| "Projects with UT Austin partnership" | Search team/partner fields |
| "What's in progress?" | Filter by `phase: "Developmental"` |

### Implementation

```typescript
// The Repo enhanced search
const searchProjects = (query: string) => {
  const projects = loadAllProjectJSONs(); // from content/projects/

  return projects.filter(project => {
    // Search in structured fields
    const searchable = [
      project.title,
      project.subtitle,
      project.team.join(' '),
      // Extract text from blocks
      ...project.blocks
        .filter(b => b.type === 'text' || b.type === 'findings')
        .flatMap(b => b.content || b.items || [])
    ].join(' ').toLowerCase();

    return searchable.includes(query.toLowerCase());
  });
};
```

---

## Component Implementation

### BlockRenderer

```typescript
// src/components/blocks/index.tsx
import { HeroBlock } from './HeroBlock';
import { TextBlock } from './TextBlock';
import { MetricsBlock } from './MetricsBlock';
// ... other imports

const BLOCK_COMPONENTS = {
  'hero': HeroBlock,
  'text': TextBlock,
  'metrics': MetricsBlock,
  'chart-bar': ChartBarBlock,
  'chart-donut': ChartDonutBlock,
  'chart-line': ChartLineBlock,
  'timeline': TimelineBlock,
  'comparison': ComparisonBlock,
  'gallery': GalleryBlock,
  'findings': FindingsBlock,
  'table': TableBlock,
  'quote': QuoteBlock,
  'embed': EmbedBlock,
};

interface BlockRendererProps {
  blocks: Block[];
  projectId: string;
}

export function BlockRenderer({ blocks, projectId }: BlockRendererProps) {
  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;

        return (
          <Component
            key={index}
            {...block}
            projectId={projectId}
          />
        );
      })}
    </div>
  );
}
```

### ProjectPage

```typescript
// src/views/ProjectPage.tsx
import { useParams } from 'react-router-dom';
import { BlockRenderer } from '../components/blocks';

export function ProjectPage() {
  const { projectId } = useParams();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Load project JSON
    fetch(`/content/projects/${projectId}.json`)
      .then(res => res.json())
      .then(setConfig);
  }, [projectId]);

  if (!config) return <Loading />;

  return (
    <div className="min-h-screen bg-background">
      <BlockRenderer
        blocks={config.blocks}
        projectId={config.id}
      />
    </div>
  );
}
```

---

## Migration Plan

### Phase 1: Build Block Components
- Create all block components with consistent styling
- Build BlockRenderer
- Create ProjectPage view
- Test with sample JSON

### Phase 2: Convert Existing Projects
- Convert X25-RB02 (Modulizer) to JSON
- Convert X25-RB05 (Mass Timber) to JSON
- Convert X25-RB08 (Phase 1) to JSON
- Verify parity with existing dashboards

### Phase 3: Update The Repo
- Add JSON indexing to The Repo
- Implement search across project content
- Test RAG-style queries

### Phase 4: Document & Train
- Finalize Claude Teams prompt
- Document workflow for researchers
- Create example project JSON

---

## Summary

| Aspect | Old System | Block System |
|--------|------------|--------------|
| Add new project | 4-6 files, routing changes | 1 JSON file |
| Code changes needed | Yes | No |
| Consistency | Varies by developer | Enforced by blocks |
| AI searchable | No (buried in JSX) | Yes (structured JSON) |
| Researcher involvement | None | Can generate JSON via Claude |
| Time per project | 4-6 hours | 30 minutes |
| Flexibility | Maximum (custom code) | High (block composition) |

---

## Questions / Future Considerations

1. **Image hosting**: Currently `/public/images/projects/{id}/`. Consider CDN for scale.
2. **Versioning**: Should project JSONs be versioned? Git handles this naturally.
3. **Validation**: Add JSON schema validation before rendering.
4. **Preview**: Build a preview mode for reviewing before publish.
5. **Editor**: Future consideration - visual block editor in EZRA.
