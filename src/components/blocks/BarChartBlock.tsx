import { useState } from 'react';
import type { BarChartData, BarChartItem, BarChartGroup, BarChartGroupedBar } from './types';
import { APP_COLORS } from '../System/ThemeManager';

interface BarChartBlockProps {
  data: BarChartData;
}

const defaultColors = [
  APP_COLORS.secondary.skyBlue,
  APP_COLORS.secondary.salmon,
  APP_COLORS.secondary.orange,
  APP_COLORS.secondary.chartreuse,
  APP_COLORS.secondary.oliveGreen,
  APP_COLORS.secondary.darkBlue,
];

interface Segment {
  label: string;
  value: number;
  color: string;
  percentage: number;
  index: number;
}

function calculateSegments(items: BarChartItem[]): Segment[] {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return items.map((item, index) => {
    const color = item.color || defaultColors[index % defaultColors.length];
    const percentage = (item.value / total) * 100;
    return { ...item, color, percentage, index };
  });
}

interface SingleBarProps {
  items: BarChartItem[];
  title?: string;
  unit: string;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  barWidthPercent?: number; // For multi-bar: width relative to max total
}

function SingleBar({ items, title, unit, hoveredIndex, setHoveredIndex, barWidthPercent = 100 }: SingleBarProps) {
  const height = 48;
  const radius = height / 2;
  const segments = calculateSegments(items);

  return (
    <div>
      {title && (
        <h4 className="text-2xl font-semibold text-white mb-2">{title}</h4>
      )}
      <div
        className="relative"
        style={{ height: height + 20, paddingTop: 10, paddingBottom: 10, overflow: 'visible' }}
      >
        {/* Background pill - full width for reference */}
        <div
          className="absolute left-0 right-0 bg-black/20"
          style={{ height, borderRadius: radius, top: 10 }}
        />

        {/* Segments - width based on barWidthPercent */}
        <div
          className="absolute left-0 flex"
          style={{
            height,
            borderRadius: radius,
            top: 10,
            overflow: 'hidden',
            width: `${barWidthPercent}%`,
          }}
        >
          {segments.map((seg, i) => (
            <div
              key={seg.label}
              className="h-full transition-opacity duration-150"
              style={{
                width: `${seg.percentage}%`,
                backgroundColor: seg.color,
                opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.35,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        {/* Pop-out segment with value */}
        {hoveredIndex !== null && segments[hoveredIndex] && (
          <div
            className="absolute transition-all duration-150 ease-out flex items-center justify-center"
            style={{
              left: `${(segments.slice(0, hoveredIndex).reduce((sum, s) => sum + s.percentage, 0) / 100) * barWidthPercent}%`,
              width: `${(segments[hoveredIndex].percentage / 100) * barWidthPercent}%`,
              height: height + 16,
              top: 2,
              backgroundColor: segments[hoveredIndex].color,
              borderRadius: 12,
              filter: 'brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex flex-col items-center">
              <span className="text-white/80 text-xs">{segments[hoveredIndex].label}</span>
              <span className="text-white font-semibold text-sm">{segments[hoveredIndex].value.toLocaleString()}{unit}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface LegendProps {
  segments: Segment[];
  unit: string;
  total: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

function Legend({ segments, unit, total, hoveredIndex, setHoveredIndex }: LegendProps) {
  return (
    <div className="flex justify-end mt-4">
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between gap-4 cursor-pointer transition-opacity duration-200"
            style={{ opacity: hoveredIndex === null || hoveredIndex === segment.index ? 1 : 0.4 }}
            onMouseEnter={() => setHoveredIndex(segment.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xs text-gray-400">{segment.label}</span>
            </div>
            <span className="text-xs font-medium text-white tabular-nums">
              {segment.value.toLocaleString()}{unit}
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t border-white/10 mt-1 pt-1.5">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-xs font-medium text-white tabular-nums">{total.toLocaleString()}{unit}</span>
        </div>
      </div>
    </div>
  );
}

interface GroupedBarProps {
  groups: BarChartGroup[];
  unit: string;
}

function GroupedBar({ groups, unit: _unit }: GroupedBarProps) {
  const height = 48;
  const radius = height / 2;
  const [hoveredGroupIndex, setHoveredGroupIndex] = useState<number | null>(null);

  // Calculate total across all groups
  const grandTotal = groups.reduce(
    (sum, group) => sum + group.items.reduce((s, item) => s + item.value, 0),
    0
  );

  // Pre-calculate all group data
  const groupData = groups.map((group, groupIndex) => {
    const groupTotal = group.items.reduce((s, item) => s + item.value, 0);
    const groupColor = group.color || defaultColors[groupIndex % defaultColors.length];
    const groupPercentage = (groupTotal / grandTotal) * 100;

    const items = group.items.map((item, itemIndex) => ({
      label: item.label,
      value: item.value,
      color: item.color || defaultColors[(groupIndex * 3 + itemIndex) % defaultColors.length],
      percentage: (item.value / groupTotal) * 100, // percentage within group
    }));

    return { groupTotal, groupColor, groupPercentage, items, label: group.label };
  });

  return (
    <div>
      <div
        className="relative"
        style={{ height }}
      >
        {/* Background pill */}
        <div
          className="absolute left-0 right-0 bg-black/20"
          style={{ height, borderRadius: radius }}
        />

        {/* Segments */}
        <div
          className="absolute left-0 right-0 flex"
          style={{ height, borderRadius: radius, overflow: 'hidden' }}
        >
          {groups.map((_group, groupIndex) => {
            const data = groupData[groupIndex];
            const isExpanded = hoveredGroupIndex === groupIndex;
            const isOtherHovered = hoveredGroupIndex !== null && hoveredGroupIndex !== groupIndex;

            return (
              <div
                key={groupIndex}
                className="h-full flex transition-opacity duration-200"
                style={{
                  width: `${data.groupPercentage}%`,
                  opacity: isOtherHovered ? 0.35 : 1,
                }}
                onMouseEnter={() => setHoveredGroupIndex(groupIndex)}
                onMouseLeave={() => setHoveredGroupIndex(null)}
              >
                {isExpanded ? (
                  // Show individual items with labels
                  data.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="h-full flex items-center justify-center overflow-hidden"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    >
                      <span className="text-white text-xs font-medium truncate px-1">
                        {item.label}
                      </span>
                    </div>
                  ))
                ) : (
                  // Show collapsed group with label
                  <div
                    className="h-full w-full flex items-center justify-center"
                    style={{ backgroundColor: data.groupColor }}
                  >
                    <span className="text-white text-sm font-medium">
                      {data.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

interface MultiGroupedBarProps {
  groupedBars: BarChartGroupedBar[];
  unit: string;
}

function MultiGroupedBar({ groupedBars, unit }: MultiGroupedBarProps) {
  const height = 48;
  const radius = height / 2;
  const [hoveredGroupIndex, setHoveredGroupIndex] = useState<number | null>(null);

  // Calculate totals for each bar
  const barData = groupedBars.map((bar) => {
    const total = bar.groups.reduce(
      (sum, group) => sum + group.items.reduce((s, item) => s + item.value, 0),
      0
    );

    const groups = bar.groups.map((group, groupIndex) => {
      const groupTotal = group.items.reduce((s, item) => s + item.value, 0);
      const groupColor = group.color || defaultColors[groupIndex % defaultColors.length];
      const groupPercentage = (groupTotal / total) * 100;

      const items = group.items.map((item, itemIndex) => ({
        label: item.label,
        value: item.value,
        color: item.color || defaultColors[(groupIndex * 3 + itemIndex) % defaultColors.length],
        percentage: (item.value / groupTotal) * 100,
      }));

      return { groupTotal, groupColor, groupPercentage, items, label: group.label };
    });

    return { title: bar.title, total, groups };
  });

  const maxTotal = Math.max(...barData.map((b) => b.total));

  return (
    <div className="space-y-4">
      {barData.map((bar, barIndex) => {
        const barWidthPercent = (bar.total / maxTotal) * 100;

        return (
          <div key={barIndex}>
            <div className="flex items-baseline justify-between mb-2">
              <h4 className="text-lg font-medium text-white">{bar.title}</h4>
              <span className="text-sm text-gray-400 tabular-nums">
                {bar.total.toLocaleString()}{unit}
              </span>
            </div>
            <div className="relative" style={{ height }}>
              {/* Background pill - full width */}
              <div
                className="absolute left-0 right-0 bg-black/20"
                style={{ height, borderRadius: radius }}
              />

              {/* Bar segments - proportional width */}
              <div
                className="absolute left-0 flex"
                style={{ height, borderRadius: radius, overflow: 'hidden', width: `${barWidthPercent}%` }}
              >
                {bar.groups.map((group, groupIndex) => {
                  const isExpanded = hoveredGroupIndex === groupIndex;
                  const isOtherHovered = hoveredGroupIndex !== null && hoveredGroupIndex !== groupIndex;

                  return (
                    <div
                      key={groupIndex}
                      className="h-full flex transition-opacity duration-200"
                      style={{
                        width: `${group.groupPercentage}%`,
                        opacity: isOtherHovered ? 0.35 : 1,
                      }}
                      onMouseEnter={() => setHoveredGroupIndex(groupIndex)}
                      onMouseLeave={() => setHoveredGroupIndex(null)}
                    >
                      {isExpanded ? (
                        group.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="h-full flex items-center justify-center overflow-hidden"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          >
                            <span className="text-white text-xs font-medium truncate px-1">
                              {item.label}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div
                          className="h-full w-full flex items-center justify-center"
                          style={{ backgroundColor: group.groupColor }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-white/80 text-xs">{group.label}</span>
                            <span className="text-white font-semibold text-sm">
                              {group.groupTotal.toLocaleString()}{unit}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BarChartBlock({ data }: BarChartBlockProps) {
  const { items, bars, groups, groupedBars, unit = '', legendPosition } = data;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Determine mode
  const isMultiGrouped = groupedBars && groupedBars.length > 0;
  const isGrouped = groups && groups.length > 0;
  const isMultiBar = bars && bars.length > 0;

  // Multi-bar grouped mode
  if (isMultiGrouped) {
    return <MultiGroupedBar groupedBars={groupedBars} unit={unit} />;
  }

  // Grouped mode
  if (isGrouped) {
    return <GroupedBar groups={groups} unit={unit} />;
  }

  // For single bar mode or legend reference
  const referenceItems = isMultiBar ? bars[0].items : (items || []);
  const segments = calculateSegments(referenceItems);
  const total = referenceItems.reduce((sum, item) => sum + item.value, 0);

  // Determine legend visibility
  const effectiveLegendPosition = legendPosition ?? (isMultiBar ? 'end' : 'inline');
  const showInlineLegend = effectiveLegendPosition === 'inline';
  const showEndLegend = effectiveLegendPosition === 'end';

  if (isMultiBar) {
    // Calculate totals for each bar and find the max
    const barTotals = bars.map(bar => bar.items.reduce((sum, item) => sum + item.value, 0));
    const maxTotal = Math.max(...barTotals);

    return (
      <div className="space-y-6">
        {bars.map((bar, barIndex) => {
          const barTotal = barTotals[barIndex];
          const barWidthPercent = (barTotal / maxTotal) * 100;
          return (
            <SingleBar
              key={barIndex}
              items={bar.items}
              title={bar.title}
              unit={unit}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              barWidthPercent={barWidthPercent}
            />
          );
        })}
        {showEndLegend && (
          <Legend
            segments={segments}
            unit={unit}
            total={total}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        )}
      </div>
    );
  }

  // Single bar mode (backwards compatible)
  return (
    <div className="space-y-4">
      <SingleBar
        items={items || []}
        unit={unit}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
      />
      {showInlineLegend && (
        <Legend
          segments={segments}
          unit={unit}
          total={total}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      )}
    </div>
  );
}
