# Claude Usage in Architecture Research

---
**AGENT EDITING RULES:**
- **Research Areas 1-6 and Project Examples: READ ONLY** - Do not modify existing content
- **Team Contributions Section: APPEND ONLY** - Add new entries only between marked boundaries
- **Editing Zone:** Only edit between `<!-- CONTRIBUTIONS START -->` and `<!-- CONTRIBUTIONS END -->` markers
- **Template:** Copy the template provided and fill it in for new entries
- **Location:** Add new entries at the bottom, before the `<!-- CONTRIBUTIONS END -->` marker
---

## Overview
This document tracks how researchers are using Claude AI for architecture research, development, and analysis. Document what works well and what doesn't to help the team learn and improve our AI workflows.

## 🚨 BEFORE ADDING YOUR EXPERIENCE
- **Research Areas 1-6** contain curated examples and major projects - **DO NOT MODIFY**
- **Your contributions** go in the "Team Contributions" section at the bottom only
- Copy the template, fill it out, paste it before the `<!-- CONTRIBUTIONS END -->` marker
- One entry per session/task/learning

---

## Research Areas

### 1. Conceptual Development
**What's Working:**
- AI redefining communication in architecture as we move away from 2D plans
- "Car over the faster horse" thinking - using AI to reimagine processes, not just accelerate existing ones

**What's Not Working:**
-

**Notes:**
-

---

### 2. Document Analysis & Research

**What's Working:**
-

**What's Not Working:**
-

**Notes:**
-

---

### 3. Code & Scripting

**What's Working:**
- **Full-stack web application development** - Successfully built production-ready 3D space planning application (ProjectPhoenix) in 8-hour sprint
- **React + TypeScript + Three.js integration** - Modern stack for interactive 3D architectural visualization
- **Complex 3D rendering** - Solar position calculations, multi-level buildings, realistic lighting, beveled geometry
- **State management across frontend/backend** - React state + PHP REST API + MySQL database integration
- **Animation systems** - Coordinated Framer Motion + CSS transitions + React Spring physics for polished UX
- **Incremental development** - Building features iteratively with continuous testing and refinement

**What's Not Working:**
- **Large component refactoring needed** - Some components grew to 800+ lines and need decomposition
- **Bundle size optimization** - 2.1MB bundle acceptable for 3D app but could be improved with code-splitting

**Notes:**
- Claude Code excels at rapid prototyping while maintaining code quality and TypeScript safety
- Real-time collaboration between Claude and developer enables quick iteration on complex 3D features
- Strong at implementing sophisticated algorithms (solar positioning, grid snapping, spring physics)
- Centralized configuration patterns (like constants.ts) make codebase highly maintainable

---

### 4. Data Processing & Analysis

**What's Working:**
- **Handwriting transcription from scanned surveys** - Claude can read and transcribe handwritten feedback with high accuracy
- **PDF processing with image enhancement** - Using poppler + PIL to create high-contrast images (300 DPI, 3x contrast, 2.5x sharpness) makes handwriting easier to read
- **Structured data extraction** - Converting unstructured survey responses into clean CSV format with raw + cleaned columns
- **Large-scale processing** - Successfully processed 65 pages of handwritten surveys in single session
- **Quality verification** - Page-by-page review process caught transcription errors effectively
- **CSV data modeling** - Successfully structured 15,876 lines of CRM/business data into TypeScript interfaces
- **Multi-source data integration** - Combined VantagePoint CRM exports, state databases, and office earnings into unified dashboard
- **Health score algorithms** - Quantitative metrics combining project count, revenue, and recency for relationship strength

**What's Not Working:**
- **OCR tools for handwriting** - Tesseract, EasyOCR struggle with cursive and varied handwriting styles
- **Automated handwriting recognition** - Better to use Claude's vision capabilities than traditional OCR for messy handwriting

**Notes:**
- Image enhancement critical for readability: high contrast, sharpness, auto-contrast with cutoff
- Manual review still needed - found 1 error in 65 pages during verification
- Preserve both raw (as-written) and cleaned (corrected) versions for accuracy
- CSV imports effective for prototyping before building full backend APIs
- TypeScript interfaces ensure data consistency across large datasets

