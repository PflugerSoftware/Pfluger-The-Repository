import { lazy, Suspense } from 'react';
import type { BlockConfig, StatGridData, BarChartData, KeyFindingsData, ComparisonTableData, TimelineData, TextContentData, SectionData, ImageGalleryData, SourcesData, ToolComparisonData, CaseStudyCardData, WorkflowStepsData, DonutChartData, ScenarioBarChartData, CostBuilderData, SurveyRatingData, FeedbackSummaryData, QuotesData, ActivityRingsData, ProductOptionsData } from './types';

// Lazy load all block components - each project dashboard only loads what it uses
const StatGridBlock = lazy(() => import('./StatGridBlock').then(m => ({ default: m.StatGridBlock })));
const BarChartBlock = lazy(() => import('./BarChartBlock').then(m => ({ default: m.BarChartBlock })));
const KeyFindingsBlock = lazy(() => import('./KeyFindingsBlock').then(m => ({ default: m.KeyFindingsBlock })));
const ComparisonTableBlock = lazy(() => import('./ComparisonTableBlock').then(m => ({ default: m.ComparisonTableBlock })));
const TimelineBlock = lazy(() => import('./TimelineBlock').then(m => ({ default: m.TimelineBlock })));
const TextContentBlock = lazy(() => import('./TextContentBlock').then(m => ({ default: m.TextContentBlock })));
const SectionBlock = lazy(() => import('./SectionBlock').then(m => ({ default: m.SectionBlock })));
const ImageGalleryBlock = lazy(() => import('./ImageGalleryBlock').then(m => ({ default: m.ImageGalleryBlock })));
const SourcesBlock = lazy(() => import('./SourcesBlock').then(m => ({ default: m.SourcesBlock })));
const ToolComparisonBlock = lazy(() => import('./ToolComparisonBlock').then(m => ({ default: m.ToolComparisonBlock })));
const CaseStudyCardBlock = lazy(() => import('./CaseStudyCardBlock').then(m => ({ default: m.CaseStudyCardBlock })));
const WorkflowStepsBlock = lazy(() => import('./WorkflowStepsBlock').then(m => ({ default: m.WorkflowStepsBlock })));
const DonutChartBlock = lazy(() => import('./DonutChartBlock').then(m => ({ default: m.DonutChartBlock })));
const ScenarioBarChartBlock = lazy(() => import('./ScenarioBarChartBlock').then(m => ({ default: m.ScenarioBarChartBlock })));
const CostBuilderBlock = lazy(() => import('./CostBuilderBlock').then(m => ({ default: m.CostBuilderBlock })));
const SurveyRatingBlock = lazy(() => import('./SurveyRatingBlock').then(m => ({ default: m.SurveyRatingBlock })));
const FeedbackSummaryBlock = lazy(() => import('./FeedbackSummaryBlock').then(m => ({ default: m.FeedbackSummaryBlock })));
const QuotesBlock = lazy(() => import('./QuotesBlock').then(m => ({ default: m.QuotesBlock })));
const ActivityRingsBlock = lazy(() => import('./ActivityRingsBlock').then(m => ({ default: m.ActivityRingsBlock })));
const ProductOptionsBlock = lazy(() => import('./ProductOptionsBlock').then(m => ({ default: m.ProductOptionsBlock })));

const BlockFallback = () => (
  <div className="h-24 bg-card/50 rounded-xl animate-pulse" />
);

interface BlockRendererProps {
  block: BlockConfig;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { type, title, description, data } = block;

  const renderBlock = () => {
    switch (type) {
      case 'section':
        return <SectionBlock data={data as SectionData} />;
      case 'stat-grid':
        return <StatGridBlock data={data as StatGridData} />;
      case 'bar-chart':
        return <BarChartBlock data={data as BarChartData} />;
      case 'key-findings':
        return <KeyFindingsBlock data={data as KeyFindingsData} />;
      case 'comparison-table':
        return <ComparisonTableBlock data={data as ComparisonTableData} />;
      case 'timeline':
        return <TimelineBlock data={data as TimelineData} />;
      case 'text-content':
        return <TextContentBlock data={data as TextContentData} />;
      case 'image-gallery':
        return <ImageGalleryBlock data={data as ImageGalleryData} />;
      case 'sources':
        return <SourcesBlock data={data as SourcesData} />;
      case 'tool-comparison':
        return <ToolComparisonBlock data={data as ToolComparisonData} />;
      case 'case-study-card':
        return <CaseStudyCardBlock data={data as CaseStudyCardData} />;
      case 'workflow-steps':
        return <WorkflowStepsBlock data={data as WorkflowStepsData} />;
      case 'donut-chart':
        return <DonutChartBlock data={data as DonutChartData} />;
      case 'scenario-bar-chart':
        return <ScenarioBarChartBlock data={data as ScenarioBarChartData} />;
      case 'cost-builder':
        return <CostBuilderBlock data={data as CostBuilderData} />;
      case 'survey-rating':
        return <SurveyRatingBlock data={data as SurveyRatingData} />;
      case 'feedback-summary':
        return <FeedbackSummaryBlock data={data as FeedbackSummaryData} />;
      case 'quotes':
        return <QuotesBlock data={data as QuotesData} />;
      case 'activity-rings':
        return <ActivityRingsBlock data={data as ActivityRingsData} />;
      case 'product-options':
        return <ProductOptionsBlock data={data as ProductOptionsData} />;
      default:
        return (
          <div className="p-4 bg-card border border-card rounded-xl text-gray-400 text-sm">
            Unknown block type: {type}
          </div>
        );
    }
  };

  // Section and image-gallery blocks don't need wrapper (handled by parent)
  if (type === 'section' || type === 'image-gallery') {
    return (
      <Suspense fallback={<BlockFallback />}>
        {renderBlock()}
      </Suspense>
    );
  }

  return (
    <div className="mb-8">
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
          {description && <p className="text-gray-500">{description}</p>}
        </div>
      )}
      <Suspense fallback={<BlockFallback />}>
        {renderBlock()}
      </Suspense>
    </div>
  );
}
