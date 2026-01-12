// Modelizer Phase 1 (X25-RB08) Data
// Kennedy Elementary - Tools Comparison, Precedent Analysis, Case Study

export interface ProjectInfo {
  name: string;
  subtitle: string;
  code: string;
  context: string;
  researchType: string;
  totalHours: number;
  researcher: string;
}

export interface EnergyTool {
  id: string;
  name: string;
  platform: string;
  pricing: string;
  evaluationTools: string[];
  pros: string[];
  cons: string[];
  rating: number;
  bestFor: string;
  color: string;
}

export interface Strategy {
  name: string;
  description: string;
  impact: string;
}

export interface ProjectMetrics {
  eui?: number;
  pvArray?: string;
  wasteDiv?: string;
  renewable?: string;
  carbonReduction?: string;
  waterReduction?: string;
  poeScore?: number;
}

export interface PrecedentProject {
  id: string;
  name: string;
  location: string;
  architect: string;
  year: number;
  size: string;
  stories?: number;
  type?: string;
  awards?: string[];
  strategies?: Strategy[];
  features?: string[];
  metrics?: ProjectMetrics;
  color: string;
}

export interface StudyIntervention {
  action: string;
  impact: string;
}

export interface StudyPhase {
  name: string;
  description: string;
  findings?: string[];
  deliverables?: string[];
  interventions?: StudyIntervention[];
  outcomes?: string[];
}

export interface KennedyStudy {
  name: string;
  description: string;
  phases: StudyPhase[];
  seasons: string[];
  times: string[];
}

export interface KeyStrategy {
  name: string;
  description: string;
  impact: string;
  icon: string;
}

export interface Conclusions {
  mainFinding: string;
  keyPoints: string[];
  nextPhase: string;
  futureProjects: string[];
}

// Data exports

export const projectInfo: ProjectInfo = {
  name: "The Modelizer Phase 1",
  subtitle: "Defining the Shape",
  code: "X25-RB08",
  context: "Kennedy Elementary",
  researchType: "Mid-Level: Literature Review",
  totalHours: 60,
  researcher: "Agustin Salinas",
};

export const energyTools: EnergyTool[] = [
  {
    id: "sefaira",
    name: "Sefaira",
    platform: "SketchUp Extension + Web App",
    pricing: "$1,995/year/floating license",
    evaluationTools: ["Energy", "Daylight", "Envelope", "Photovoltaics"],
    pros: [
      "Useful for PD, SD, & DD stages",
      "SketchUp extension is easy to use",
      "Web app provides detailed comparison options",
      "No extensive information input required",
    ],
    cons: [
      "Extension can fail and requires reboot",
      "Cannot customize wall construction separately",
      "EUI analysis limited in extension vs web app",
      "Basic SketchUp skills required",
    ],
    rating: 4.2,
    bestFor: "Early & mid-stage analysis",
    color: "#3b82f6",
  },
  {
    id: "forma",
    name: "Autodesk Forma",
    platform: "Web-based",
    pricing: "$1,550/year/multi-user",
    evaluationTools: ["Daylight", "Wind", "Temperature", "Noise", "Solar Energy", "Embodied Carbon", "Shadow Study"],
    pros: [
      "Wide range of site design evaluation tools",
      "Already part of Pfluger's software suite",
      "Good for site-level assessments",
    ],
    cons: [
      "Does not offer energy modeling",
      "Lacks building-level analysis",
    ],
    rating: 3.5,
    bestFor: "Site-based assessments",
    color: "#f59e0b",
  },
  {
    id: "climatestudio",
    name: "Climate Studio",
    platform: "Rhino Extension",
    pricing: "$2,500/year/floating or $200/month",
    evaluationTools: ["Energy", "Daylighting", "Climate", "Sun Path", "Glare", "Natural Ventilation", "Renewable Energy"],
    pros: [
      "Detailed results for DD and CD stages",
      "Comprehensive evaluation tools",
      "More accurate than Sefaira for final validation",
    ],
    cons: [
      "Requires intermediate Rhino skills",
      "Higher cost than alternatives",
    ],
    rating: 4.5,
    bestFor: "DD & CD detailed analysis",
    color: "#10b981",
  },
  {
    id: "ladybug",
    name: "Ladybug / Honeybee",
    platform: "Grasshopper (Rhino)",
    pricing: "Free",
    evaluationTools: ["Energy", "Daylighting", "Climate", "Sun Path", "Glare", "Natural Ventilation", "Renewable Energy"],
    pros: [
      "Can be used across all phases",
      "Fully customizable tools",
      "Free and open source",
      "Large community support",
    ],
    cons: [
      "Complex customization required",
      "Requires knowledge of sustainable practices",
      "Parametric modeling skills needed",
    ],
    rating: 4.0,
    bestFor: "All phases (with expertise)",
    color: "#8b5cf6",
  },
];

