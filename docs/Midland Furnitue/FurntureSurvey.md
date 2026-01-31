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
- **Student Survey**: `/docs/Midland Furnitue/MHS LHS FFE Classroom Pilot_Fall 2025_Student.xlsx`
- **Teacher Survey**: `/docs/Midland Furnitue/MHS LHS FFE Classroom Pilot_Fall 2025_Teacher.xlsx`

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

### Step 4: Student Personas (Optional)
Each row in the student survey represents one student's complete responses. We could create personas like:
- "Height-Conscious Hannah" - shorter student who needs adjustable furniture
- "Mobile Max" - frequently moves between group work and individual work
- "Durability Dave" - notices quality and wear issues

## Timeline & Deliverables

### Key Dates
- **Meeting 1**: 2/3 at 3:30-4:30pm - Review themes
- **Meeting 2**: 2/6 at 2:00-3:00pm - Review themes and charts
- **Deadline**: Insights, themes, and graphics ready by 2/6
- **Sample Rodeo Event**: May - Present findings to broader audience

### Deliverables
1. Theme taxonomy from qualitative responses
2. Student vs. Teacher comparison analysis
3. Visual graphics (RB blocks) for EZRA platform
4. Shareable link to findings
5. Insights document for furniture customization decisions

## Resources

### Furniture Images
`P:\Dallas\24-001 - Midland2NewHSproject\03 Design\10 Interiors\FFE\07 FFE Pilot Classrooms\Surveys\Resources\images`

### RB Block Components
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

## CONTINUING PROMPT (When Resuming Work)

When you pick this project back up, here's where to start:

### Context
This is a furniture pilot survey analysis for Midland High School. Wendy Rosamond needs visual insights from student and teacher feedback on classroom furniture (chairs and desks) to inform customization decisions for the full school build-out. The analysis compares student vs. teacher perspectives and extracts themes from both quantitative ratings and qualitative open-ended responses.

### Next Steps

**1. Analyze the Survey Data**
- Open and review both Excel files:
  - `/docs/Midland Furnitue/MHS LHS FFE Classroom Pilot_Fall 2025_Student.xlsx`
  - `/docs/Midland Furnitue/MHS LHS FFE Classroom Pilot_Fall 2025_Teacher.xlsx`
- Understand the structure: columns, question types, response formats
- Note which questions are quantitative (ratings, choices) vs. qualitative (open-ended text)

**2. Extract Themes from Qualitative Responses**
- Identify all open-ended question columns (complaints, suggestions, what's missing, etc.)
- Run AI-assisted theme extraction on text responses
- Use the theme categories outlined above as starting points (size, mobility, height, materials, durability)
- Quantify theme prevalence (count how many responses mention each theme)
- Tag each response with relevant themes

**3. Build Comparative Analysis**
- Compare student vs. teacher responses on the same questions
- Identify alignments and conflicts between perspectives
- Highlight where student preferences differ from teacher preferences
- Consider WHO uses the furniture (students sit, teachers rearrange)

**4. Calculate Key Metrics**
- Participation numbers (how many students, how many teachers)
- Response rates
- Preference rankings (which chair/desk was most popular)
- Rating distributions for quantitative questions

**5. Create Visual Graphics (RB Blocks)**
Start building components using existing block templates in `/src/components/blocks/`:
- **StatGridBlock** - Participation metrics (# students, # teachers, response rate)
- **BarChartBlock** - Furniture preference rankings (Chair 1 vs 2 vs 3 vs 4)
- **SurveyRatingBlock** - Rating distributions for quantitative questions
- **FeedbackSummaryBlock** - Theme visualization with counts
- **ComparisonTableBlock** - Student vs. Teacher perspective comparison
- **QuotesBlock** - Representative quotes for each theme
- **KeyFindingsBlock** - Top 3-5 actionable insights
- **DonutChartBlock** - Theme distribution breakdown

**6. Optional: Student Personas**
If time allows, create 3-4 student personas from survey data:
- Each row in student Excel = one student's complete responses
- Look for patterns in responses to create archetypal users
- Give them names and characteristics based on their feedback patterns
- Examples: "Height-Conscious Hannah", "Mobile Max", "Durability Dave"

### Files to Work With
- Survey data: `/docs/Midland Furnitue/*.xlsx`
- Transcript reference: `/docs/Midland Furnitue/Call with Wendy Rosamond.vtt`
- Furniture images: `P:\Dallas\24-001 - Midland2NewHSproject\03 Design\10 Interiors\FFE\07 FFE Pilot Classrooms\Surveys\Resources\images`
- Block components: `/src/components/blocks/*.tsx`

### Key Questions to Answer
- Which furniture pieces were most preferred by students? By teachers?
- What themes emerge from complaints and suggestions?
- Where do student and teacher perspectives align? Where do they conflict?
- What design changes should be made based on feedback?
- What features are missing that users want?

### Deliverable Format
Create a new research project entry in EZRA (similar to other X25-RB## projects) with blocks presenting the findings. Make it shareable via link so Wendy can present to stakeholders at the Sample Rodeo event in May.
