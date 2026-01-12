import type { ProjectConfig } from '../../../../components/blocks/types';

export const showcaseConfig: ProjectConfig = {
  id: 'X00-DEMO',
  title: 'Block Showcase',
  code: 'X00-DEMO',
  subtitle: 'A reference guide to all available block types',
  category: 'documentation',
  researcher: 'Development Team',
  totalHours: 0,
  accentColor: '#00A9E0',

  blocks: [
    // ===== 1. SECTION =====
    {
      type: 'section',
      id: 'section-intro',
      data: { title: 'Section Block', sources: [1, 2] },
    },
    {
      type: 'text-content',
      id: 'section-desc',
      data: {
        content: `The **section** block creates a visual divider with a title. It can optionally display source reference numbers.

\`\`\`typescript
type: 'section'
data: { title: string; sources?: number[] }
\`\`\``,
      },
    },

    // ===== 2. TEXT-CONTENT =====
    {
      type: 'section',
      id: 'section-text',
      data: { title: 'Text Content Block' },
    },
    {
      type: 'text-content',
      id: 'text-example',
      title: 'Optional Title',
      description: 'Optional description text',
      data: {
        content: `The **text-content** block renders markdown-like content with support for:

## Headers (h2)
### Subheaders (h3)

- Bullet points
- **Bold text** using double asterisks
- Regular paragraphs

Empty lines create spacing between elements.`,
      },
    },

    // ===== 3. STAT-GRID =====
    {
      type: 'section',
      id: 'section-stats',
      data: { title: 'Stat Grid Block' },
    },
    {
      type: 'stat-grid',
      id: 'stat-example',
      title: 'Key Metrics',
      data: {
        stats: [
          { label: 'Total Projects', value: '42', detail: 'Across all categories', trend: 'up' },
          { label: 'Completion Rate', value: '87%', detail: 'On-time delivery', trend: 'up' },
          { label: 'Budget Variance', value: '-3%', detail: 'Under budget', trend: 'down' },
          { label: 'Team Members', value: '12', detail: 'Active contributors', trend: 'neutral' },
        ],
        columns: 4,
      },
    },

    // ===== 4. KEY-FINDINGS =====
    {
      type: 'section',
      id: 'section-findings',
      data: { title: 'Key Findings Block' },
    },
    {
      type: 'key-findings',
      id: 'findings-example',
      title: 'Research Insights',
      data: {
        findings: [
          {
            title: 'User Satisfaction',
            value: '94%',
            detail: 'Users reported positive experiences with the new interface',
            icon: 'heart',
          },
          {
            title: 'Performance',
            value: '2.3s',
            detail: 'Average page load time reduced by 40%',
            icon: 'zap',
          },
          {
            title: 'Accessibility',
            value: 'AA',
            detail: 'WCAG 2.1 compliance achieved',
            icon: 'check-circle',
          },
          {
            title: 'Cost Savings',
            value: '$125K',
            detail: 'Annual operational cost reduction',
            icon: 'dollar-sign',
          },
        ],
      },
    },

    // ===== 5. BAR-CHART =====
    {
      type: 'section',
      id: 'section-bar',
      data: { title: 'Bar Chart Block' },
    },
    {
      type: 'bar-chart',
      id: 'bar-simple',
      title: 'Simple Bar Chart',
      description: 'Single set of horizontal bars',
      data: {
        items: [
          { label: 'Category A', value: 85, color: '#00A9E0' },
          { label: 'Category B', value: 72, color: '#67823A' },
          { label: 'Category C', value: 58, color: '#F2A900' },
          { label: 'Category D', value: 43, color: '#9A3324' },
        ],
        unit: '%',
        showValues: true,
      },
    },
    {
      type: 'bar-chart',
      id: 'bar-grouped',
      title: 'Grouped Bar Chart',
      description: 'Multiple groups with expandable details',
      data: {
        groups: [
          {
            label: 'Q1 2025',
            color: '#00A9E0',
            items: [
              { label: 'Sales', value: 120 },
              { label: 'Marketing', value: 80 },
              { label: 'R&D', value: 95 },
            ],
          },
          {
            label: 'Q2 2025',
            color: '#67823A',
            items: [
              { label: 'Sales', value: 145 },
              { label: 'Marketing', value: 92 },
              { label: 'R&D', value: 88 },
            ],
          },
        ],
        unit: 'K',
        showValues: true,
      },
    },

    // ===== 6. DONUT-CHART =====
    {
      type: 'section',
      id: 'section-donut',
      data: { title: 'Donut Chart Block' },
    },
    {
      type: 'donut-chart',
      id: 'donut-example',
      title: 'Budget Allocation',
      data: {
        segments: [
          { label: 'Construction', value: 45, color: '#00A9E0' },
          { label: 'Design', value: 25, color: '#67823A' },
          { label: 'Equipment', value: 20, color: '#F2A900' },
          { label: 'Contingency', value: 10, color: '#9A3324' },
        ],
        total: 100,
        centerLabel: 'Total Budget',
      },
    },

    // ===== 7. LINE-CHART =====
    {
      type: 'section',
      id: 'section-line',
      data: { title: 'Line Chart Block' },
    },
    {
      type: 'text-content',
      id: 'line-note',
      data: {
        content: `The **line-chart** block displays trend data over time. Implementation uses Recharts for smooth animations.`,
      },
    },

    // ===== 8. COMPARISON-TABLE =====
    {
      type: 'section',
      id: 'section-table',
      data: { title: 'Comparison Table Block' },
    },
    {
      type: 'comparison-table',
      id: 'table-example',
      title: 'Feature Comparison',
      description: 'Side-by-side analysis of options',
      data: {
        headers: ['Feature', 'Option A', 'Option B', 'Option C'],
        rows: [
          { label: 'Price', values: ['$50K', '$75K', '$120K'], highlight: false },
          { label: 'Timeline', values: ['3 months', '2 months', '1 month'], highlight: false },
          { label: 'Support', values: ['Email', 'Phone + Email', '24/7 Dedicated'], highlight: true },
          { label: 'Warranty', values: ['1 year', '2 years', '5 years'], highlight: false },
        ],
      },
    },

    // ===== 9. IMAGE-GALLERY =====
    {
      type: 'section',
      id: 'section-gallery',
      data: { title: 'Image Gallery Block' },
    },
    {
      type: 'text-content',
      id: 'gallery-note',
      data: {
        content: `The **image-gallery** block displays images in a responsive grid with optional captions. Supports 2, 3, or 4 columns.

Images can be clicked for lightbox view.`,
      },
    },

    // ===== 10. TIMELINE =====
    {
      type: 'section',
      id: 'section-timeline',
      data: { title: 'Timeline Block' },
    },
    {
      type: 'timeline',
      id: 'timeline-example',
      title: 'Project Timeline',
      data: {
        events: [
          { date: '2025-01', title: 'Project Kickoff', description: 'Initial planning and team assembly', status: 'complete' },
          { date: '2025-03', title: 'Design Phase', description: 'Schematic design and client review', status: 'complete' },
          { date: '2025-06', title: 'Development', description: 'Construction documents and permitting', status: 'in-progress' },
          { date: '2025-09', title: 'Construction', description: 'Building phase begins', status: 'pending' },
          { date: '2025-12', title: 'Completion', description: 'Final walkthrough and handover', status: 'pending' },
        ],
        layout: 'horizontal',
      },
    },

    // ===== 11. WORKFLOW-STEPS =====
    {
      type: 'section',
      id: 'section-workflow',
      data: { title: 'Workflow Steps Block' },
    },
    {
      type: 'workflow-steps',
      id: 'workflow-example',
      title: 'Design Process',
      description: 'Our standard approach to project delivery',
      data: {
        steps: [
          {
            number: 1,
            title: 'Discovery',
            status: 'complete',
            findings: ['Stakeholder interviews conducted', 'Site analysis completed'],
            deliverables: ['Project brief', 'Site documentation'],
          },
          {
            number: 2,
            title: 'Concept Development',
            status: 'complete',
            findings: ['Three design options explored', 'Client selected Option B'],
            outcomes: ['Approved concept design', 'Budget alignment confirmed'],
          },
          {
            number: 3,
            title: 'Design Development',
            status: 'active',
            findings: ['MEP coordination in progress', 'Structural review pending'],
            interventions: [
              { action: 'Value engineering session', impact: '12% cost reduction' },
            ],
          },
          {
            number: 4,
            title: 'Documentation',
            status: 'pending',
            deliverables: ['Construction documents', 'Specifications'],
          },
        ],
      },
    },

    // ===== 12. CASE-STUDY-CARD =====
    {
      type: 'section',
      id: 'section-casestudy',
      data: { title: 'Case Study Card Block' },
    },
    {
      type: 'case-study-card',
      id: 'casestudy-example',
      title: 'Featured Projects',
      description: 'Horizontal scrolling cards with modal detail view',
      data: {
        studies: [
          {
            id: 'project-1',
            title: 'Innovation Center',
            subtitle: 'Corporate Headquarters',
            tags: ['Commercial', 'LEED Platinum', 'Award Winner'],
            description: 'A 250,000 SF headquarters featuring collaborative workspaces, wellness amenities, and cutting-edge sustainability features.',
            location: 'Austin, TX',
            year: 2024,
            metrics: [
              { label: 'Size', value: '250,000 SF' },
              { label: 'Rating', value: 'LEED Platinum' },
              { label: 'Energy', value: 'Net Zero' },
            ],
            strategies: [
              { name: 'Passive Design', description: 'Optimized orientation and massing', impact: '30% energy reduction' },
              { name: 'Biophilic Elements', description: 'Living walls and natural materials', impact: 'Improved wellness' },
            ],
            awards: ['AIA Design Award 2024', 'Best Workplace Design'],
          },
          {
            id: 'project-2',
            title: 'Community Library',
            subtitle: 'Public Institution',
            tags: ['Civic', 'Renovation', 'Historic'],
            description: 'Adaptive reuse of a 1920s warehouse into a modern community library with maker spaces and digital labs.',
            location: 'Dallas, TX',
            year: 2023,
            metrics: [
              { label: 'Size', value: '45,000 SF' },
              { label: 'Budget', value: '$18M' },
              { label: 'Capacity', value: '500 visitors/day' },
            ],
          },
          {
            id: 'project-3',
            title: 'Elementary School',
            subtitle: 'K-5 Education',
            tags: ['Education', 'New Construction'],
            description: 'A state-of-the-art elementary school designed for 21st century learning with flexible classrooms and outdoor learning spaces.',
            location: 'Houston, TX',
            year: 2024,
            metrics: [
              { label: 'Capacity', value: '850 students' },
              { label: 'Size', value: '120,000 SF' },
            ],
          },
          {
            id: 'project-4',
            title: 'Mixed-Use Development',
            subtitle: 'Urban Infill',
            tags: ['Mixed-Use', 'Transit-Oriented'],
            description: 'A transit-oriented development combining residential, retail, and office space in a walkable urban context.',
            location: 'San Antonio, TX',
            year: 2025,
            metrics: [
              { label: 'Units', value: '350 residential' },
              { label: 'Retail', value: '25,000 SF' },
            ],
          },
        ],
        columns: 2,
      },
    },

    // ===== 13. TOOL-COMPARISON =====
    {
      type: 'section',
      id: 'section-tools',
      data: { title: 'Tool Comparison Block' },
    },
    {
      type: 'tool-comparison',
      id: 'tools-example',
      title: 'Software Evaluation',
      description: 'Rating rings with expandable pros/cons',
      data: {
        tools: [
          {
            name: 'Tool Alpha',
            rating: 92,
            color: '#00A9E0',
            price: '$99/month',
            category: 'Enterprise',
            description: 'Full-featured solution for large teams',
            pros: ['Comprehensive features', 'Great support', 'Regular updates'],
            cons: ['Higher price point', 'Steep learning curve'],
          },
          {
            name: 'Tool Beta',
            rating: 78,
            color: '#67823A',
            price: '$49/month',
            category: 'Professional',
            description: 'Balanced option for mid-size teams',
            pros: ['Good value', 'Easy to use', 'Good integrations'],
            cons: ['Limited advanced features', 'Basic reporting'],
          },
          {
            name: 'Tool Gamma',
            rating: 65,
            color: '#F2A900',
            price: '$19/month',
            category: 'Starter',
            description: 'Entry-level solution for small teams',
            pros: ['Affordable', 'Quick setup', 'Simple interface'],
            cons: ['Limited scalability', 'Few integrations'],
          },
        ],
        columns: 3,
      },
    },

    // ===== 14. SCENARIO-BAR-CHART =====
    {
      type: 'section',
      id: 'section-scenario',
      data: { title: 'Scenario Bar Chart Block' },
    },
    {
      type: 'scenario-bar-chart',
      id: 'scenario-example',
      title: 'Cost Scenarios',
      description: 'Compare budget scenarios with cost per SF',
      data: {
        scenarios: [
          { name: 'Base Scope', total: 5000000, costPerSF: 250 },
          { name: 'With Alternates', total: 5750000, costPerSF: 287 },
          { name: 'Premium Package', total: 6500000, costPerSF: 325 },
        ],
        baseTotal: 5000000,
        unit: '$',
      },
    },

    // ===== 15. COST-BUILDER =====
    {
      type: 'section',
      id: 'section-cost',
      data: { title: 'Cost Builder Block' },
    },
    {
      type: 'cost-builder',
      id: 'cost-example',
      title: 'Interactive Budget Builder',
      description: 'Toggle alternates to see budget impact',
      data: {
        alternates: [
          { id: 1, description: 'Upgraded HVAC System', amount: 125000, type: 'add' },
          { id: 2, description: 'Premium Flooring', amount: 85000, type: 'add' },
          { id: 3, description: 'Value Engineering - Lighting', amount: 45000, type: 'deduct' },
          { id: 4, description: 'Solar Panel Array', amount: 200000, type: 'add' },
          { id: 5, description: 'Simplified Facade', amount: 150000, type: 'deduct' },
        ],
        baseTotal: 5000000,
        area: 20000,
      },
    },

    // ===== 16. SURVEY-RATING =====
    {
      type: 'section',
      id: 'section-survey',
      data: { title: 'Survey Rating Block' },
    },
    {
      type: 'survey-rating',
      id: 'survey-example',
      title: 'User Satisfaction Survey',
      data: {
        title: 'How satisfied are you with the new design?',
        totalResponses: 247,
        ratings: [
          { rating: 5, count: 112, label: 'Very Satisfied' },
          { rating: 4, count: 78, label: 'Satisfied' },
          { rating: 3, count: 35, label: 'Neutral' },
          { rating: 2, count: 15, label: 'Dissatisfied' },
          { rating: 1, count: 7, label: 'Very Dissatisfied' },
        ],
        averageRating: 4.1,
        color: '#00A9E0',
      },
    },

    // ===== 17. FEEDBACK-SUMMARY =====
    {
      type: 'section',
      id: 'section-feedback',
      data: { title: 'Feedback Summary Block' },
    },
    {
      type: 'feedback-summary',
      id: 'feedback-example',
      title: 'Stakeholder Feedback Analysis',
      data: {
        positives: {
          title: 'What People Loved',
          score: 85,
          themes: [
            { theme: 'Natural Light', mentions: 45, description: 'Large windows and skylights praised' },
            { theme: 'Collaboration Spaces', mentions: 38, description: 'Open areas for team interaction' },
            { theme: 'Acoustic Privacy', mentions: 28, description: 'Sound masking effectiveness' },
          ],
        },
        concerns: {
          title: 'Areas for Improvement',
          score: 35,
          themes: [
            { theme: 'Parking', mentions: 22, description: 'Limited visitor parking' },
            { theme: 'Wayfinding', mentions: 15, description: 'Signage could be clearer' },
            { theme: 'Temperature', mentions: 12, description: 'Zone control requests' },
          ],
        },
      },
    },

    // ===== 18. QUOTES =====
    {
      type: 'section',
      id: 'section-quotes',
      data: { title: 'Quotes Block' },
    },
    {
      type: 'quotes',
      id: 'quotes-example',
      title: 'Testimonials',
      data: {
        quotes: [
          {
            text: 'The new space has completely transformed how our team collaborates. We are seeing measurable improvements in productivity and morale.',
            author: 'Project Stakeholder',
            rating: 5,
          },
          {
            text: 'Beautiful design that balances aesthetics with functionality. The attention to detail is evident throughout.',
            author: 'Facility Manager',
            rating: 4,
          },
          {
            text: 'Our students love the new learning environments. The flexible spaces support multiple teaching styles.',
            author: 'Principal',
            rating: 5,
          },
        ],
        columns: 3,
      },
    },

    // ===== 19. ACTIVITY RINGS =====
    {
      type: 'section',
      id: 'section-rings',
      data: { title: 'Activity Rings Block' },
    },
    {
      type: 'activity-rings',
      id: 'rings-example',
      title: 'Budget by Category',
      description: 'Apple-style concentric rings grouped by vendor',
      data: {
        groups: [
          {
            vendor: 'Primary Systems',
            color: '#00A9E0',
            items: [
              {
                title: 'Main Display',
                subtitle: 'Panoramic',
                centerValue: '$150K',
                centerLabel: 'Total',
                rings: [
                  { name: 'Hardware', value: 60, color: '#00A9E0' },
                  { name: 'Install', value: 30, color: '#F2A900' },
                  { name: 'Content', value: 10, color: '#67823A' },
                ],
              },
              {
                title: 'Audio System',
                subtitle: '5.1 Surround',
                centerValue: '$25K',
                centerLabel: 'Total',
                rings: [
                  { name: 'Hardware', value: 80, color: '#00A9E0' },
                  { name: 'Install', value: 15, color: '#F2A900' },
                  { name: 'Content', value: 5, color: '#67823A' },
                ],
              },
            ],
          },
          {
            vendor: 'Interactive Elements',
            color: '#67823A',
            items: [
              {
                title: 'Touch Tables',
                subtitle: 'Qty: 4',
                centerValue: '$40K',
                centerLabel: 'Total',
                rings: [
                  { name: 'Hardware', value: 90, color: '#00A9E0' },
                  { name: 'Install', value: 5, color: '#F2A900' },
                  { name: 'Content', value: 5, color: '#67823A' },
                ],
              },
              {
                title: 'Floor Projection',
                subtitle: 'Interactive',
                centerValue: '$35K',
                centerLabel: 'Total',
                rings: [
                  { name: 'Hardware', value: 70, color: '#00A9E0' },
                  { name: 'Install', value: 20, color: '#F2A900' },
                  { name: 'Content', value: 10, color: '#67823A' },
                ],
              },
            ],
          },
        ],
        columns: 4,
      },
    },

    // ===== 20. PRODUCT OPTIONS =====
    {
      type: 'section',
      id: 'section-products',
      data: { title: 'Product Options Block' },
    },
    {
      type: 'text-content',
      id: 'products-desc',
      data: {
        content: `The **product-options** block displays product lines with multiple options, pricing, specs, and cost breakdowns using stacked bar charts.`,
      },
    },
    {
      type: 'product-options',
      id: 'products-example',
      title: 'Display Systems',
      description: 'Compare options within each product category',
      data: {
        lines: [
          {
            name: 'Panorama Domes',
            subtitle: 'Elumenati',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
            options: [
              { name: '6.8m', price: 189000, color: '#00A9E0', specs: [{ label: 'Diameter', value: '22.3 ft' }, { label: 'Capacity', value: '25-30' }], costs: [{ label: 'Hardware', value: 54, color: '#00A9E0' }, { label: 'Install', value: 42, color: '#F2A900' }, { label: 'Content', value: 4, color: '#67823A' }] },
              { name: '5.0m', price: 175000, color: '#3B82F6', specs: [{ label: 'Diameter', value: '16.4 ft' }, { label: 'Capacity', value: '15-20' }], costs: [{ label: 'Hardware', value: 50, color: '#00A9E0' }, { label: 'Install', value: 46, color: '#F2A900' }, { label: 'Content', value: 4, color: '#67823A' }] },
            ],
          },
          {
            name: 'Interactive Walls',
            subtitle: 'Kids Jump Tech',
            image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
            options: [
              { name: 'Fixed', price: 14000, color: '#67823A', specs: [{ label: 'Lumens', value: '5000lm' }, { label: 'Install', value: 'Permanent' }], costs: [{ label: 'Hardware', value: 64, color: '#00A9E0' }, { label: 'Install', value: 36, color: '#F2A900' }] },
              { name: 'Mobile', price: 13000, color: '#84CC16', specs: [{ label: 'Lumens', value: '5000lm' }, { label: 'Install', value: 'Portable' }], costs: [{ label: 'Hardware', value: 98, color: '#00A9E0' }, { label: 'Install', value: 2, color: '#F2A900' }] },
            ],
          },
        ],
        columns: 2,
      },
    },

    // ===== 21. SOURCES =====
    {
      type: 'section',
      id: 'section-sources',
      data: { title: 'Sources Block' },
    },
    {
      type: 'sources',
      id: 'sources-example',
      data: {
        sources: [
          { id: 1, title: 'Design Guidelines Documentation', author: 'Internal Team', url: '#' },
          { id: 2, title: 'Block System Architecture', author: 'Development Team', url: '#' },
          { id: 3, title: 'Component Library Reference', author: 'UI Team' },
        ],
      },
    },
  ],
};
