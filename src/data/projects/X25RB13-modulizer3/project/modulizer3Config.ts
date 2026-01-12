import type { ProjectConfig } from '../../../../components/blocks/types';

export const modulizer3Config: ProjectConfig = {
  id: 'X25-RB13',
  title: 'The Modulizer Part 3',
  code: 'X25-RB13',
  subtitle: 'Flour Bluff CTE Center - Design Concept Survey Analysis',
  category: 'sustainability',
  researcher: 'Alex Wickes',
  totalHours: 40,
  accentColor: '#00A9E0',

  blocks: [
    // Executive Summary Section
    {
      type: 'section',
      id: 'section-summary',
      data: { title: 'Executive Summary' },
    },
    {
      type: 'text-content',
      id: 'summary-text',
      data: {
        content: `Survey feedback collected from **65 participants** across three schematic design concepts for the Flour Bluff CTE Center. Participants rated each concept on a 1-5 scale and provided written feedback on what excites them and their concerns.

**Survey Date:** October 21, 2025
**Format:** Paper surveys with 3 questions per concept
**Distribution:** In-person at ideation workshop`,
      },
    },
    {
      type: 'key-findings',
      id: 'key-findings',
      data: {
        findings: [
          {
            title: 'Total Responses',
            value: '65',
            detail: 'Across all three design concepts',
            icon: 'target',
          },
          {
            title: 'Highest Rated',
            value: 'The Porch',
            detail: '50% gave rating of 5 (Very Excited)',
            icon: 'award',
          },
          {
            title: 'Most Consistent',
            value: 'The Current',
            detail: '43% gave rating of 4',
            icon: 'trend',
          },
          {
            title: 'Top Theme',
            value: 'Outdoor Spaces',
            detail: 'Universally appreciated across all concepts',
            icon: 'lightbulb',
          },
        ],
      },
    },
    {
      type: 'comparison-table',
      id: 'concept-comparison',
      title: 'Concept Comparison',
      data: {
        headers: ['Concept', 'Responses', 'Avg Rating', 'Top Rating (5)', 'Low Ratings (1-2)'],
        rows: [
          { label: 'The Bridge', values: ['22', '~3.8', '9 (41%)', '2 (9%)'] },
          { label: 'The Porch', values: ['22', '~3.9', '11 (50%)', '3 (14%)'], highlight: true },
          { label: 'The Current', values: ['21', '~3.7', '8 (38%)', '2 (10%)'] },
        ],
      },
    },

    // Concept 1: The Bridge
    {
      type: 'section',
      id: 'section-bridge',
      data: { title: 'Concept 1: The Bridge' },
    },
    {
      type: 'text-content',
      id: 'bridge-overview',
      title: 'Connection + Growth',
      data: {
        content: `The Bridge concept features **two separate buildings** connected by outdoor spaces, emphasizing flexibility and separation between CTE and Fine Arts programs.

**Key Features:**
- High and low intensity labs separated
- Multiple outdoor spaces shared between programs
- Centralized, enclosed campus feel
- Strong visibility between programs`,
      },
    },
    {
      type: 'survey-rating',
      id: 'bridge-rating',
      title: 'Rating Distribution',
      data: {
        title: 'The Bridge',
        totalResponses: 22,
        averageRating: 3.8,
        color: '#3b82f6',
        ratings: [
          { rating: 5, count: 9, label: 'Very Excited' },
          { rating: 4, count: 8, label: 'Somewhat Excited' },
          { rating: 3, count: 3, label: 'Neutral' },
          { rating: 2, count: 1, label: 'Somewhat Displeased' },
          { rating: 1, count: 1, label: 'Very Displeased' },
        ],
      },
    },
    {
      type: 'feedback-summary',
      id: 'bridge-feedback',
      data: {
        positives: {
          title: 'What Excites People',
          score: 82,
          themes: [
            { theme: 'Outdoor spaces', mentions: 12, description: 'Shared outdoor areas, immersion zones, covered walkways' },
            { theme: 'Separation/Flexibility', mentions: 8, description: 'High and low intensity labs separated' },
            { theme: 'Safety/Enclosed design', mentions: 5, description: 'Centralized, closed campus feel' },
            { theme: 'Storage solutions', mentions: 4, description: 'Multiple mentions of adequate storage' },
            { theme: 'Visibility', mentions: 3, description: 'Ability to see between programs' },
          ],
        },
        concerns: {
          title: 'Concerns Raised',
          score: 45,
          themes: [
            { theme: 'Cost of two buildings', mentions: 4, description: 'Two separate buildings might raise cost' },
            { theme: 'Multiple lobbies', mentions: 3, description: 'Concerns about wasted space and security' },
            { theme: 'Sound bleed', mentions: 3, description: 'Between CTE noise and music noise' },
            { theme: 'Too much separation', mentions: 2, description: 'Some want MORE connection' },
            { theme: 'Delivery access', mentions: 2, description: 'High intensity labs need forklift access' },
          ],
        },
      },
    },
    {
      type: 'quotes',
      id: 'bridge-quotes',
      title: 'Sample Feedback',
      data: {
        quotes: [
          { text: 'I like that CTE & Fine Arts are separated, & there are multiple outdoor spaces that both CTE & FA can use', rating: 5, source: 'Page 16' },
          { text: 'Design!!! Open multi purpose space', rating: 5, source: 'Page 7' },
          { text: 'Flexibility High Intensity Labs', rating: 4, source: 'Page 8' },
          { text: "I don't like the separation of buildings", rating: 1, source: 'Page 13' },
        ],
        columns: 2,
      },
    },

    // Concept 2: The Porch
    {
      type: 'section',
      id: 'section-porch',
      data: { title: 'Concept 2: The Porch' },
    },
    {
      type: 'text-content',
      id: 'porch-overview',
      title: 'Belonging + Identity',
      data: {
        content: `The Porch concept features a **unified building** with centralized lobby and shared outdoor courtyard spaces, emphasizing community and collaboration.

**Key Features:**
- Single access point with centralized lobby
- Connected wings for CTE and Fine Arts
- Shared outdoor courtyard spaces
- Potential for outdoor performance/amphitheater`,
      },
    },
    {
      type: 'survey-rating',
      id: 'porch-rating',
      title: 'Rating Distribution',
      data: {
        title: 'The Porch',
        totalResponses: 22,
        averageRating: 3.9,
        color: '#10b981',
        ratings: [
          { rating: 5, count: 11, label: 'Very Excited' },
          { rating: 4, count: 5, label: 'Somewhat Excited' },
          { rating: 3, count: 3, label: 'Neutral' },
          { rating: 2, count: 2, label: 'Somewhat Displeased' },
          { rating: 1, count: 0, label: 'Very Displeased' },
        ],
      },
    },
    {
      type: 'feedback-summary',
      id: 'porch-feedback',
      data: {
        positives: {
          title: 'What Excites People',
          score: 91,
          themes: [
            { theme: 'Connectivity', mentions: 10, description: 'Connected - all together' },
            { theme: 'Single access point', mentions: 7, description: 'Centralized lobby, easier supervision' },
            { theme: 'Open collaboration', mentions: 6, description: 'Shared spaces promote interaction' },
            { theme: 'Outdoor performance', mentions: 5, description: 'Potential for amphitheater, outdoor learning' },
            { theme: 'Versatility', mentions: 4, description: 'Flexible, adaptable spaces' },
          ],
        },
        concerns: {
          title: 'Concerns Raised',
          score: 38,
          themes: [
            { theme: 'Crowding/Congestion', mentions: 5, description: 'Feels more crammed together' },
            { theme: 'Territorial conflicts', mentions: 4, description: 'Both would be territorial over spaces' },
            { theme: 'Heat control', mentions: 3, description: 'Heat control with so much open/windows' },
            { theme: 'Emergency access', mentions: 2, description: 'Ability to access in an emergency' },
            { theme: 'Shared space conflicts', mentions: 2, description: 'Who can/cannot use the shared space' },
          ],
        },
      },
    },
    {
      type: 'quotes',
      id: 'porch-quotes',
      title: 'Sample Feedback',
      data: {
        quotes: [
          { text: 'I like the outdoor spaces that could be used for outdoor performance, I like this one best!', rating: 5, source: 'Page 33' },
          { text: 'Option 2, Open Collaboration, Contained wings', rating: 5, source: 'Page 29' },
          { text: 'This is the way.', rating: 5, source: 'Page 27' },
          { text: 'Do Not like! Needs to be separate buildings!', rating: 2, source: 'Page 39' },
        ],
        columns: 2,
      },
    },

    // Concept 3: The Current
    {
      type: 'section',
      id: 'section-current',
      data: { title: 'Concept 3: The Current' },
    },
    {
      type: 'text-content',
      id: 'current-overview',
      title: 'Direction + Purpose',
      data: {
        content: `The Current concept features a **linear "spine"** connecting two wings, emphasizing room for growth and separation while maintaining connectivity.

**Key Features:**
- Connective spine through the middle
- Each program gets dedicated outdoor areas
- Room for future growth and expansion
- Shared lobby with separated wings`,
      },
    },
    {
      type: 'survey-rating',
      id: 'current-rating',
      title: 'Rating Distribution',
      data: {
        title: 'The Current',
        totalResponses: 21,
        averageRating: 3.7,
        color: '#f59e0b',
        ratings: [
          { rating: 5, count: 8, label: 'Very Excited' },
          { rating: 4, count: 9, label: 'Somewhat Excited' },
          { rating: 3, count: 2, label: 'Neutral' },
          { rating: 2, count: 1, label: 'Somewhat Displeased' },
          { rating: 1, count: 0, label: 'Very Displeased' },
        ],
      },
    },
    {
      type: 'feedback-summary',
      id: 'current-feedback',
      data: {
        positives: {
          title: 'What Excites People',
          score: 76,
          themes: [
            { theme: 'Room for growth', mentions: 8, description: 'Multiple mentions of expansion potential' },
            { theme: 'Separation with connection', mentions: 6, description: 'Best of both worlds' },
            { theme: 'Own outdoor spaces', mentions: 5, description: 'Each program gets dedicated areas' },
            { theme: 'Shared lobby', mentions: 4, description: 'Centralized entry point' },
            { theme: 'Flexible design', mentions: 3, description: 'Seems the most flexible' },
          ],
        },
        concerns: {
          title: 'Concerns Raised',
          score: 42,
          themes: [
            { theme: 'Two lobbies', mentions: 4, description: 'Less community feel' },
            { theme: 'Crowding', mentions: 3, description: 'Flow seems too confined' },
            { theme: 'Irregular shapes', mentions: 3, description: 'Complex building footprint' },
            { theme: 'Size imbalance', mentions: 2, description: 'Size of CTE vs Fine Arts?' },
            { theme: 'Too many entry points', mentions: 2, description: 'Security concern' },
          ],
        },
      },
    },
    {
      type: 'quotes',
      id: 'current-quotes',
      title: 'Sample Feedback',
      data: {
        quotes: [
          { text: 'Love this one! Both FA + CTE have their own building + own outdoor space', rating: 4, source: 'Page 60' },
          { text: "Love the connective 'Spine' through the middle, Room for growth", rating: 3, source: 'Page 65' },
          { text: 'Drive through, Open for Future', rating: 5, source: 'Page 53' },
          { text: 'Interaction but Still separated', rating: 5, source: 'Page 52' },
        ],
        columns: 2,
      },
    },

    // Cross-Concept Analysis
    {
      type: 'section',
      id: 'section-analysis',
      data: { title: 'Cross-Concept Analysis' },
    },
    {
      type: 'key-findings',
      id: 'common-positives',
      title: 'Most Common Positive Themes',
      description: 'Universally appreciated across all concepts',
      data: {
        findings: [
          { title: 'Outdoor Spaces', value: '#1', detail: 'Universally appreciated', icon: 'lightbulb' },
          { title: 'Flexibility', value: '#2', detail: 'Adaptable spaces valued', icon: 'trend' },
          { title: 'Clear Zones', value: '#3', detail: 'Separation when needed', icon: 'target' },
          { title: 'Connection', value: '#4', detail: 'Visibility between programs', icon: 'award' },
        ],
      },
    },
    {
      type: 'key-findings',
      id: 'common-concerns',
      title: 'Most Common Concerns',
      description: 'Issues raised across all concepts',
      data: {
        findings: [
          { title: 'Crowding', value: '#1', detail: 'Hallways, entries, shared spaces', icon: 'lightbulb' },
          { title: 'Security', value: '#2', detail: 'Multiple entry points, lockdown', icon: 'target' },
          { title: 'Territory', value: '#3', detail: 'Sharing between CTE and FA', icon: 'trend' },
          { title: 'Logistics', value: '#4', detail: 'Deliveries, storage, access', icon: 'dollar' },
        ],
      },
    },

    // Recommendations
    {
      type: 'section',
      id: 'section-recommendations',
      data: { title: 'Recommendations' },
    },
    {
      type: 'text-content',
      id: 'recommendations-text',
      title: 'Based on Survey Feedback',
      data: {
        content: `**The Porch shows strongest overall support**
- Highest percentage of "5" ratings (50%)
- Fewest concerns about separation
- Enthusiasm for collaboration and community

**Key design elements to prioritize (regardless of concept):**
- Generous outdoor spaces - Most frequently mentioned positive
- Clear separation for high/low intensity labs - Operational necessity
- Adequate storage - Frequently mentioned need
- Single, secure entry point - Security and supervision
- Flexibility for future growth - Long-term adaptability

**Issues to address in Design Development:**
- Crowding mitigation - Wider hallways, multiple circulation paths
- Shared space protocols - Clear rules for CTE/FA territory
- Acoustic separation - Sound isolation between noisy/quiet spaces
- Delivery/service access - Separate from student circulation
- Climate control - Balance openness with HVAC efficiency

**Consider hybrid approach:**
Combine The Porch's centralized lobby with The Current's growth potential. Maintain The Bridge's separated high/low intensity zones. Provide both shared and dedicated outdoor spaces.`,
      },
    },

    // Next Steps
    {
      type: 'section',
      id: 'section-next',
      data: { title: 'Next Steps' },
    },
    {
      type: 'timeline',
      id: 'next-steps-timeline',
      data: {
        events: [
          { date: 'Nov 5, 2025', title: 'Present findings to stakeholders', status: 'complete' },
          { date: 'Nov 11, 2025', title: 'Select final concept', status: 'in-progress' },
          { date: 'Nov 2025', title: 'Reconcile with energy/daylighting analysis', status: 'pending' },
          { date: 'Dec 2025', title: 'Refine in Climate Studio', status: 'pending' },
          { date: 'Mar 2026', title: 'Address top 5 concerns in DD', status: 'pending' },
        ],
        layout: 'horizontal',
      },
    },

    // Sources
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
          { id: 1, title: 'Ideation Workshop Survey Scan', author: 'Oct 21, 2025' },
          { id: 2, title: 'survey_results_complete.csv', author: 'Complete dataset' },
          { id: 3, title: 'Enhanced survey page images', author: '65 pages, 300 DPI' },
        ],
      },
    },
  ],
};