export const precedentProjects: PrecedentProject[] = [
  {
    id: "fleet",
    name: "Alice West Fleet Elementary",
    location: "Arlington, Virginia",
    architect: "VMDO Architects",
    year: 2022,
    size: "111,634 SF",
    stories: 6,
    awards: ["AIA COTE Top Ten 2024"],
    strategies: [
      {
        name: "Roof Plane Optimization",
        description: "Roofs designed to avoid self-shading, maximizing PV collection",
        impact: "Increased solar energy capture",
      },
      {
        name: "Massing Optimization",
        description: "Y-shaped massing with deep overhangs on mass timber arm",
        impact: "Shade production on less-than-ideal orientations",
      },
      {
        name: "Glazing Optimization",
        description: "Each elevation fine-tuned for maximum daylight with minimal heat gain",
        impact: "NW classrooms pushed out for north-facing glass",
      },
    ],
    features: ["Added insulation", "Operable windows", "Geothermal energy"],
    color: "#6366f1",
  },
  {
    id: "lewis",
    name: "John Lewis Elementary",
    location: "Washington, D.C.",
    architect: "Perkins Eastman",
    year: 2021,
    size: "88,588 SF",
    stories: 2,
    awards: ["AIA COTE Top Ten 2025", "2023 American Architecture Award", "Planet Positive Award"],
    strategies: [
      {
        name: "90° Rotation",
        description: "Flipped and rotated building to orient along east-west axis",
        impact: "9% reduction in energy consumption",
      },
    ],
    features: ["PV Panels on roof", "Geothermal well field"],
    color: "#10b981",
  },
  {
    id: "coliseum",
    name: "Coliseum Place",
    location: "Oakland, California",
    architect: "David Baker Architects",
    year: 2021,
    size: "71,512 SF",
    type: "Affordable Housing",
    awards: ["AIA COTE"],
    strategies: [
      {
        name: "Simple Massing",
        description: "Simple massing combined with solar orientation response",
        impact: "Ambitious energy-consumption-reduction goals achieved",
      },
      {
        name: "Protective Solar Screen",
        description: "Solar screen along south façade",
        impact: "Reduced cooling loads",
      },
    ],
    metrics: {
      eui: 15,
      pvArray: "98 kW (100% common loads offset)",
      wasteDiv: "81%",
    },
    color: "#f59e0b",
  },
  {
    id: "transit",
    name: "John W. Olver Transit Center",
    location: "Greenfield, Massachusetts",
    architect: "Charles Rose Architects",
    year: 2014,
    size: "24,000 SF",
    type: "Civic/Cultural",
    awards: ["AIA COTE Top Ten"],
    strategies: [
      {
        name: "Cantilever Shading",
        description: "Second story cantilevers over waiting area using sunpath diagrams",
        impact: "Reduced summer solar heat gains",
      },
    ],
    metrics: {
      eui: 21.3,
      renewable: "100% from renewable sources",
      carbonReduction: "95.5%",
      waterReduction: "85%",
    },
    color: "#ef4444",
  },
  {
    id: "westwood",
    name: "Westwood Hills Nature Center",
    location: "St. Louis Park, Minnesota",
    architect: "HGA",
    year: 2020,
    size: "13,565 SF",
    type: "Nature Center",
    awards: ["AIA COTE Top Ten"],
    strategies: [
      {
        name: "Envelope Optimization",
        description: "Orientation and shading optimized for passive heating, cooling, and daylighting",
        impact: "100% zero energy achieved",
      },
    ],
    metrics: {
      renewable: "100% from renewable sources",
      carbonReduction: "100%",
      poeScore: 70,
    },
    features: ["Photovoltaic array", "Geothermal well field"],
    color: "#8b5cf6",
  },
];