---

### 5. Writing & Documentation

**What's Working:**
-

**What's Not Working:**
-

**Notes:**
-

---

### 6. Design Automation & Parametric Tools

**What's Working:**
- **Interactive 3D space planning tools** - Real-time drag-and-drop space placement with grid snapping (5-foot intervals)
- **Parametric space instances** - Template-based system allowing multiple instances with independent properties
- **Multi-level building modeling** - Automatic vertical stacking with level-based space filtering
- **Solar analysis integration** - NOAA-based algorithms for accurate sun positioning by time/month
- **Measurement tools** - Interactive distance measurement with grid snapping and persistence
- **Dynamic lighting modes** - Switchable between work mode and presentation mode with realistic shadows
- **Pod-based space programming** - Pre-built + custom space combinations with automatic SF/cost aggregation (40+ educational space types)
- **Automated cost estimation** - Uniformat elemental costs linked to space programming for real-time budget updates
- **Wizard-based project creation** - 6-step guided process for facilities planning with validation
- **Timeline automation** - Gantt chart generation from project phases with drag-and-drop scheduling

**What's Not Working:**
- **Real-time collaboration** - Single-user system, no multi-user concurrent editing yet
- **BIM integration** - No direct Revit/AutoCAD export capabilities (CSV only)
- **Cost data learning** - No ML integration with historical project database yet

**Notes:**
- Three.js + React Three Fiber provides robust foundation for architectural visualization tools
- Grid-based parametric systems work well for early-stage space planning
- Real-time rendering enables immediate feedback for design iterations
- Browser-based tools lower barrier to entry vs. traditional CAD software
- Pod-based templates balance speed (pre-built) with flexibility (custom combinations)
- Linking space types to cost data enables parametric budgeting (SF × cost/SF = total)
- Uniformat classification enables apples-to-apples project comparisons

---

## Agent Usage Tips

### Best Practices
- Be specific with prompts - include context and desired format
- Use agents for repetitive tasks across multiple files
- Break complex tasks into smaller steps
- Review agent outputs before committing changes
- **For full-stack development:** Start with feature specs, build incrementally, test continuously
- **For 3D tools:** Establish coordinate systems and units first, then build interactions
- **For complex UX:** Coordinate animation systems (Framer Motion for opacity/scale, CSS for positions)
- **For state management:** Use TypeScript interfaces early to catch data structure issues
- **For architecture tools:** Centralize configuration (space types, colors, icons) in one file for easy extension

### Common Pitfalls
- Vague prompts leading to incorrect outputs
- Not providing enough context about project structure
- Expecting agents to understand implicit requirements
- **Letting components grow too large** - Refactor when files exceed 400-500 lines
- **Not planning coordinate systems** - 3D tools need clear units/scale/origin definitions upfront
- **Hardcoding credentials** - Always use environment variables for sensitive data
- **Skipping security review** - Check for dev passwords, CORS settings, authentication before deploy
- **Animation conflicts** - Different animation libraries can interfere; choose one approach per property

---

## Useful Prompts & Templates

### Template: Research Summary
```
Analyze [document/topic] and provide:
1. Key findings
2. Implications for architecture practice
3. Related precedents or case studies
```

### Template: Code Documentation
```
Document this [script/function] including:
- Purpose and use cases
- Input parameters
- Output format
- Example usage
```

### Template: 3D Visualization Tool Development
```
Build an interactive 3D [space planning/massing/analysis] tool with:
1. Core features: [drag-and-drop, measurement, solar analysis, etc.]
2. User interactions: [click, drag, rotate, multi-select]
3. Data persistence: [save/load projects to database]
4. Export capabilities: [CSV, screenshots, reports]
5. Tech stack: React + TypeScript + Three.js + [backend]

Key considerations:
- Grid snapping for precision
- Undo/redo for editing
- Multi-level/floor support
- Realistic lighting and materials
- Responsive UI with collapsible panels
```

