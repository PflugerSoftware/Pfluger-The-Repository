import type { ProjectConfig } from '../../../../components/blocks/types';

export const massTimberConfig: ProjectConfig = {
  id: 'X25-RB05',
  title: 'Mass Timber Cost Analysis',
  code: 'X25-RB05',
  subtitle: 'AISD Crockett Early College High School - Gym Modernization',
  category: 'sustainability',
  researcher: 'TBD',
  totalHours: 40,
  accentColor: '#67823A',

  blocks: [
    // Overview Section
    {
      type: 'section',
      id: 'section-overview',
      data: { title: 'Project Overview' },
    },
    {
      type: 'image-gallery',
      id: 'overview-images',
      data: {
        images: [
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-UxNSAQlJEQoOm95UTTJG-FRONTA.png', alt: 'Front Exterior View A', caption: 'Front Exterior' },
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-bg8mjwSYDzYSuOyefNUt-FRONTB-SITE.png', alt: 'Front Exterior View B', caption: 'Site View' },
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-LOk4XwH92ORiouYA7vB2-EXT LOBBY.png', alt: 'Exterior Lobby', caption: 'Exterior Lobby' },
        ],
        columns: 3,
      },
    },
    {
      type: 'text-content',
      id: 'overview-text',
      title: 'Cost Feasibility Study',
      data: {
        content: `This cost analysis evaluates the feasibility of mass timber construction for the AISD Crockett Early College High School gymnasium modernization project.

**Project Details:**
- Contractor: Timberlab, Inc.
- Date: October 14, 2025
- Project Area: 23,043 SF

**Scope:**
The study examines CLT (Cross-Laminated Timber) and Glulam structural systems, including material supply, hardware, installation, and various scope alternates to inform decision-making on the optimal construction approach.`,
      },
    },
    {
      type: 'key-findings',
      id: 'main-findings',
      data: {
        findings: [
          {
            title: 'Base Budget',
            value: '$1.7M',
            detail: '$73.84/SF for full mass timber scope',
            icon: 'dollar',
          },
          {
            title: 'Potential Savings',
            value: 'Up to 70%',
            detail: 'With Alt 4 deduct reducing to $22.07/SF',
            icon: 'trend',
          },
          {
            title: 'Material Cost',
            value: '73%',
            detail: 'CLT and Glulam supply is largest cost driver',
            icon: 'lightbulb',
          },
          {
            title: 'Installation',
            value: '18%',
            detail: 'Labor for CLT and Glulam installation',
            icon: 'target',
          },
        ],
      },
    },

    // Budget Breakdown Section
    {
      type: 'section',
      id: 'section-budget',
      data: { title: 'Budget Breakdown' },
    },
    {
      type: 'donut-chart',
      id: 'budget-donut',
      title: 'Cost Distribution',
      description: 'Base budget allocation by category',
      data: {
        segments: [
          { label: 'CLT and Glulam Supply', value: 1234443, color: '#3b82f6' },
          { label: 'Hardware and Connection Supply', value: 120031, color: '#10b981' },
          { label: 'Diaphragm Strapping Allowance', value: 48918, color: '#f59e0b' },
          { label: 'CLT and Glulam Install', value: 297984, color: '#8b5cf6' },
        ],
        total: 1701376,
        centerLabel: 'Total Budget',
      },
    },
    {
      type: 'stat-grid',
      id: 'budget-stats',
      data: {
        stats: [
          { label: 'Total Base Budget', value: '$1,701,376', detail: 'All categories combined' },
          { label: 'Cost per SF', value: '$73.84', detail: 'Based on 23,043 SF' },
          { label: 'Material Percentage', value: '73%', detail: 'CLT and Glulam supply' },
          { label: 'Labor Percentage', value: '18%', detail: 'Installation costs' },
        ],
        columns: 4,
      },
    },

    // Scenarios Section
    {
      type: 'section',
      id: 'section-scenarios',
      data: { title: 'Cost Scenarios' },
    },
    {
      type: 'text-content',
      id: 'scenarios-intro',
      data: {
        content: `Four predefined scenarios have been analyzed to understand the cost implications of different scope configurations. These scenarios range from the full base scope to significant deductions that could reduce costs by up to 70%.`,
      },
    },
    {
      type: 'scenario-bar-chart',
      id: 'scenarios-chart',
      title: 'Scenario Comparison',
      description: 'Compare total costs and cost per square foot across different scope configurations',
      data: {
        scenarios: [
          { name: 'Base Only', total: 1701376, costPerSF: 73.84 },
          { name: 'Base + Alt 1 + Alt 2', total: 1799916, costPerSF: 78.12 },
          { name: 'Base + Deduct Alt 3', total: 1196538, costPerSF: 51.93 },
          { name: 'Base + Deduct Alt 4', total: 508619, costPerSF: 22.07 },
        ],
        baseTotal: 1701376,
      },
    },
    {
      type: 'comparison-table',
      id: 'scenarios-table',
      title: 'Scenario Details',
      data: {
        headers: ['Scenario', 'Total Cost', 'Cost/SF', 'vs Base'],
        rows: [
          { label: 'Base Only', values: ['$1,701,376', '$73.84/SF', '-'], highlight: true },
          { label: 'Base + Alt 1 + Alt 2', values: ['$1,799,916', '$78.12/SF', '+$98,540'] },
          { label: 'Base + Deduct Alt 3', values: ['$1,196,538', '$51.93/SF', '-$504,838'] },
          { label: 'Base + Deduct Alt 4', values: ['$508,619', '$22.07/SF', '-$1,192,757'] },
        ],
      },
    },

    // Interior Renderings
    {
      type: 'section',
      id: 'section-interiors',
      data: { title: 'Interior Renderings' },
    },
    {
      type: 'image-gallery',
      id: 'interior-images',
      data: {
        images: [
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-ar4gh64CWpwVrL6hoZuX-INT - LOBBY 01 - OPTION 2 GRAPHICS PANEL.png', alt: 'Interior Lobby', caption: 'Lobby Interior' },
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-TbBGsma0JAA6JCymud14-LOBBY02.png', alt: 'Lobby View 2', caption: 'Lobby' },
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-kjStbNcg3g1RTofNif87-GYM01.png', alt: 'Gymnasium View 1', caption: 'Gymnasium' },
          { src: '/images/projects/X25RB05-masstimber/magnifics_upscale-udVdq9MQ5sPA3hQnlDGK-GYM02.png', alt: 'Gymnasium View 2', caption: 'Gymnasium Interior' },
        ],
        columns: 2,
      },
    },

    // Alternate Builder Section
    {
      type: 'section',
      id: 'section-builder',
      data: { title: 'Alternate Builder' },
    },
    {
      type: 'text-content',
      id: 'builder-intro',
      data: {
        content: `Use the interactive builder below to explore different combinations of alternates and see how they affect the total project cost in real-time.`,
      },
    },
    {
      type: 'cost-builder',
      id: 'cost-builder',
      title: 'Interactive Cost Calculator',
      description: 'Select alternates to see how they impact the total budget',
      data: {
        alternates: [
          { id: 1, description: 'Shop Applied-Membrane on CLT', amount: 53077, type: 'add' },
          { id: 2, description: 'Delegated Timber Design', amount: 45463, type: 'add' },
          { id: 3, description: 'Remove CLT from Gym Roof', amount: -504838, type: 'deduct' },
          { id: 4, description: 'Remove Gym Roof CLT and Glulam Beams', amount: -1192757, type: 'deduct' },
        ],
        baseTotal: 1701376,
        area: 23043,
      },
    },

    // Alternates Detail Section
    {
      type: 'section',
      id: 'section-alternates',
      data: { title: 'Alternates Detail' },
    },
    {
      type: 'comparison-table',
      id: 'alternates-table',
      title: 'Alternate Options',
      description: 'Detailed breakdown of available scope modifications',
      data: {
        headers: ['Alt #', 'Description', 'Type', 'Amount'],
        rows: [
          { label: 'Alt 1', values: ['Shop Applied-Membrane on CLT', 'Add', '+$53,077'] },
          { label: 'Alt 2', values: ['Delegated Timber Design', 'Add', '+$45,463'] },
          { label: 'Alt 3', values: ['Remove CLT from Gym Roof', 'Deduct', '-$504,838'], highlight: true },
          { label: 'Alt 4', values: ['Remove Gym Roof CLT and Glulam Beams', 'Deduct', '-$1,192,757'], highlight: true },
        ],
      },
    },

    // Site Photos Section
    {
      type: 'section',
      id: 'section-site',
      data: { title: 'Site Photos' },
    },
    {
      type: 'image-gallery',
      id: 'site-photos',
      data: {
        images: [
          { src: '/images/projects/X25RB05-masstimber/IMG_1018.JPG', alt: 'Site Photo 1' },
          { src: '/images/projects/X25RB05-masstimber/IMG_1019.JPG', alt: 'Site Photo 2' },
          { src: '/images/projects/X25RB05-masstimber/IMG_1020.JPG', alt: 'Site Photo 3' },
          { src: '/images/projects/X25RB05-masstimber/PFISDCounselingTeam (1).jpg', alt: 'PFISD Counseling Team' },
        ],
        columns: 2,
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
      id: 'sources-list',
      data: {
        sources: [
          { id: 1, title: 'Timberlab, Inc. Cost Estimate', author: 'Timberlab, Inc.' },
          { id: 2, title: 'AISD Project Requirements', author: 'Austin ISD' },
          { id: 3, title: 'Mass Timber Construction Guidelines', author: 'WoodWorks' },
          { id: 4, title: 'CLT Handbook', author: 'FPInnovations' },
        ],
      },
    },
  ],
};