export const kennedyStudy: KennedyStudy = {
  name: "Kennedy Elementary",
  description: "SD/DD interventions focusing on reducing heat gain, glare, and improving seasonal daylighting",
  phases: [
    {
      name: "Base Model Analysis",
      description: "Initial SD model with stock systems and Solarban 90 glazing baseline",
      findings: [
        "Collaboration spaces rendered overlit (75+ fc range)",
        "Illuminance swings identified across seasons",
        "Deep overhangs insufficient for glazing choices",
      ],
    },
    {
      name: "Design Team Handoff",
      description: "Heat maps delivered at 9am, 12pm, 5pm across all seasons",
      deliverables: ["Illuminance heat maps", "Base EUI model", "Spatial analysis"],
    },
    {
      name: "Iterative Refinement",
      description: "Surgical interventions based on simulation data",
      interventions: [
        { action: "Decreased VLT by half in certain zones", impact: "Reduced glare hotspots" },
        { action: "Fine-tuned VLT reductions by 10% in others", impact: "Balanced light distribution" },
        { action: "Extended overhangs where impactful", impact: "Footcandle readings in target range" },
      ],
    },
    {
      name: "Revised Model Results",
      description: "Well-calibrated learning environments achieved",
      outcomes: [
        "Glare zones cooled down",
        "Footcandle readings in target range",
        "Daylight distribution balanced across spaces",
      ],
    },
  ],
  seasons: ["Spring", "Summer", "Fall", "Winter"],
  times: ["9am", "12pm", "5pm"],
};

export const keyStrategies: KeyStrategy[] = [
  {
    name: "East-West Orientation",
    description: "Orient buildings along east-west axis to minimize solar exposure",
    impact: "Up to 9% energy reduction (John Lewis)",
    icon: "🧭",
  },
  {
    name: "Roof/Façade Optimization",
    description: "Design roof planes and façades to maximize PV and minimize self-shading",
    impact: "Increased renewable energy capture",
    icon: "☀️",
  },
  {
    name: "Glazing Fine-Tuning",
    description: "Customize glazing by orientation for daylight vs. heat gain balance",
    impact: "Reduced cooling loads, improved comfort",
    icon: "🪟",
  },
  {
    name: "Integrated PV Systems",
    description: "Include photovoltaic arrays in early massing decisions",
    impact: "100% renewable offset achievable",
    icon: "⚡",
  },
  {
    name: "Shading Solutions",
    description: "Deep overhangs, cantilevers, and solar screens for less-than-ideal orientations",
    impact: "Mitigated heat gain on problem façades",
    icon: "🏗️",
  },
];

export const conclusions: Conclusions = {
  mainFinding: "Thoughtful, data-backed design makes a measurable difference in sustainable school performance",
  keyPoints: [
    "Strategic orientation, solar-responsive envelopes, and smart massing directly translate to lower energy use",
    "Performance modeling cannot be an afterthought—must be integrated early",
    "Iterative simulation data guides real decisions on shading, window placement, and materials",
    "Establishes repeatable methodology for future Pfluger projects",
  ],
  nextPhase: "Phase 2 will test massing iterations, quantify façade performance, and advance cross-disciplinary collaboration",
  futureProjects: ["Cornerstone", "Flour Bluff CTE"],
};