### Template: Business Intelligence Dashboard
```
Build a business intelligence dashboard for [client/project/resource] management with:
1. Data views: [list, charts, maps, timelines]
2. Key metrics: [health scores, revenue, pipeline, activities]
3. Filtering/sorting: [by office, status, date range, category]
4. Data sources: [CRM exports, CSV imports, API integration]
5. User actions: [create, update, track interactions]
6. Tech stack: React + TypeScript + Vite + Radix UI + Recharts

Key considerations:
- Accessibility-first component library (Radix UI)
- Drag-and-drop customizable dashboards
- CSV import for prototyping before API development
- Health score/tier-based classification systems
- Geographic visualization with Leaflet
- Comprehensive data schema documentation
- Mobile-responsive tables and charts
```

### Template: Facilities/Project Management Platform
```
Build a facilities planning and bond management platform with:
1. Data architecture: [two-tier Facilities→Projects model]
2. Creation wizards: [multi-step forms with validation]
3. Cost estimation: [Uniformat elemental costs, space programming, parametric budgeting]
4. Scheduling: [Gantt charts, phase management, pause support]
5. Visualization: [3D maps (Mapbox), charts (Recharts), timeline views]
6. Space programming: [pod-based system with pre-built/custom combinations]
7. Tech stack: React + TypeScript + PHP REST API + MySQL + Mapbox GL JS

Key considerations:
- Two-tier data model for hierarchical organization (Facilities contain Projects)
- Multi-step wizard pattern for complex data entry (6-step project builder)
- Context-based state management (separate contexts per domain)
- Uniformat cost classification for industry-standard benchmarking
- Pod-based space programming (template + custom for speed + flexibility)
- Smart sidebar positioning to prevent compound padding issues
- Glassmorphism design for professional client-facing UI
- Optimistic UI updates with server sync
- Production deployment considerations (env vars, auth, error handling)
```

---

## Team Contributions

### Alex Wickes - November 16, 2025

#### Project: X25-RB02 - Flour Bluff CTE Center (Designer: Leah van der Sanden)

**Task 1: Survey Feedback Analysis**
Transcribed 65 pages of handwritten survey responses from ideation workshop into structured dataset

**What Worked:**
- Used poppler + pdf2image + PIL to create high-contrast enhanced images (300 DPI)
- Claude's vision capabilities accurately read varied handwriting styles
- Page-by-page verification caught transcription errors (1 error in 65 pages)
- Structured CSV with raw + cleaned columns preserved accuracy while improving readability
- Generated comprehensive markdown analysis report with findings and recommendations

**What Didn't:**
- Traditional OCR tools (Tesseract, EasyOCR) failed on cursive handwriting
- Initial attempt without image enhancement made some pages hard to read

**Learnings:**
- Image preprocessing (3x contrast, 2.5x sharpness, auto-contrast) critical for handwriting readability
- Manual page-by-page review worth the time investment for data quality
- Preserving both raw and cleaned versions provides accountability and flexibility
- Claude can handle large-scale transcription tasks (65 pages) in single session with high accuracy

---

**Task 2: ProjectPhoenix - 3D Space Planning Web Application**
Built full-stack interactive 3D space planning tool for early-stage facility design

**What Worked:**
- **Rapid full-stack development** - Production-ready React + Three.js + PHP + MySQL application in 8-hour sprint
- **Complex 3D features** - Multi-level buildings, solar analysis, measurement tools, beveled geometry
- **Strong architecture** - TypeScript safety, component composition, centralized configuration
- **Database integration** - Save/load projects with spaces and measurements to MySQL
- **Sophisticated UX** - Coordinated animations (Framer Motion + CSS transitions + React Spring)
- **Template system** - Space library with 8 categorized types, reusable instances
- **Real-time visualization** - Grid snapping, radial controls, multi-select, undo history
- **Comprehensive documentation** - 7 detailed MD files covering deployment, features, architecture

