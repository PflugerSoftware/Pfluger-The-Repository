# Midland Furniture Pilot Survey Analysis

## Project Overview

### Wendy's Goal (Ultimate Objective)
Visually present classroom furniture pilot survey results to compare teacher vs. student perspectives on furniture effectiveness. The goal is NOT to lock into specific products tested, but to understand what students and teachers liked and didn't like so we can customize furniture solutions for the full school build-out.

Key priorities:
- Understand features of each furniture piece that were most preferred and WHY
- Negatives are as important as positives (example: light surface showing pencil transfer)
- Present data in a new, visually compelling way that's accessible to all stakeholders
- Enable data-driven furniture customization decisions
- Support upcoming Sample Rodeo event in May where findings will be presented

### What We're Doing (Research Objective)
Analyzing feedback from a one-semester classroom furniture pilot across 4 classrooms at Midland High School. We need to:

1. **Extract themes from qualitative feedback** - Identify recurring themes from open-ended responses (size, mobility, height adjustability, surface materials, durability, etc.)

2. **Compare perspectives** - Break down results to show "Student Opinion" vs. "Teacher Opinion" separately and together

3. **Synthesize actionable insights** - What features do they want? What problems need solving? What design changes should be made?

4. **Create visual graphics** - Build interactive RB blocks for the EZRA platform to present findings in an engaging, shareable format

5. **Consider student personas** - Potentially create personas from survey data to humanize the findings

## Survey Structure

### Data Sources

**Raw Data (xlsx):**
- `MHS LHS FFE Classroom Pilot_Fall 2025_Student.xlsx`
- `MHS LHS FFE Classroom Pilot_Fall 2025_Teacher.xlsx`

**Exported CSVs (used for analysis):**
- `MHS LHS FFE Classroom Pilot_Fall 2025_Student-Questions.csv` - Survey questions
- `MHS LHS FFE Classroom Pilot_Fall 2025_Student-Responces.csv` - 321 student responses
- `MHS LHS FFE Classroom Pilot_Fall 2025_Teacher-Questions.csv` - Survey questions
- `MHS LHS FFE Classroom Pilot_Fall 2025_Teacher-Responces.csv` - 7 teacher responses

> **DATA NOTE:** The teacher survey had a typo - "Desk 4" was listed as "Desk 3" twice. This has been corrected in the source data, but the Insights document statistics have not yet been updated to reflect the corrected data. Statistics need to be re-verified before final presentation.

