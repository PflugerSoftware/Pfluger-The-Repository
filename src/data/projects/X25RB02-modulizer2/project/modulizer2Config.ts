import type { ProjectConfig } from '../../../../components/blocks/types';

export const modulizer2Config: ProjectConfig = {
  id: 'X25-RB02',
  title: 'Modulizer Part 2',
  code: 'X25-RB02',
  subtitle: 'Flour Bluff CTE Center - Energy, Lighting, and Climate Analysis',
  category: 'sustainability',
  researcher: 'Alex Wickes',
  totalHours: 120,
  accentColor: '#f59e0b',

  blocks: [
    // Phase 1 Link Section
    {
      type: 'section',
      id: 'section-phase1',
      data: { title: 'Phase 1 Link', sources: [6] },
    },
    {
      type: 'text-content',
      id: 'phase1-strategies',
      title: 'Phase 1 Precedent Strategies Applied',
      data: {
        content: `**Massing Rotation** - John Lewis Elementary
CTE Application: Test optimal solar orientation for fabrication spaces
*9% energy reduction*

**Aperture Optimization** - Alice West Fleet Elementary
CTE Application: Customize glazing ratio by orientation
*Maximum daylight, minimal heat gain*

**Shading Solutions** - Alice West Fleet Elementary
CTE Application: Deep overhangs and custom shading devices
*Mitigated heat gain on poor orientations*

**Envelope Optimization** - Multiple COTE projects
CTE Application: Balance transparency with thermal performance
*Reduced operational EUI*`,
      },
    },

    // Insights Section
    {
      type: 'section',
      id: 'section-insights',
      data: { title: 'Insights' },
    },
    {
      type: 'text-content',
      id: 'summary-text',
      title: 'Executive Summary',
      data: {
        content: `This study evaluated three massing options for the Flour Bluff CTE Center, analyzing energy performance, daylighting quality, and climate responsiveness.

**Key Recommendations:**
- Proceed with Option 2 as the preferred massing strategy
- Incorporate external shading on south-facing glazing
- Consider operable windows for natural ventilation during mild months
- Target LEED v4 BD+C Schools certification

The analysis demonstrates that thoughtful massing decisions in early design can yield significant energy savings with minimal cost impact.`,
      },
    },
    {
      type: 'key-findings',
      id: 'main-findings',
      data: {
        findings: [
          {
            title: 'Recommended Option',
            value: 'Option 2',
            detail: 'Best balance of energy efficiency and daylighting',
            icon: 'award',
          },
          {
            title: 'Energy Savings',
            value: '18%',
            detail: 'Reduction vs baseline design',
            icon: 'energy',
          },
          {
            title: 'Daylighting',
            value: '75% sDA',
            detail: 'Exceeds LEED v4 threshold of 55%',
            icon: 'lightbulb',
          },
          {
            title: 'Research Hours',
            value: '120 hrs',
            detail: 'Phase 2 energy modeling allocation',
            icon: 'target',
          },
        ],
      },
    },

    // Energy Section
    {
      type: 'section',
      id: 'section-energy',
      data: { title: 'Energy', sources: [1, 5] },
    },
    {
      type: 'stat-grid',
      id: 'energy-stats',
      data: {
        stats: [
          { label: 'Option 1 EUI', value: '42.3', detail: 'kBtu/sf-year' },
          { label: 'Option 2 EUI', value: '38.1', detail: 'kBtu/sf-year', trend: 'down' },
          { label: 'Option 3 EUI', value: '45.7', detail: 'kBtu/sf-year', trend: 'up' },
          { label: 'Baseline', value: '46.5', detail: 'kBtu/sf-year' },
        ],
        columns: 4,
      },
    },
    {
      type: 'bar-chart',
      id: 'energy-options',
      title: 'Energy Use by Option',
      description: 'Hover to explore HVAC and Internal load breakdown',
      data: {
        groupedBars: [
          {
            title: 'Option 1',
            groups: [
              {
                label: 'HVAC',
                color: '#3b82f6',
                items: [
                  { label: 'Cooling', value: 14.2, color: '#60a5fa' },
                  { label: 'Heating', value: 9.1, color: '#f87171' },
                ],
              },
              {
                label: 'Internal',
                color: '#f59e0b',
                items: [
                  { label: 'Lighting', value: 7.5, color: '#fbbf24' },
                  { label: 'Equipment', value: 6.2, color: '#a78bfa' },
                  { label: 'Fans', value: 5.3, color: '#34d399' },
                ],
              },
            ],
          },
          {
            title: 'Option 2 (Recommended)',
            groups: [
              {
                label: 'HVAC',
                color: '#3b82f6',
                items: [
                  { label: 'Cooling', value: 12.4, color: '#60a5fa' },
                  { label: 'Heating', value: 8.2, color: '#f87171' },
                ],
              },
              {
                label: 'Internal',
                color: '#f59e0b',
                items: [
                  { label: 'Lighting', value: 6.8, color: '#fbbf24' },
                  { label: 'Equipment', value: 5.9, color: '#a78bfa' },
                  { label: 'Fans', value: 4.8, color: '#34d399' },
                ],
              },
            ],
          },
          {
            title: 'Option 3',
            groups: [
              {
                label: 'HVAC',
                color: '#3b82f6',
                items: [
                  { label: 'Cooling', value: 15.8, color: '#60a5fa' },
                  { label: 'Heating', value: 10.3, color: '#f87171' },
                ],
              },
              {
                label: 'Internal',
                color: '#f59e0b',
                items: [
                  { label: 'Lighting', value: 8.1, color: '#fbbf24' },
                  { label: 'Equipment', value: 6.1, color: '#a78bfa' },
                  { label: 'Fans', value: 5.4, color: '#34d399' },
                ],
              },
            ],
          },
        ],
        unit: ' kBtu/sf',
      },
    },
    {
      type: 'comparison-table',
      id: 'energy-comparison',
      title: 'Option Comparison',
      data: {
        headers: ['Metric', 'Option 1', 'Option 2', 'Option 3'],
        rows: [
          { label: 'Total EUI (kBtu/sf)', values: [42.3, 38.1, 45.7] },
          { label: 'Cooling Load', values: [14.2, 12.4, 15.8] },
          { label: 'Heating Load', values: [9.1, 8.2, 10.3] },
          { label: 'Lighting', values: [7.5, 6.8, 8.1] },
          { label: '% vs Baseline', values: ['-9%', '-18%', '-2%'], highlight: true },
        ],
      },
    },

    // Climate Section
    {
      type: 'section',
      id: 'section-climate',
      data: { title: 'Climate', sources: [4, 5] },
    },
    {
      type: 'text-content',
      id: 'climate-intro',
      title: 'Wind Analysis',
      data: {
        content: `Seasonal wind rose analysis informed natural ventilation strategies and building orientation. The prevailing winds shift throughout the year, with dominant southeasterly winds in summer months.`,
      },
    },
    {
      type: 'image-gallery',
      id: 'wind-roses',
      title: 'Seasonal Wind Roses',
      description: 'Wind direction and speed analysis by season',
      data: {
        images: [
          { src: '/images/projects/X25RB02-modulizer2/winter-wind-rose.png', alt: 'Winter Wind Rose', caption: 'Winter' },
          { src: '/images/projects/X25RB02-modulizer2/spring-wind-rose.png', alt: 'Spring Wind Rose', caption: 'Spring' },
          { src: '/images/projects/X25RB02-modulizer2/summer-wind-rose.png', alt: 'Summer Wind Rose', caption: 'Summer' },
          { src: '/images/projects/X25RB02-modulizer2/fall-wind-rose.png', alt: 'Fall Wind Rose', caption: 'Fall' },
        ],
        columns: 4,
      },
    },

    // Simulations Section
    {
      type: 'section',
      id: 'section-simulations',
      data: { title: 'Simulations' },
    },
    {
      type: 'image-gallery',
      id: 'simulation-diagrams',
      title: 'Energy Model Visualizations',
      description: 'Thermal and daylighting simulation outputs',
      data: {
        images: [
          { src: '/images/projects/X25RB02-modulizer2/simulation-01.png', alt: 'Simulation Diagram 1' },
          { src: '/images/projects/X25RB02-modulizer2/simulation-02.png', alt: 'Simulation Diagram 2' },
          { src: '/images/projects/X25RB02-modulizer2/simulation-03.png', alt: 'Simulation Diagram 3' },
          { src: '/images/projects/X25RB02-modulizer2/simulation-04.png', alt: 'Simulation Diagram 4' },
          { src: '/images/projects/X25RB02-modulizer2/simulation-05.png', alt: 'Simulation Diagram 5' },
        ],
        columns: 3,
      },
    },

    // Lighting Section
    {
      type: 'section',
      id: 'section-lighting',
      data: { title: 'Lighting', sources: [2, 3] },
    },
    {
      type: 'stat-grid',
      id: 'lighting-stats',
      data: {
        stats: [
          { label: 'sDA (Target 55%)', value: '75%', detail: 'Option 2 - PASS', trend: 'up' },
          { label: 'ASE (Max 10%)', value: '8%', detail: 'Option 2 - PASS', trend: 'down' },
          { label: 'LEED Points', value: '2/3', detail: 'Daylight credit' },
          { label: 'Glare Risk', value: 'Low', detail: 'With proposed shading' },
        ],
        columns: 4,
      },
    },
    {
      type: 'comparison-table',
      id: 'lighting-comparison',
      title: 'Daylighting Performance by Option',
      description: 'LEED v4 BD+C Schools daylight analysis results',
      data: {
        headers: ['Metric', 'Target', 'Option 1', 'Option 2', 'Option 3'],
        rows: [
          { label: 'sDA300/50%', values: ['55%', '62%', '75%', '58%'] },
          { label: 'ASE1000/250', values: ['<10%', '12%', '8%', '15%'] },
          { label: 'Status', values: ['-', 'Partial', 'PASS', 'Partial'], highlight: true },
        ],
      },
    },
    {
      type: 'text-content',
      id: 'lighting-notes',
      title: 'Observations',
      data: {
        content: `- Option 2 achieves full LEED daylight credit with both sDA and ASE compliance
- South-facing classrooms require external shading to control ASE
- North-facing spaces provide consistent, glare-free daylight
- Recommend light shelves on south facades to improve daylight distribution`,
      },
    },

    // Timeline Section
    {
      type: 'section',
      id: 'section-timeline',
      data: { title: 'Timeline' },
    },
    {
      type: 'stat-grid',
      id: 'timeline-stats',
      data: {
        stats: [
          { label: 'Total Hours', value: '120', detail: 'Research allocation' },
          { label: 'Duration', value: '8 weeks', detail: 'Jan - Feb 2025' },
          { label: 'Phase', value: 'Complete', detail: 'Ready for design team' },
          { label: 'Deliverables', value: '3', detail: 'Reports delivered' },
        ],
        columns: 4,
      },
    },
    {
      type: 'timeline',
      id: 'project-timeline',
      title: 'Research Milestones',
      data: {
        events: [
          {
            date: 'Jan 6',
            title: 'Project Kickoff',
            status: 'complete',
          },
          {
            date: 'Jan 13',
            title: 'Base Model Setup',
            status: 'complete',
          },
          {
            date: 'Jan 27',
            title: 'Energy Analysis',
            status: 'complete',
          },
          {
            date: 'Feb 10',
            title: 'Daylighting Study',
            status: 'complete',
          },
          {
            date: 'Feb 18',
            title: 'Final Report',
            status: 'complete',
          },
        ],
        projectEvents: [
          { date: 'Jan 3', title: 'SD Kickoff' },
          { date: 'Jan 20', title: 'SD Review' },
          { date: 'Feb 5', title: 'DD Start' },
          { date: 'Feb 24', title: 'DD Deadline' },
        ],
        workload: [
          { date: 'Jan 6', hours: 8 },
          { date: 'Jan 13', hours: 20 },
          { date: 'Jan 20', hours: 15 },
          { date: 'Jan 27', hours: 25 },
          { date: 'Feb 3', hours: 18 },
          { date: 'Feb 10', hours: 22 },
          { date: 'Feb 17', hours: 12 },
        ],
      },
    },

    // Sources Section
    {
      type: 'section',
      id: 'section-sources',
      data: { title: 'Sources' },
    },
    {
      type: 'sources',
      id: 'research-sources',
      data: {
        sources: [
          { id: 1, title: 'ASHRAE 90.1-2019', author: 'ASHRAE' },
          { id: 2, title: 'LEED v4 BD+C: Schools', author: 'USGBC' },
          { id: 3, title: 'IES LM-83-12 Spatial Daylight Autonomy', author: 'IES' },
          { id: 4, title: 'Climate Consultant 6.0', author: 'UCLA Energy Design Tools' },
          { id: 5, title: 'EnergyPlus Weather Data', author: 'DOE' },
          { id: 6, title: 'Modulizer Part 1 Findings', author: 'Pfluger R&B' },
        ],
      },
    },
  ],
};