**What Didn't:**
- **Bundle size** - 2.1MB (acceptable for 3D but could improve with code-splitting)
- **Component size** - Some files grew to 800+ lines during rapid development
- **Security hardening needed** - Dev credentials need removal, JWT implementation needed

**Learnings:**
- Claude Code excels at full-stack development with complex requirements
- TypeScript + React + Three.js is robust stack for architectural visualization tools
- Centralized constants.ts pattern makes adding features trivial (new space types in one file)
- CSS transitions more reliable than Framer Motion for position animations
- Solar position algorithms (NOAA-based) provide realistic presentation mode
- Browser-based 3D tools lower barrier vs. traditional CAD for early-stage design
- Incremental feature development with continuous testing prevents rework
- Deep cloning critical for undo/redo systems (avoid reference issues)
- Grid-based parametric systems effective for space planning workflows

**Tech Stack:**
- Frontend: React 18.3, TypeScript 5.4, Vite 5.2, Three.js 0.160, React Three Fiber, Tailwind CSS
- Backend: PHP 8.0+, MySQL 8.0
- Features: 9,793 lines code (8,692 TS + 1,101 PHP), 33 components, 13 API endpoints

**Architecture Implications:**
- AI-assisted development enables rapid prototyping of custom visualization tools
- Browser-based 3D tools can complement traditional BIM workflows for early design phases
- Template-based space systems align with architectural programming workflows
- Real-time solar analysis accessible without specialized software

---

**Task 3: ProjectVision - Business Development Dashboard**
Built comprehensive client relationship management and business intelligence dashboard for tracking 679 educational institution clients across 5 offices

**What Worked:**
- **Rapid prototyping** - Full-featured React/TypeScript dashboard with 11 major views
- **Modern UI stack** - Radix UI (25+ accessible components) + Tailwind CSS + Recharts
- **Complex data modeling** - 4-tier growth strategy system, health scores, project pipeline tracking
- **Data visualization** - Interactive charts, maps (Leaflet), drag-and-drop dashboards
- **Extensive planning** - 414-line DATA_PARAMETERS.md documenting complete data schema
- **Component reuse** - Shared login/UI components with sibling project (Project Prism)
- **CSV data processing** - Successfully imported and structured 15,876 lines of CRM/state data
- **Strategic framework** - Tier-based BD strategies (Core Focus, Strategic Growth, Long-Range Nurture, Visibility Priority)

**What Didn't:**
- **No backend yet** - Entirely client-side with mocked data, awaiting VantagePoint CRM integration
- **Basic authentication** - Simple login with no real validation
- **Large components** - DashboardStats.tsx at 1,082 lines needs decomposition
- **No testing** - Missing test framework and test coverage

**Learnings:**
- **Data modeling first** - Extensive upfront planning (DATA_PARAMETERS.md) pays dividends when implementing features
- **Radix UI excellence** - Accessibility-first component library provides robust, consistent UI primitives
- **CSV as bridge data** - Static CSV imports effective for prototyping before API integration
- **Tier-based frameworks** - Classification systems (4-tier growth strategy) make complex business logic manageable
- **Component sharing across projects** - Login/UI components successfully ported from Project Prism
- **Vite alias system** - Extensive alias configuration enables flexible asset management
- **Health score metrics** - Quantifying relationship strength (project count, revenue, recency) drives actionable insights
- **Multi-dimensional tracking** - Combining geographic (map), temporal (analytics), and relational (contacts) views provides comprehensive BD intelligence
- **Drag-and-drop dashboards** - react-dnd enables user customization without complex state management

**Tech Stack:**
- Frontend: React 18.3, TypeScript, Vite 6.3, Radix UI (25+ components), Recharts, Leaflet
- UI: Tailwind CSS, lucide-react icons, next-themes, sonner (toasts)
- Forms: react-hook-form
- Drag & Drop: react-dnd
- Data: 15,876 lines CSV (Client, Contact, Activities, Earnings, Demographics)
- Features: 51 production dependencies, 22 components, 11 major views, 679 districts, ~780 projects

