import type { ProjectConfig } from '../../../../components/blocks/types';

export const timberlyneConfig: ProjectConfig = {
  id: 'X25-RB06',
  title: 'Timberlyne Study',
  code: 'X25-RB06',
  subtitle: 'Mass Engineered Timber Design Assist',
  category: 'sustainability',
  researcher: 'Alex Wickes',
  totalHours: 20,
  accentColor: '#67823A',

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
        content: `This study documents insights from Timberlyne's design assist process for mass engineered timber (MET) construction.

**Meeting Date:** May 27, 2025

**Key Topics:**
- Design Assist workflow with open specifications
- Project estimates comparing MET vs steel systems
- Maintenance services and scope considerations`,
      },
    },

    // About Timberlyne
    {
      type: 'section',
      id: 'section-about-timberlyne',
      data: { title: 'About Timberlyne', sources: [6, 7] },
    },
    {
      type: 'text-content',
      id: 'about-timberlyne-text',
      data: {
        content: `Timberlyne has been prefabricating timber solutions since 1987, unifying Texas Timber Frames, Sand Creek Post & Beam, and Barn Kings into a single brand.

**Facilities:**
- **Boerne, Texas:** 42,500 SF facility housing the first Hundegger RobotMax - the largest CNC machine in North America
- **Wayne, Nebraska:** Additional manufacturing and showroom facilities
- Combined 125,000 SF of manufacturing capacity

**Capabilities:**
- Metal-plated post and beam construction
- True mortise and tenon joinery
- Mass timber structures (CLT, Glulam)
- Design-assist services for commercial projects

**Notable Project:** San Antonio Spurs training facility - the largest mass timber constructed training facility in U.S. professional sports.`,
      },
    },
    {
      type: 'stat-grid',
      id: 'timberlyne-stats',
      data: {
        stats: [
          { label: 'Founded', value: '1987', detail: '35+ years of timber expertise' },
          { label: 'Manufacturing', value: '125,000 SF', detail: 'Combined facility space' },
          { label: 'CNC Capability', value: 'RobotMax', detail: 'Largest in North America' },
          { label: 'Locations', value: '2', detail: 'Texas and Nebraska' },
        ],
        columns: 4,
      },
    },

    // Design Assist Process
    {
      type: 'section',
      id: 'section-process',
      data: { title: 'Design Assist Process', sources: [1] },
    },
    {
      type: 'text-content',
      id: 'process-text',
      data: {
        content: `**How Design Assist Works with Open Spec:**
- Get a set of drawings and bid the scope
- Work with structural engineer on overall design
- Timberlyne handles connections
- Number of hours and scope determined collaboratively

**Project Workflow:**
- Timberlyne would be sub to GC
- Only provide MET scope
- Only do full MET package
- Can do precon services
- Can provide MET estimates (GC prices alternative design)`,
      },
    },
    {
      type: 'image-gallery',
      id: 'process-images',
      data: {
        images: [
          { src: '/images/projects/X25RB06-timberlyne/WetlandMET1.jpg', alt: 'Wetland MET View 1', caption: 'Dock Structure' },
          { src: '/images/projects/X25RB06-timberlyne/WetlandMET2.jpg', alt: 'Wetland MET View 2', caption: 'Timber Details' },
          { src: '/images/projects/X25RB06-timberlyne/WetlandMET3.jpg', alt: 'Wetland MET View 3', caption: 'Connection Details' },
        ],
        columns: 3,
      },
    },

    // Technical Considerations
    {
      type: 'section',
      id: 'section-technical',
      data: { title: 'Technical Considerations', sources: [1, 2] },
    },
    {
      type: 'text-content',
      id: 'technical-text',
      data: {
        content: `**Structural Requirements:**
- EOR needs to figure out moment frames
- Need diaphragm on roof
- Consider two learning walls

**Material & Finishing:**
- TG ply, bulk paper and metal panel would need waterproofing
- Glulam can be PT (pressure treated) and coated with Sansin
- Solid timber has to be treated
- Consider flip orientation and slope

**Maintenance:**
- Maintenance services are built into original scope of work
- Would defer to Sansin for reapplication`,
      },
    },

    // Next Steps
    {
      type: 'section',
      id: 'section-next',
      data: { title: 'Next Steps', sources: [1] },
    },
    {
      type: 'text-content',
      id: 'next-text',
      data: {
        content: `**Action Items:**
- Timberlyne would need additional contact for follow-up
- Coordinate with structural engineer on moment frame design
- Evaluate MET vs steel cost comparison
- Determine waterproofing requirements for exposed elements`,
      },
    },

    // Industry Case Studies Section
    {
      type: 'section',
      id: 'section-case-studies',
      data: { title: 'Industry Case Studies', sources: [3, 4, 5, 8, 9, 10, 11, 12] },
    },
    {
      type: 'text-content',
      id: 'case-studies-intro',
      data: {
        content: `The following case studies highlight major mass timber developments in the United States, demonstrating the growing adoption of CLT and Glulam construction at scale.`,
      },
    },
    {
      type: 'case-study-card',
      id: 'case-studies-grid',
      data: {
        studies: [
          {
            id: 'walmart-home-office',
            title: 'Walmart Home Office',
            subtitle: 'Largest Mass Timber Corporate Campus in the U.S.',
            tags: ['Corporate Campus', 'CLT', 'Glulam', 'LEED Platinum'],
            description: 'Walmart\'s new Home Office in Bentonville, Arkansas represents the largest mass timber corporate campus in the United States. The 350-acre campus comprises more than 30 buildings organized into four distinct "neighborhood" quads, utilizing 1.7 million cubic feet of regionally-sourced lumber.',
            location: 'Bentonville, Arkansas',
            architect: 'Gensler (Design Architect)',
            year: 2025,
            metrics: [
              { label: 'Office Space', value: '2.4M SF' },
              { label: 'Timber Volume', value: '1.7M CF' },
              { label: 'Campus Size', value: '350 acres' },
            ],
            buildingType: [
              'Zone 1: Four hybrid mass timber buildings (4 stories) - 897,500 SF',
              'Zone 3: Full mass timber frame (5 stories) - 332,615 SF',
              '30+ total buildings including offices, parking, and amenities',
            ],
            team: [
              { role: 'Design Architect', company: 'Gensler' },
              { role: 'Structural Engineer', company: 'Fast + Epp' },
              { role: 'Landscape Architect', company: 'SWA Group' },
              { role: 'Timber Supplier', company: 'Mercer Mass Timber' },
            ],
            strategies: [
              { name: 'Hybrid Mass Timber', description: 'Zone 1 combines mass timber with conventional materials for parking integration', impact: 'Scalable approach' },
              { name: 'Full Mass Timber Frame', description: 'Zone 3 demonstrates complete MET construction at scale', impact: 'Maximum timber benefit' },
              { name: 'Neighborhood Planning', description: 'Four distinct quads shaped by site configuration and land typology', impact: '15,000 employees' },
            ],
            awards: ['LEED Platinum (targeting)'],
          },
          {
            id: 'adohi-hall',
            title: 'Adohi Hall',
            subtitle: 'First Large-Scale Mass Timber Student Housing in the U.S.',
            tags: ['Educational', 'Student Housing', 'CLT', 'Glulam'],
            description: 'Named for the Cherokee word meaning "coming into the forest," Adohi Hall at the University of Arkansas is a 708-bed sustainable residence hall and living-learning community. It was the largest mass timber building in North America at the time of completion.',
            location: 'Fayetteville, Arkansas',
            architect: 'Leers Weinzapfel Associates',
            year: 2020,
            metrics: [
              { label: 'Building Size', value: '202,000 SF' },
              { label: 'Student Beds', value: '708' },
              { label: 'Cost', value: '$79M' },
            ],
            buildingType: [
              '5 stories of mass timber over concrete podium',
              'CLT floor and ceiling system',
              'Glulam columns and beams',
              '100% exposed mass timber interiors',
            ],
            team: [
              { role: 'Lead Architect', company: 'Leers Weinzapfel Associates' },
              { role: 'Local Architect', company: 'Modus Studio' },
              { role: 'Interior Design', company: 'Mackey Mitchell Architects' },
              { role: 'Contractor', company: 'Nabholz' },
            ],
            strategies: [
              { name: 'Carbon Sequestration', description: 'Mass timber stores equivalent of 3,197 metric tons of CO2', impact: '948 cars off road' },
              { name: 'Energy Efficiency', description: 'Designed to use 42% less energy than comparable buildings', impact: '42% reduction' },
              { name: 'Cultural Connection', description: 'Named in consultation with Cherokee Nation, honoring Trail of Tears history', impact: 'Community respect' },
            ],
            awards: [
              'AIA National Housing Award 2021',
              'WoodWorks Multi-Family Wood Design Award 2020',
              'WAN Awards Wood in Architecture Gold 2020',
            ],
          },
          {
            id: 'mercer-structurlam',
            title: 'Mercer Mass Timber (formerly Structurlam)',
            subtitle: 'U.S. Mass Timber Manufacturing Hub',
            tags: ['Manufacturing', 'CLT', 'Glulam', 'Arkansas'],
            description: 'Structurlam selected Conway, Arkansas for its first U.S. manufacturing plant in 2019. With 19 million acres of available forestland and a skilled workforce, Arkansas became the natural choice for expansion. Mercer International acquired the facility in 2023 for $81.1 million.',
            location: 'Conway, Arkansas',
            year: 2019,
            metrics: [
              { label: 'Acquisition', value: '$81.1M' },
              { label: 'Forestland', value: '19M acres' },
              { label: 'Sale Closed', value: 'June 2023' },
            ],
            buildingType: [
              'CLT Production Facility',
              'Glulam Manufacturing',
              'First U.S. plant for Structurlam',
            ],
            strategies: [
              { name: 'Regional Timber Supply', description: 'Arkansas-grown and Arkansas-produced mass timber', impact: 'Local sourcing' },
              { name: 'First Customer Partnership', description: 'Walmart partnership secured before facility opened', impact: 'Guaranteed demand' },
              { name: 'Supply Chain', description: 'Directly catalyzed by Adohi Hall and Walmart projects', impact: 'Regional ecosystem' },
            ],
          },
        ],
        columns: 2,
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
          { id: 1, title: 'Timberlyne Design Assist Meeting Notes', author: 'May 27, 2025' },
          { id: 2, title: 'Sansin Wood Care Products', author: 'Sansin Corporation' },
          { id: 3, title: 'Structurlam Selects Conway, Arkansas for First U.S. Plant', author: 'Arkansas Economic Development Commission', url: 'https://www.arkansasedc.com/news-events/newsroom/detail/2019/12/09/structurlam-selects-conway-arkansas-for-its-first-u.s.-plant' },
          { id: 4, title: 'Production Resumes at Shuttered Structurlam Plant', author: 'Woodworking Network', url: 'https://www.woodworkingnetwork.com/news/canadian-news/production-resumes-shuttered-structurlam-plant' },
          { id: 5, title: 'Walmart Home Office Installs Mercer CLT, Glulam', author: 'Panel World Magazine', url: 'https://www.panelworldmag.com/walmart-home-office-installs-mercer-clt-glulam/' },
          { id: 6, title: 'Timberlyne Commercial Experience', author: 'Timberlyne', url: 'https://www.timberlynecommercial.com/facilities' },
          { id: 7, title: 'Timberlyne and Hundegger Commission Most Advanced Robotic Mass Timber Machine', author: 'Craig Rawlings, LinkedIn', url: 'https://www.linkedin.com/pulse/timberlyne-hundegger-commission-most-advanced-robotic-craig-rawlings' },
          { id: 8, title: 'Walmart Home Office Projects', author: 'Gensler', url: 'https://www.gensler.com/projects/walmart-home-office' },
          { id: 9, title: 'Gensler Uses Mass Timber at Unprecedented Scale for Walmart HQ', author: 'Dezeen', url: 'https://www.dezeen.com/2025/01/21/walmart-mass-timber-arkansas-hq-gensler-swa/' },
          { id: 10, title: 'Adohi Hall', author: 'Modus Studio', url: 'https://www.modusstudio.com/projects/adohi-hall' },
          { id: 11, title: 'Adohi Hall - WoodWorks Case Study', author: 'WoodWorks', url: 'https://www.woodworks.org/award-gallery/adohi-hall/' },
          { id: 12, title: 'Timber Abounds at University of Arkansas Adohi Hall', author: 'Architect Magazine', url: 'https://www.architectmagazine.com/technology/architectural-detail/timber-abounds-at-the-university-of-arkansas-adohi-hall_o' },
        ],
      },
    },
  ],
};
