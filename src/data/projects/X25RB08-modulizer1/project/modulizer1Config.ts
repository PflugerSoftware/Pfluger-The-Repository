import type { ProjectConfig } from '../../../../components/blocks/types';

export const modulizer1Config: ProjectConfig = {
  id: 'X25-RB08',
  title: 'The Modulizer Part 1',
  code: 'X25-RB08',
  subtitle: 'Defining the Shape - Kennedy Elementary Energy Analysis',
  category: 'sustainability',
  researcher: 'Agustin Gonzalez, Alex Wickes',
  totalHours: 60,
  accentColor: '#10b981',

  blocks: [
    // Overview Section
    {
      type: 'section',
      id: 'section-overview',
      data: { title: 'Overview' },
    },
    {
      type: 'text-content',
      id: 'overview-intro',
      title: 'Research Context',
      data: {
        content: `This study examined energy and design implications of massing strategies in sustainable school architecture. Through literature review, precedent analysis, and computational modeling, we identified key strategies that directly impact building performance.

**Research Type:** Mid-Level Literature Review
**Project Context:** Kennedy Elementary`,
      },
    },
    {
      type: 'key-findings',
      id: 'overview-findings',
      data: {
        findings: [
          {
            title: 'Main Finding',
            value: 'Data-Backed Design',
            detail: 'Thoughtful, data-backed design makes a measurable difference',
            icon: 'award',
          },
          {
            title: 'Energy Impact',
            value: '9%',
            detail: 'Reduction possible through orientation alone',
            icon: 'energy',
          },
          {
            title: 'Research Hours',
            value: '60 hrs',
            detail: 'Phase 1 allocation',
            icon: 'target',
          },
          {
            title: 'Precedents',
            value: '5',
            detail: 'COTE projects analyzed',
            icon: 'lightbulb',
          },
        ],
      },
    },

    // Insights Section
    {
      type: 'section',
      id: 'section-insights',
      data: { title: 'Insights' },
    },
    {
      type: 'stat-grid',
      id: 'insights-strategies',
      title: 'Key Strategies',
      data: {
        stats: [
          { label: 'East-West Orientation', value: '9%', detail: 'Energy reduction (John Lewis)' },
          { label: 'Roof Optimization', value: '100%', detail: 'Renewable offset achievable' },
          { label: 'Glazing Fine-Tuning', value: 'Balanced', detail: 'Daylight vs heat gain' },
          { label: 'Shading Solutions', value: 'Critical', detail: 'For problem facades' },
        ],
        columns: 4,
      },
    },
    {
      type: 'text-content',
      id: 'strategies-detail',
      data: {
        content: `**East-West Orientation** - Orient buildings along east-west axis to minimize solar exposure. Up to 9% energy reduction demonstrated at John Lewis Elementary.

**Roof/Facade Optimization** - Design roof planes and facades to maximize PV and minimize self-shading. Increased renewable energy capture across all precedents.

**Glazing Fine-Tuning** - Customize glazing by orientation for daylight vs. heat gain balance. Reduced cooling loads and improved occupant comfort.

**Integrated PV Systems** - Include photovoltaic arrays in early massing decisions. 100% renewable offset achievable as shown in multiple COTE projects.

**Shading Solutions** - Deep overhangs, cantilevers, and solar screens for less-than-ideal orientations. Mitigated heat gain on problem facades.`,
      },
    },

    // Modeling Tools Section
    {
      type: 'section',
      id: 'section-tools',
      data: { title: 'Modeling Tools', sources: [1, 2, 3] },
    },
    {
      type: 'tool-comparison',
      id: 'tools-comparison',
      title: 'Energy Modeling Software Comparison',
      description: 'Evaluation of tools for different project phases',
      data: {
        tools: [
          {
            name: 'Climate Studio',
            rating: 90,
            color: '#10b981',
            price: '$2,500/year',
            category: 'Rhino Extension',
            description: 'Detailed results for DD and CD stages with comprehensive evaluation tools.',
            pros: ['Detailed DD/CD results', 'Comprehensive tools', 'More accurate for validation'],
            cons: ['Requires Rhino skills', 'Higher cost'],
          },
          {
            name: 'Sefaira',
            rating: 84,
            color: '#3b82f6',
            price: '$1,995/year',
            category: 'SketchUp + Web',
            description: 'Useful for PD, SD, & DD stages with easy-to-use SketchUp extension.',
            pros: ['Easy to use', 'Good for early stages', 'No extensive input required'],
            cons: ['Extension can fail', 'Limited EUI in extension'],
          },
          {
            name: 'Ladybug/Honeybee',
            rating: 80,
            color: '#8b5cf6',
            price: 'Free',
            category: 'Grasshopper (Rhino)',
            description: 'Fully customizable tools with large community support.',
            pros: ['All phases capable', 'Fully customizable', 'Free & open source'],
            cons: ['Complex setup', 'Requires expertise'],
          },
          {
            name: 'Autodesk Forma',
            rating: 70,
            color: '#f59e0b',
            price: '$1,550/year',
            category: 'Web-based',
            description: 'Wide range of site design evaluation tools, good for site-level assessments.',
            pros: ['Site-level tools', 'Part of Pfluger suite', 'Good for assessments'],
            cons: ['No energy modeling', 'Lacks building analysis'],
          },
        ],
        columns: 2,
      },
    },

    // Precedents Section
    {
      type: 'section',
      id: 'section-precedents',
      data: { title: 'Precedent Studies', sources: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    },
    {
      type: 'case-study-card',
      id: 'precedent-cards',
      title: 'COTE Award-Winning Projects',
      description: 'Analysis of sustainable design strategies from leading projects',
      data: {
        studies: [
          {
            id: 'fleet',
            title: 'Alice West Fleet Elementary School',
            subtitle: 'Arlington Public Schools - VMDO Architects',
            location: 'Arlington, Virginia',
            architect: 'VMDO Architects',
            year: 2022,
            siteArea: '204,235 SF',
            conditionedArea: '111,634 SF',
            stories: 6,
            tags: ['Education', 'COTE 2024', 'Mass Timber', 'Geothermal'],
            description: 'Six-story elementary school with innovative Y-shaped massing. Roofs designed to avoid self-shading while maximizing PV collection. The building demonstrates how strategic orientation and envelope design can achieve exceptional sustainability performance.',
            buildingType: ['Added insulation', 'Operable windows', 'Geothermal energy', 'Mass timber'],
            metrics: [
              { label: 'Site Area', value: '204,235 SF' },
              { label: 'Conditioned', value: '111,634 SF' },
              { label: 'Stories', value: '6' },
            ],
            strategies: [
              {
                name: 'Roof Plane & Shape Optimization',
                description: 'Using roofs that don\'t shade each other, concept design options were blocked and stacked with the sun, while keeping the principal parti axis east-west and minimizing the building footprint.',
                impact: 'Max PV capture'
              },
              {
                name: 'Y-Shaped Massing Optimization',
                description: 'The two "arms of the Y" each had less than ideal solar orientation. The arm aligned with the street used mass timber with deep overhangs to produce shade, while the other arm fine-tuned apertures and used custom shading.',
                impact: 'Shade on poor orientations'
              },
              {
                name: 'Vertical Glazing Optimization',
                description: 'Each elevation was fine tuned to allow maximum daylight with minimal solar heat gain. Northwest facing classrooms "pushed out" for floor-to-ceiling north glass, while southeast classrooms did the opposite.',
                impact: 'Balanced daylight/heat'
              },
            ],
            team: [
              { role: 'General Contractor', company: 'Whiting-Turner Contracting' },
              { role: 'MEP Engineer', company: 'CMTA' },
              { role: 'Structural Engineer', company: 'Springpoint' },
              { role: 'Civil Engineer', company: 'Bowman Consulting' },
              { role: 'Landscape', company: 'Waterstreet Studio' },
              { role: 'Traffic Engineer', company: 'Toole Design Group' },
            ],
            awards: ['AIA COTE Top Ten 2024'],
          },
          {
            id: 'lewis',
            title: 'John Lewis Elementary School',
            subtitle: 'District of Columbia Public Schools',
            location: 'Washington, D.C.',
            architect: 'Perkins Eastman',
            year: 2021,
            siteArea: '162,948 SF',
            conditionedArea: '88,588 SF',
            stories: 2,
            tags: ['Education', 'COTE 2025', 'PV Panels', 'Geothermal'],
            description: 'Project team flipped the design previously done during the feasibility study and rotated it 90 degrees so that the building is oriented along an east-west axis. This decision alone resulted in a 9% reduction in energy consumption.',
            buildingType: ['PV Panels on roof', 'Geothermal well field'],
            metrics: [
              { label: 'Site Area', value: '162,948 SF' },
              { label: 'Building Area', value: '88,588 SF' },
              { label: 'Stories', value: '2' },
            ],
            strategies: [
              { name: 'Massing Optimization', description: 'Flipped and rotated design 90 degrees for east-west orientation', impact: '9% energy reduction' },
            ],
            team: [
              { role: 'General Contractor', company: 'Gilbane/Saxon JV' },
              { role: 'MEP Engineer', company: 'CMTA' },
              { role: 'Structural Engineer', company: 'Yun Associates' },
              { role: 'Landscape Architect', company: 'Natural Resources Design' },
              { role: 'Sustainability', company: 'Perkins Eastman' },
              { role: 'Energy Modeling', company: 'CMTA' },
            ],
            awards: ['AIA COTE Top Ten 2025', '2023 American Architecture Award', '2023 Planet Positive Award'],
          },
          {
            id: 'coliseum',
            title: 'Coliseum Place Affordable Family Housing',
            subtitle: '59 Affordable Apartment Units',
            location: 'Oakland, California',
            architect: 'David Baker Architects',
            year: 2021,
            siteArea: '20,290 SF',
            conditionedArea: '71,512 SF',
            tags: ['Housing', 'COTE', 'Affordable', 'Net Zero'],
            description: 'The design combines simple massing and solar orientation response as the basis for ambitious energy-consumption-reduction goals. Features a protective solar screen along south facade and PV canopy achieving 100% common load offset.',
            buildingType: ['Simple Massing', 'Protective Solar Screen on south facade', 'PV Canopy', 'Decentralized water heating'],
            metrics: [
              { label: 'EUI', value: '15 kBtu/sf' },
              { label: 'PV Array', value: '98 kW' },
              { label: 'Waste Diversion', value: '81%' },
            ],
            strategies: [
              { name: 'Simple Massing', description: 'Clean building form optimized for solar response', impact: 'Reduced complexity' },
              { name: 'South Facade Solar Screen', description: 'Protective shading along primary solar exposure', impact: 'Reduced cooling' },
              { name: 'PV Canopy', description: '98 kW array offsetting 100% of common loads', impact: '100% offset' },
              { name: 'Decentralized Hot Water', description: 'Residential heat pump water heaters remove major inefficiency', impact: 'Improved efficiency' },
            ],
            awards: ['AIA COTE Top Ten'],
          },
          {
            id: 'westwood',
            title: 'Westwood Hills Nature Center',
            subtitle: 'Net Zero Nature Center',
            location: 'St. Louis Park, Minnesota',
            architect: 'HGA',
            year: 2020,
            siteArea: '167,088 SF',
            conditionedArea: '13,565 SF',
            tags: ['Nature Center', 'COTE', 'Zero Energy', 'Geothermal'],
            description: 'The envelope, orientation, and shading were optimized for efficiency to take advantage of existing site resources - sun and wind - and maximize use of passive heating, cooling, and daylighting. Achieved 100% renewable energy and provides educational opportunities for visitors.',
            buildingType: ['Photovoltaic array', 'Geothermal well field', 'Radiant floor heating', 'LED lighting'],
            metrics: [
              { label: 'Renewable', value: '100%' },
              { label: 'Carbon Reduction', value: '100%' },
              { label: 'Stormwater Managed', value: '81.6%' },
            ],
            strategies: [
              { name: 'Envelope Optimization', description: 'Optimized for passive heating, cooling, and daylighting using sun and wind', impact: '100% zero energy' },
              { name: 'Geothermal + Radiant Floor', description: 'Well field supplements all-electric boilers as heat source', impact: 'Maximum efficiency' },
              { name: 'WeatherShift Modeling', description: 'Used future weather data projections in energy model', impact: 'Future-proof design' },
            ],
            awards: ['AIA COTE Top Ten'],
          },
          {
            id: 'olver',
            title: 'John W. Olver Transit Center',
            subtitle: 'Net Zero Transit Hub',
            location: 'Greenfield, Massachusetts',
            architect: 'Charles Rose Architects',
            year: 2014,
            siteArea: '81,400 SF',
            conditionedArea: '24,000 SF',
            tags: ['Transit', 'COTE', 'Zero Energy', 'Geothermal'],
            description: 'The design strategy utilized energy modeling, including sunpath diagrams to develop the building form. The second story cantilevers over the waiting area, providing shade and reducing summer solar heat gains. Achieved 100% renewable energy offset.',
            buildingType: ['7,300 SF PV array', '22 geothermal wells', 'On-site wood-pellet boiler', 'FSC certified wood'],
            metrics: [
              { label: 'EUI', value: '21.3 kBtu/sf' },
              { label: 'Renewable', value: '100%' },
              { label: 'Water Reduction', value: '85%' },
            ],
            strategies: [
              { name: 'Cantilevered Massing', description: 'Second story cantilevers to shade waiting area below', impact: 'Reduced heat gain' },
              { name: 'Sunpath-Driven Form', description: 'Building form developed using energy modeling and sunpath diagrams', impact: 'Optimized orientation' },
              { name: 'Multi-Source Renewable', description: 'PV, geothermal, and wood-pellet boiler for 100% renewable energy', impact: '95.5% carbon reduction' },
            ],
            awards: ['AIA COTE Top Ten'],
          },
        ],
        columns: 2,
      },
    },

    // Case Study Section
    {
      type: 'section',
      id: 'section-casestudy',
      data: { title: 'Optimizing Kennedy Elementary' },
    },
    {
      type: 'image-gallery',
      id: 'kennedy-renderings',
      data: {
        images: [
          { src: '/images/projects/X25RB08-modulizer1/OptionA_WoodStone_Final.png', alt: 'Kennedy Elementary Exterior', caption: 'Exterior Rendering' },
          { src: '/images/projects/X25RB08-modulizer1/Courtyard_Final.jpg', alt: 'Kennedy Elementary Courtyard', caption: 'Courtyard View' },
          { src: '/images/projects/X25RB08-modulizer1/Kenedy Library 2 Final.png', alt: 'Kennedy Elementary Library', caption: 'Library Interior' },
        ],
        columns: 3,
      },
    },
    {
      type: 'text-content',
      id: 'casestudy-intro',
      data: {
        content: `**Project:** Kennedy Elementary
**Focus:** SD/DD interventions focusing on reducing heat gain, glare, and improving seasonal daylighting

Applying the lessons learned from COTE award-winning precedents, this case study demonstrates how early-stage energy modeling can directly inform design decisions. Using Sefaira, we conducted iterative daylight and glare analysis to identify problem areas and test solutions before construction.`,
      },
    },
    {
      type: 'text-content',
      id: 'casestudy-methodology',
      title: 'Methodology',
      data: {
        content: `**Simulation Schedule:**
Heat maps were generated at three critical times of day (9am, 12pm, 5pm) across all four seasons (Spring, Summer, Fall, Winter) to capture the full range of solar conditions the building will experience.

**Areas of Focus:**
- South-facing collaboration spaces and classrooms
- North-facing collaboration spaces and classrooms
- Central library and common spaces

**Analysis Parameters:**
- Illuminance levels (footcandles)
- Glare potential
- Solar heat gain
- Visible Light Transmittance (VLT) performance`,
      },
    },
    {
      type: 'text-content',
      id: 'casestudy-problem',
      title: 'Problem Identification',
      data: {
        content: `The base model simulation revealed several issues requiring intervention:

**Overlit Spaces:** Collaboration areas showed footcandle readings in the 75+ fc range - well above the 30-50 fc target for educational spaces. This indicated potential glare issues and excessive solar heat gain.

**Seasonal Variability:** Significant illuminance swings were observed between seasons, with summer conditions creating the most extreme overlit conditions.

**Insufficient Shading:** Despite deep overhangs in the initial design, the glazing choices allowed too much direct sunlight penetration, particularly on south-facing facades.`,
      },
    },
    {
      type: 'workflow-steps',
      id: 'casestudy-workflow',
      title: 'Design Process Phases',
      data: {
        steps: [
          {
            number: 1,
            title: 'Base Model Analysis',
            status: 'complete',
            findings: [
              'Collaboration spaces rendered overlit (75+ fc range)',
              'Illuminance swings identified across seasons',
              'Deep overhangs insufficient for glazing choices',
            ],
          },
          {
            number: 2,
            title: 'Design Team Handoff',
            status: 'complete',
            deliverables: [
              'Illuminance heat maps',
              'Base EUI model',
              'Spatial analysis',
            ],
          },
          {
            number: 3,
            title: 'Iterative Refinement',
            status: 'complete',
            interventions: [
              { action: 'Decreased VLT by half in certain zones', impact: 'Reduced glare hotspots' },
              { action: 'Fine-tuned VLT reductions by 10% in others', impact: 'Balanced light distribution' },
              { action: 'Extended overhangs where impactful', impact: 'Target fc readings achieved' },
            ],
          },
          {
            number: 4,
            title: 'Revised Model Results',
            status: 'complete',
            outcomes: [
              'Glare zones cooled down',
              'Footcandle readings in target range',
              'Daylight distribution balanced across spaces',
            ],
          },
        ],
      },
    },
    {
      type: 'text-content',
      id: 'daylight-analysis-title',
      title: 'Daylight Analysis Results',
      data: {
        content: `The following analysis shows the June 21st 12pm daylight simulation comparing baseline conditions against iterative modifications including overhang extensions, VLT adjustments, and blind integration.`,
      },
    },
    {
      type: 'image-gallery',
      id: 'daylight-analysis-overview',
      data: {
        images: [
          { src: '/images/projects/X25RB08-modulizer1/Daylight analysis overview.jpg', alt: 'Daylight Analysis Overview', caption: 'Analysis Overview' },
          { src: '/images/projects/X25RB08-modulizer1/ANALYSIS CHART.jpg', alt: 'Analysis Chart', caption: 'Comparison Chart' },
        ],
        columns: 2,
      },
    },
    {
      type: 'image-gallery',
      id: 'daylight-iterations',
      data: {
        images: [
          { src: '/images/projects/X25RB08-modulizer1/June 21 12pm.png', alt: 'June 21 12pm Baseline', caption: 'Baseline - June 21 12pm' },
          { src: '/images/projects/X25RB08-modulizer1/June 21 12pm_mod overhang.png', alt: 'Modified Overhang', caption: 'Modified Overhang' },
          { src: '/images/projects/X25RB08-modulizer1/June 21 12pm_mod VLT.png', alt: 'Modified VLT', caption: 'Modified VLT' },
          { src: '/images/projects/X25RB08-modulizer1/June 21 12pm_mod VLT + blinds.png', alt: 'Modified VLT + Blinds', caption: 'Modified VLT + Blinds' },
        ],
        columns: 4,
      },
    },
    {
      type: 'text-content',
      id: 'daylight-results',
      title: 'Intervention Results',
      data: {
        content: `**Iteration 1 - Modified Overhang:**
Extended overhangs in problematic areas reduced direct solar penetration but did not fully address glare in collaboration spaces.

**Iteration 2 - Modified VLT:**
Decreased Visible Light Transmittance by 50% in high-glare zones and 10% in moderate zones. This significantly reduced footcandle readings while maintaining adequate daylight levels.

**Iteration 3 - VLT + Blinds Integration:**
Combined VLT modifications with automated blind systems for dynamic response to changing solar conditions. This achieved target footcandle readings (30-50 fc) across all analyzed spaces.

**Key Takeaway:** A layered approach combining passive strategies (overhangs, glazing selection) with active systems (automated blinds) provided the most effective solution for balancing daylight quality with glare control.`,
      },
    },

    // Conclusions Section
    {
      type: 'section',
      id: 'section-conclusions',
      data: { title: 'Conclusions' },
    },
    {
      type: 'text-content',
      id: 'conclusions-main',
      data: {
        content: `**Main Finding:** Thoughtful, data-backed design makes a measurable difference in sustainable school performance.

**Key Points:**
1. Strategic orientation, solar-responsive envelopes, and smart massing directly translate to lower energy use
2. Performance modeling cannot be an afterthought - must be integrated early
3. Iterative simulation data guides real decisions on shading, window placement, and materials
4. Establishes repeatable methodology for future Pfluger projects

**Next Phase:** Phase 2 will test massing iterations, quantify facade performance, and advance cross-disciplinary collaboration

**Future Projects:** Cornerstone, Flour Bluff CTE`,
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
          { id: 1, title: 'Sefaira Projects', author: 'Trimble SketchUp', url: 'https://sefaira.sketchup.com/page/projects' },
          { id: 2, title: 'Autodesk Forma', author: 'Autodesk', url: 'https://app.autodeskforma.com' },
          { id: 3, title: 'Climate Studio', author: 'Solemma LLC', url: 'https://www.solemma.com/climatestudio' },
          { id: 4, title: 'Alice West Fleet Elementary School - AIA Design Excellence', author: 'AIA', url: 'https://www.aia.org/design-excellence/award-winners/alice-west-fleet-elementary-school' },
          { id: 5, title: 'Alice West Fleet Elementary School', author: 'VMDO Architects', url: 'https://www.vmdo.com/alice-west-fleet-elementary-school.html' },
          { id: 6, title: 'John Lewis Elementary School - AIA COTE', author: 'AIA', url: 'https://aia.secure-platform.com/a/gallery/rounds/723/details/59121' },
          { id: 7, title: 'John Lewis Elementary School', author: 'Perkins Eastman', url: 'https://www.perkinseastman.com/projects/john-lewis-elementary-school/' },
          { id: 8, title: 'Coliseum Place - AIA COTE', author: 'AIA', url: 'https://aia.secure-platform.com/a/gallery/rounds/723/details/61183' },
          { id: 9, title: 'Coliseum Place', author: 'David Baker Architects', url: 'https://www.dbarchitect.com/projects/coliseum-place' },
          { id: 10, title: 'John W. Olver Transit Center - AIA Design Excellence', author: 'AIA', url: 'https://www.aia.org/design-excellence/award-winners/john-w-olver-transit-center' },
          { id: 11, title: 'John W. Olver Transit Center', author: 'Charles Rose Architects', url: 'https://www.charlesrosearchitects.com/projects/john-w-olver-transit-center/' },
          { id: 12, title: 'Westwood Hills Nature Center - AIA Design Excellence', author: 'AIA', url: 'https://www.aia.org/design-excellence/award-winners/westwood-hills-nature-center' },
          { id: 13, title: 'Westwood Hills Nature Center', author: 'HGA', url: 'https://hga.com/projects/westwood-hills-nature-center/' },
        ],
      },
    },
  ],
};