**Architecture Implications:**
- **Internal tools development** - AI enables rapid development of specialized CRM/BD tools tailored to firm workflows
- **Data-driven BD** - Quantitative health scores and tier-based strategies bring rigor to relationship management
- **Browser-based BI** - Web dashboards democratize access to business intelligence vs. traditional BI tools
- **Component ecosystems** - Building reusable component libraries (shared between Prism/Vision) accelerates future projects
- **Phased backend integration** - Prototyping with static data validates UX before investing in backend infrastructure
- **Geographic visualization** - Map-based views align naturally with facilities/district-based architecture practice
- **Educational sector focus** - Specialized tools for K-12 market (superintendent tracking, bond programs, enrollment demographics)

**Project Context:**
- **RB-09 related** - Business development research and benchmarking
- **Sibling to Project Prism** - Shared components, aligned data models, planned future integration
- **Active development** - December 1 target for map-focused view, LHISD review on December 21
- **VantagePoint integration planned** - Backend will connect to existing CRM system

---

**Task 4: ProjectPrism - Facilities Planning & Bond Management Platform**
Built enterprise-grade full-stack application for Liberty Hill ISD to manage facilities, projects, and multi-million dollar bond programs

**What Worked:**
- **Full production deployment** - Live at https://prism.pflugerarchitects.com with PHP/MySQL backend
- **Revolutionary data architecture** - Two-tier Facilities→Projects model (8 facilities, 12 projects migrated)
- **Multi-step wizards** - Project Builder Pro (6 steps) and Bond Builder Pro (4 steps) with form validation
- **Interactive 3D mapping** - Mapbox GL integration with custom markers, project bubbles, terrain visualization
- **Advanced scheduling** - Gantt chart timeline with drag-and-drop, pause support, procurement/design/construction phases
- **Comprehensive cost engine** - Uniformat elemental costs (A2-D systems) + base/site/design/contingency breakdown
- **Space programming system** - Pod-based planning with 40+ educational space types, custom/pre-built combinations
- **Context-based state management** - 4 global contexts (Auth, Projects, Bonds, Facilities) for efficient data flow
- **Smart UI positioning** - Sidebar management that prevents compound padding issues across multiple panels
- **Professional design system** - Glassmorphism UI with theme-based color coding, Radix UI accessibility
- **Complete CRUD operations** - REST API with PDO prepared statements, error handling, optimistic UI updates

**What Didn't:**
- **Authentication still basic** - Hardcoded credentials (ready for JWT/OAuth upgrade)
- **No testing framework** - Manual testing only, needs Jest/Vitest + RTL
- **Hardcoded credentials** - Database config in source code, needs environment variables
- **Missing features** - File uploads, PDF/Excel export, multi-user collaboration not yet implemented

**Learnings:**
- **Wizard pattern excellence** - Multi-step forms with parent state management make complex data entry manageable
- **Two-tier data models** - Facilities→Projects hierarchy enables powerful filtering, grouping, and reporting
- **Uniformat cost classification** - Elemental costs (building systems) better for early-phase planning than trade-based
- **Context API at scale** - Multiple contexts work well when properly separated by domain (auth vs. data)
- **Mapbox + React integration** - 3D building visualization adds dramatic value for stakeholder presentations
- **Glassmorphism design system** - Backdrop blur + transparency creates professional, modern aesthetic
- **Smart sidebar positioning** - Calculate positions at app level to avoid compound padding bugs
- **Pod-based space programming** - Pre-built templates + custom selection balances speed with flexibility
- **Gantt chart integration** - gantt-task-react library enables sophisticated scheduling without building from scratch
- **API-first architecture** - PHP REST endpoints with frontend caching contexts provide clean separation
- **Optimistic UI updates** - Update local state immediately, sync with server, revert on error
- **Theme-based color coding** - Consistent colors across maps, charts, badges improves UX recognition
- **Real-world client deployment** - Production hosting experience reveals security, performance, error handling needs
- **ROI of AI development** - $300k-450k equivalent value for $60-120 investment (2,458x-7,500x ROI)

