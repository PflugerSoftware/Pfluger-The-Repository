import type { ProjectConfig } from '../../../../components/blocks/types';

export const a4leConfig: ProjectConfig = {
  id: 'X25-RB03',
  title: 'A4LE Design Awards',
  code: 'X25-RB03',
  subtitle: 'Supporting Educational Design Excellence',
  category: 'immersive',
  researcher: 'Alex Wickes',
  totalHours: 40,
  accentColor: '#00A9E0',

  blocks: [
    // Overview Section
    {
      type: 'section',
      id: 'section-overview',
      data: { title: 'Overview' },
    },
    {
      type: 'text-content',
      id: 'overview-text',
      data: {
        content: `This research supports A4LE (Association for Learning Environments) design award submissions by documenting sustainable components and educational design excellence across Pfluger projects.

**Research Focus:**
- Documenting sustainable design strategies
- Compiling performance metrics for award submissions
- Aligning project narratives with A4LE evaluation criteria
- Supporting AIA design award submissions`,
      },
    },
    {
      type: 'key-findings',
      id: 'overview-findings',
      data: {
        findings: [
          {
            title: 'Award Categories',
            value: 'Multiple',
            detail: 'A4LE and AIA submissions',
            icon: 'award',
          },
          {
            title: 'Focus Area',
            value: 'K-12',
            detail: 'Educational environments',
            icon: 'target',
          },
          {
            title: 'Criteria',
            value: 'Sustainability',
            detail: 'Performance-based design',
            icon: 'lightbulb',
          },
          {
            title: 'Documentation',
            value: 'Ongoing',
            detail: 'Research compilation',
            icon: 'trend',
          },
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
      id: 'sources-list',
      data: {
        sources: [
          { id: 1, title: 'A4LE Design Awards Program', author: 'Association for Learning Environments', url: 'https://www.a4le.org/A4LE/Awards/Design_Awards.aspx' },
        ],
      },
    },
  ],
};
