// Block System Types

export interface ProjectConfig {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  category: string;
  researcher: string;
  totalHours: number;
  accentColor: string;
  blocks: BlockConfig[];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  blocks: BlockConfig[];
}

export interface BlockConfig {
  type: BlockType;
  id: string;
  title?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export type BlockType =
  | 'section'
  | 'stat-grid'
  | 'bar-chart'
  | 'donut-chart'
  | 'line-chart'
  | 'comparison-table'
  | 'image-gallery'
  | 'text-content'
  | 'timeline'
  | 'key-findings'
  | 'sources'
  | 'tool-comparison'
  | 'case-study-card'
  | 'workflow-steps'
  | 'scenario-bar-chart'
  | 'cost-builder'
  | 'survey-rating'
  | 'feedback-summary'
  | 'quotes'
  | 'activity-rings'
  | 'product-options';

export interface SectionData {
  title: string;
  sources?: number[];
}

// Data shapes for each block type

export interface StatItem {
  label: string;
  value: string;
  detail?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface StatGridData {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartBar {
  title: string;
  items: BarChartItem[];
}

export interface BarChartGroup {
  label: string;
  color?: string;
  items: BarChartItem[];
}

export interface BarChartGroupedBar {
  title: string;
  groups: BarChartGroup[];
}

export interface BarChartData {
  // Single bar mode (backwards compatible)
  items?: BarChartItem[];
  // Multi-bar mode
  bars?: BarChartBar[];
  // Grouped mode - collapses into groups, expands on hover
  groups?: BarChartGroup[];
  // Multi-bar grouped mode - multiple bars, each with groups
  groupedBars?: BarChartGroupedBar[];
  unit?: string;
  showValues?: boolean;
  legendPosition?: 'inline' | 'end' | 'none';
}

export interface DonutChartData {
  segments: { label: string; value: number; color: string }[];
  total?: number;
  centerLabel?: string;
}

export interface ComparisonRow {
  label: string;
  values: (string | number)[];
  highlight?: boolean;
}

export interface ComparisonTableData {
  headers: string[];
  rows: ComparisonRow[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageGalleryData {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

export interface TextContentData {
  content: string; // markdown supported
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  status: 'complete' | 'in-progress' | 'pending';
}

export interface TimelineData {
  events: TimelineEvent[];
  // Optional project events to show below the timeline
  projectEvents?: Array<{
    date: string;
    title: string;
  }>;
  // Workload intensity - thickness of timeline
  workload?: Array<{
    date: string;
    hours: number;
  }>;
  // Layout mode
  layout?: 'vertical' | 'horizontal';
}

export interface KeyFinding {
  title: string;
  value: string;
  detail: string;
  icon?: string;
}

export interface KeyFindingsData {
  findings: KeyFinding[];
}

export interface Source {
  id: number;
  title: string;
  author?: string;
  url?: string;
}

export interface SourcesData {
  sources: Source[];
}

// Tool Comparison Block
export interface Tool {
  name: string;
  rating: number; // 0-100 for ring fill
  color: string;
  price: string;
  category: string;
  description?: string;
  pros?: string[];
  cons?: string[];
}

export interface ToolComparisonData {
  tools: Tool[];
  columns?: 2 | 3 | 4;
}

// Case Study Card Block
export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  tags: string[];
  description: string;
  metrics?: { label: string; value: string }[];
  strategies?: { name: string; description?: string; impact: string }[];
  awards?: string[];
  // Extended fields
  location?: string;
  architect?: string;
  year?: number;
  siteArea?: string;
  conditionedArea?: string;
  stories?: number;
  buildingType?: string[];
  team?: { role: string; company: string }[];
}

export interface CaseStudyCardData {
  studies: CaseStudy[];
  columns?: 2 | 3;
}

// Workflow Steps Block
export interface WorkflowStep {
  number: number;
  title: string;
  status: 'complete' | 'active' | 'pending';
  findings?: string[];
  deliverables?: string[];
  interventions?: { action: string; impact: string }[];
  outcomes?: string[];
}

export interface WorkflowStepsData {
  steps: WorkflowStep[];
}

// Scenario Bar Chart Block - for cost scenario comparisons
export interface ScenarioItem {
  name: string;
  total: number;
  costPerSF: number;
}

export interface ScenarioBarChartData {
  scenarios: ScenarioItem[];
  baseTotal: number;
  unit?: string;
}

// Cost Builder Block - interactive alternate selector
export interface CostAlternate {
  id: number;
  description: string;
  amount: number;
  type: 'add' | 'deduct';
}

export interface CostBuilderData {
  alternates: CostAlternate[];
  baseTotal: number;
  area: number;
}

// Survey Rating Block - for displaying 1-5 rating distributions
export interface RatingDistribution {
  rating: number; // 1-5
  count: number;
  label?: string; // e.g., "Very Excited", "Somewhat Displeased"
}

export interface SurveyRatingData {
  title: string;
  totalResponses: number;
  ratings: RatingDistribution[];
  averageRating?: number;
  color?: string;
}

// Feedback Summary Block - yay/nay themes with activity rings
export interface FeedbackTheme {
  theme: string;
  mentions: number;
  description?: string;
}

export interface FeedbackSummaryData {
  positives: {
    title?: string;
    score: number; // 0-100 for activity ring
    themes: FeedbackTheme[];
  };
  concerns: {
    title?: string;
    score: number; // 0-100 for activity ring
    themes: FeedbackTheme[];
  };
}

// Quotes Block - survey testimonials/quotes
export interface Quote {
  text: string;
  source?: string; // e.g., "Page 16"
  rating?: number; // 1-5
  author?: string;
}

export interface QuotesData {
  quotes: Quote[];
  columns?: 1 | 2 | 3;
}

// Activity Rings Block - Apple-style concentric rings in a grid
export interface ActivityRing {
  name: string;
  value: number; // 0-100 for fill percentage
  color: string;
}

export interface ActivityRingsItem {
  title: string;
  subtitle?: string;
  centerValue: string;
  centerLabel?: string;
  rings: ActivityRing[]; // up to 3 rings
}

export interface ActivityRingsGroup {
  vendor: string;
  color: string;
  items: ActivityRingsItem[];
}

export interface ActivityRingsData {
  groups: ActivityRingsGroup[];
  columns?: 2 | 3 | 4;
}

// Product Options Block - Compare products within a line
export interface ProductOption {
  name: string;
  price: number;
  color: string;
  specs?: { label: string; value: string }[];
  costs?: { label: string; value: number; color: string }[]; // Cost breakdown percentages
}

export interface ProductLine {
  name: string;
  subtitle?: string;
  image?: string;
  options: ProductOption[];
}

export interface ProductOptionsData {
  lines: ProductLine[];
  columns?: 2 | 3 | 4;
  showSpecs?: boolean;
}
