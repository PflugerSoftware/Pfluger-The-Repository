import type { BlockConfig, StatGridData, BarChartData, KeyFindingsData, ComparisonTableData, TimelineData, TextContentData, SectionData, ImageGalleryData, SourcesData, ToolComparisonData, CaseStudyCardData, WorkflowStepsData, DonutChartData, ScenarioBarChartData, CostBuilderData, SurveyRatingData, FeedbackSummaryData, QuotesData, ActivityRingsData, ProductOptionsData } from './types';
import { StatGridBlock } from './StatGridBlock';
import { BarChartBlock } from './BarChartBlock';
import { KeyFindingsBlock } from './KeyFindingsBlock';
import { ComparisonTableBlock } from './ComparisonTableBlock';
import { TimelineBlock } from './TimelineBlock';
import { TextContentBlock } from './TextContentBlock';
import { SectionBlock } from './SectionBlock';
import { ImageGalleryBlock } from './ImageGalleryBlock';
import { SourcesBlock } from './SourcesBlock';
import { ToolComparisonBlock } from './ToolComparisonBlock';
import { CaseStudyCardBlock } from './CaseStudyCardBlock';
import { WorkflowStepsBlock } from './WorkflowStepsBlock';
import { DonutChartBlock } from './DonutChartBlock';
import { ScenarioBarChartBlock } from './ScenarioBarChartBlock';
import { CostBuilderBlock } from './CostBuilderBlock';
import { SurveyRatingBlock } from './SurveyRatingBlock';
import { FeedbackSummaryBlock } from './FeedbackSummaryBlock';
import { QuotesBlock } from './QuotesBlock';
import { ActivityRingsBlock } from './ActivityRingsBlock';
import { ProductOptionsBlock } from './ProductOptionsBlock';

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
    return renderBlock();
  }

  return (
    <div className="mb-8">
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
          {description && <p className="text-gray-500">{description}</p>}
        </div>
      )}
      {renderBlock()}
    </div>
  );
}
