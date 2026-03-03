import { lazy, Suspense } from 'react';
import type { BlockConfig } from './types';

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
  const renderBlock = () => {
    switch (block.type) {
      case 'section':
        return <SectionBlock data={block.data} />;
      case 'stat-grid':
        return <StatGridBlock data={block.data} />;
      case 'bar-chart':
        return <BarChartBlock data={block.data} />;
      case 'key-findings':
        return <KeyFindingsBlock data={block.data} />;
      case 'comparison-table':
        return <ComparisonTableBlock data={block.data} />;
      case 'timeline':
        return <TimelineBlock data={block.data} />;
      case 'text-content':
        return <TextContentBlock data={block.data} />;
      case 'image-gallery':
        return <ImageGalleryBlock data={block.data} />;
      case 'sources':
        return <SourcesBlock data={block.data} />;
      case 'tool-comparison':
        return <ToolComparisonBlock data={block.data} />;
      case 'case-study-card':
        return <CaseStudyCardBlock data={block.data} />;
      case 'workflow-steps':
        return <WorkflowStepsBlock data={block.data} />;
      case 'donut-chart':
        return <DonutChartBlock data={block.data} />;
      case 'scenario-bar-chart':
        return <ScenarioBarChartBlock data={block.data} />;
      case 'cost-builder':
        return <CostBuilderBlock data={block.data} />;
      case 'survey-rating':
        return <SurveyRatingBlock data={block.data} />;
      case 'feedback-summary':
        return <FeedbackSummaryBlock data={block.data} />;
      case 'quotes':
        return <QuotesBlock data={block.data} />;
      case 'activity-rings':
        return <ActivityRingsBlock data={block.data} />;
      case 'product-options':
        return <ProductOptionsBlock data={block.data} />;
      case 'line-chart':
        return (
          <div className="p-4 bg-card border border-card rounded-xl text-gray-400 text-sm">
            Line chart block (not yet implemented)
          </div>
        );
      default: {
        const _exhaustive: never = block;
        return (
          <div className="p-4 bg-card border border-card rounded-xl text-gray-400 text-sm">
            Unknown block type: {(_exhaustive as BlockConfig).type}
          </div>
        );
      }
    }
  };

  // Section and image-gallery blocks don't need wrapper (handled by parent)
  if (block.type === 'section' || block.type === 'image-gallery') {
    return (
      <Suspense fallback={<BlockFallback />}>
        {renderBlock()}
      </Suspense>
    );
  }

  return (
    <div className="mb-8">
      {(block.title || block.description) && (
        <div className="mb-6">
          {block.title && <h3 className="text-xl font-bold text-white mb-1">{block.title}</h3>}
          {block.description && <p className="text-gray-500">{block.description}</p>}
        </div>
      )}
      <Suspense fallback={<BlockFallback />}>
        {renderBlock()}
      </Suspense>
    </div>
  );
}