### Survey Design
- **Students**: All 4 classrooms received the same student desks and chairs
- **Teachers**: Each of the 4 classrooms received different teacher desks and chairs
- **Furniture items are numbered**: Chair 1, Chair 2, Chair 3, Chair 4 / Desk 1, Desk 2, Desk 3, Desk 4 (manufacturer names excluded to keep survey simple)
- **Both surveys reference the same items** - When students talk about Desk 1, teachers are talking about the same Desk 1
- **Two types of responses**:
  - Choice responses (ratings, selections, which is your favorite)
  - Open-ended written responses (complaints, suggestions, what's missing)

### Key Survey Questions (Examples)
- "What is your favorite chair?" (with images of each option)
- "What are your complaints about the desks?" (open-ended)
- "How often are you rearranging the desks?" (asked to both students and teachers)
- Functionality ratings and preferences
- What features would you like that are missing?

## Themes to Extract from Qualitative Feedback

Wendy's answers and the conversation revealed these key themes emerging from open-ended responses:

### Size & Proportions
- "Some desks are very small"
- "They need to be bigger"
- "Too tall for short people"
- Requests for different sizes within classrooms

### Mobility & Casters
- "This one moves too easily because of wheels on every side"
- "Some casters were falling off"
- "The wheels move too much" vs. "not enough mobility"
- Need to find middle ground (maybe two casters instead of four?)

### Height Adjustability
- "Too high for some students"
- If enough comments mention height, recommend adjustable-height desks
- Different body types need different heights

### Surface Materials & Durability
- "Light surfaces show transfer" (pencil marks, wear)
- Laminate quality matters more than desk design itself
- Need darker or more durable surfaces
- "Off balance" - some structural issues

### Functionality & Features
- Storage needs
- Work surface area
- Integration with classroom activities
- Teacher vs. student needs may differ

### User Perspective Matters
- WHO is moving furniture (teachers 80% of the time vs. students)
- If teachers are doing most rearranging, student preference on mobility matters less
- Teachers may prioritize different features than students

## Analysis Approach

### Step 1: Theme Extraction
- Use AI to run through open-ended responses
- Generate initial list of themes from qualitative feedback
- Review and refine themes (add, merge, or split as needed)
- Tag each response with relevant themes

### Step 2: Comparative Analysis
- Compare student vs. teacher themes
- Identify alignment (both groups saying similar things)
- Identify conflicts (students want X, teachers want Y)
- Quantify theme prevalence (how many comments per theme)

### Step 3: Visual Graphics (RB Blocks)
Create interactive blocks for EZRA platform using existing components:
- **Survey Rating Block** - Show rating distributions for choice questions
- **Feedback Summary Block** - Theme visualization with counts
- **Comparison Block** - Side-by-side student vs. teacher perspectives
- **Quotes Block** - Representative quotes for each theme
- **Key Findings Block** - Top insights and recommendations
- **Stat Grid Block** - Participation numbers, response rates
- **Bar Chart Block** - Preference rankings
- **Donut Chart Block** - Theme distribution

### Step 4: Student Personas
Each row in the student survey represents one student's complete responses. Three personas were created:
- **"Space-Seeking Sam"** (45%) - prioritizes larger desks and chairs with room to spread out
- **"Mobile Max"** (30%) - values movement and flexibility, wants locking wheels
- **"Height-Conscious Hannah"** (10%) - needs adjustable heights, shorter students

## Timeline & Deliverables

### Key Dates
- **Meeting 1**: 2/3 at 3:30pm - Review themes (complete)
- **Meeting 2**: 2/6 (Thursday) at 2:00pm - Review updated insights with Wendy
- **Internal Review**: 2/6 - Wendy presents to Interiors group
- **Midland Call**: 2/7 (Friday) - Wendy presents to Midland
- **Sample Rodeo Event**: May - Present findings to broader audience

### To Do Before 2/6
- [ ] Verify and re-check all statistics in Insights document
- [ ] Update Insights with corrected teacher survey data
- [ ] Create RB blocks for Repository public page (if time permits)

### Deliverables
1. Theme taxonomy from qualitative responses
2. Student vs. Teacher comparison analysis
3. Visual graphics (RB blocks) for EZRA platform
4. Shareable link to findings
5. Insights document for furniture customization decisions

**Current Output:**
- `FurntureSurvey-Insights.md` - Full analysis with findings, themes, and recommendations
- `X26-RB01 - Midland Furniture Pilot - Survey Analysis.docx` - Formatted report

## Resources

### Furniture Images
`P:\Dallas\24-001 - Midland2NewHSproject\03 Design\10 Interiors\FFE\07 FFE Pilot Classrooms\Surveys\Resources\images`

### RB Block Components These will get revised

Located in `/src/components/blocks/`:
- SurveyRatingBlock.tsx
- FeedbackSummaryBlock.tsx
- QuotesBlock.tsx
- BarChartBlock.tsx
- DonutChartBlock.tsx
- ComparisonTableBlock.tsx
- KeyFindingsBlock.tsx
- StatGridBlock.tsx

## Notes from Wendy

### What She Needs
- Breakdown of student opinion vs. teacher opinion (separate and together)
- Visual way to show participation level and summary of pilot
- Common comments highlighted (most beneficial insights)
- Understanding of WHY certain furniture was preferred
- Design-level insights (like laminate choice affecting transfer)

### What Success Looks Like
- Stakeholders (district, parents, community) can see transparent survey results
- Findings inform furniture customization decisions
- Teachers and students feel heard in the design process
- Visual presentation sets new standard for how research is collected and shared
- Data is accessible and shareable via link

---