**Tech Stack:**
- Frontend: React 18.3, TypeScript, Vite 6.3, Radix UI (50+ shadcn components), Tailwind CSS
- Visualization: Recharts, Mapbox GL JS 3.16, gantt-task-react
- Backend: PHP 7.4+ REST API, MySQL 8.x with PDO prepared statements
- State: 4 React Contexts (Auth, Projects, Bonds, Facilities)
- Forms: react-hook-form, multi-step wizard pattern
- Animations: Framer Motion 12.23
- Features: ~23,067 lines frontend code, 98 TS files, 7 API endpoints, 37+ Git commits

**Architecture Implications:**
- **Client-facing tools viable** - AI development quality sufficient for production client-facing applications
- **Two-tier data models unlock features** - Facilities→Projects enables clustering, filtering, rollups impossible with flat structure
- **Wizard UX for complex forms** - Multi-step approach reduces cognitive load for bond/project creation
- **Uniformat standardization** - Industry-standard cost classification enables benchmarking across projects
- **Browser-based replaces desktop** - Web apps with Mapbox/Recharts match or exceed traditional desktop tools
- **Context patterns scale** - Multiple domain-specific contexts avoid prop drilling without Redux complexity
- **Component libraries accelerate** - Radix UI (50+ components) provides enterprise accessibility out-of-box
- **Space programming integration** - Linking cost data to space types enables automated estimating
- **Phased feature development** - Ship with basic auth, upgrade to JWT later; ship without file uploads, add later
- **Educational facilities specialization** - Domain-specific tools (bond programs, space pods, district mapping) match workflows

**Project Context:**
- **Client:** Liberty Hill Independent School District (Liberty Hill ISD), Texas
- **Production URL:** https://prism.pflugerarchitects.com
- **Sibling to ProjectVision** - Shared component library, will "intertwine eventually"
- **Platform branding:** "Powered by Vermulens" (Pfluger's internal software platform)
- **Active development** - Facilities UI integration in progress, cost engine refinement ongoing
- **Cost engine research** - Aligned with Vermulens' database of 80+ projects for historical cost data
- **Estimated equivalent value:** $295,000-450,000 (traditional agency development)

**Business Value:**
- Replaces spreadsheets and fragmented data sources
- Manages $100M+ bond programs with real-time visibility
- Professional stakeholder presentations (board meetings, voter communications)
- Centralized facilities and project repository
- Data-driven decision making for district growth planning

---

## TEAM CONTRIBUTIONS

<!-- AGENT INSTRUCTION:
     - ONLY add new entries between CONTRIBUTIONS START and CONTRIBUTIONS END markers below
     - DO NOT modify content above this line
     - DO NOT modify other user entries
     - USE the template provided
     - ADD your entry at the bottom, before CONTRIBUTIONS END marker
-->

**How to Add Your Experience:**
1. Copy the template below
2. Fill in your details
3. Paste your completed entry at the bottom, just before the `<!-- CONTRIBUTIONS END -->` marker
4. Do not modify any existing entries

**Template:**
```
### [Your Name] - [YYYY-MM-DD]
**Research Area:** [Conceptual Development / Document Analysis / Code & Scripting / Data Processing / Writing & Documentation / Design Automation]
**Task/Project:** [Brief description of what you were doing]
**What Worked:**
- [What went well]
**What Didn't:**
- [What didn't work or was challenging]
**Learnings:**
- [Key takeaways]
```

---

<!-- CONTRIBUTIONS START - Add new entries below this line -->

### [Example Entry - Replace with your own]
**Research Area:**
**Task/Project:**
**What Worked:**
-
**What Didn't:**
-
**Learnings:**
-

<!-- CONTRIBUTIONS END - DO NOT ADD CONTENT BELOW THIS LINE -->

---

## Resources & Links
- Claude Code Documentation: https://docs.claude.com/claude-code
- Team Slack: [channel link]
- Training Materials: [link]

---

## Questions & Issues
-

---

*Last Updated: 2025-11-16 (Added ProjectPhoenix, ProjectVision, and ProjectPrism documentation)*
*Maintained by: R&B Team*
