import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LineChartData } from './types';

interface LineChartBlockProps {
  data: LineChartData;
}

export function LineChartBlock({ data }: LineChartBlockProps) {
  const { series, xLabel, yLabel, unit } = data;
  const [hoveredPoint, setHoveredPoint] = useState<{ seriesIdx: number; pointIdx: number } | null>(null);

  const chartWidth = 700;
  const chartHeight = 340;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  const { allLabels, yMin, yMax, yTicks } = useMemo(() => {
    const labels = series[0]?.data.map((d) => d.label) || [];
    let min = Infinity;
    let max = -Infinity;
    for (const s of series) {
      for (const d of s.data) {
        if (d.value < min) min = d.value;
        if (d.value > max) max = d.value;
      }
    }
    // Add padding
    const range = max - min || 1;
    min = Math.floor((min - range * 0.1) / 5) * 5;
    max = Math.ceil((max + range * 0.1) / 5) * 5;
    if (min < 0 && series.every((s) => s.data.every((d) => d.value >= 0))) min = 0;

    const tickCount = 5;
    const step = (max - min) / tickCount;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => min + step * i);

    return { allLabels: labels, yMin: min, yMax: max, yTicks: ticks };
  }, [series]);

  const xScale = (i: number) => padding.left + (i / Math.max(allLabels.length - 1, 1)) * plotW;
  const yScale = (v: number) => padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const defaultColors = ['#00A9E0', '#F2A900', '#67823A', '#9A3324', '#f16555', '#B5BD00'];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={padding.left}
            y1={yScale(tick)}
            x2={chartWidth - padding.right}
            y2={yScale(tick)}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}

        {/* Y axis labels */}
        {yTicks.map((tick) => (
          <text
            key={tick}
            x={padding.left - 10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-gray-500 text-[11px]"
          >
            {Math.round(tick)}{unit || ''}
          </text>
        ))}

        {/* X axis labels */}
        {allLabels.map((label, i) => (
          <text
            key={label}
            x={xScale(i)}
            y={chartHeight - padding.bottom + 20}
            textAnchor="middle"
            className="fill-gray-500 text-[11px]"
          >
            {label}
          </text>
        ))}

        {/* Axis labels */}
        {yLabel && (
          <text
            x={16}
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 16, ${chartHeight / 2})`}
            className="fill-gray-600 text-[11px]"
          >
            {yLabel}
          </text>
        )}
        {xLabel && (
          <text
            x={chartWidth / 2}
            y={chartHeight - 6}
            textAnchor="middle"
            className="fill-gray-600 text-[11px]"
          >
            {xLabel}
          </text>
        )}

        {/* Lines and points */}
        {series.map((s, si) => {
          const color = s.color || defaultColors[si % defaultColors.length];
          const points = s.data.map((d, i) => ({ x: xScale(i), y: yScale(d.value), value: d.value, label: d.label }));
          const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

          return (
            <g key={s.name}>
              {/* Line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: si * 0.2, ease: 'easeOut' }}
              />

              {/* Points */}
              {points.map((p, pi) => {
                const isHovered = hoveredPoint?.seriesIdx === si && hoveredPoint?.pointIdx === pi;
                return (
                  <g key={pi}>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill={color}
                      stroke="#121212"
                      strokeWidth={2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: si * 0.2 + pi * 0.05 + 0.5 }}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ seriesIdx: si, pointIdx: pi })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Invisible larger hit target */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint({ seriesIdx: si, pointIdx: pi })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredPoint && (() => {
          const s = series[hoveredPoint.seriesIdx];
          const d = s.data[hoveredPoint.pointIdx];
          const color = s.color || defaultColors[hoveredPoint.seriesIdx % defaultColors.length];
          const px = xScale(hoveredPoint.pointIdx);
          const py = yScale(d.value);
          const tooltipX = px > chartWidth / 2 ? px - 120 : px + 10;
          const tooltipY = Math.max(padding.top, py - 40);

          return (
            <g>
              <rect x={tooltipX} y={tooltipY} width={110} height={36} rx={6} fill="rgba(30,30,30,0.95)" stroke="rgba(255,255,255,0.1)" />
              <text x={tooltipX + 8} y={tooltipY + 15} className="fill-gray-400 text-[10px]">{d.label}</text>
              <circle cx={tooltipX + 8} cy={tooltipY + 27} r={3} fill={color} />
              <text x={tooltipX + 16} y={tooltipY + 30} className="fill-white text-[11px] font-medium">
                {s.name}: {d.value}{unit || ''}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {series.map((s, si) => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || defaultColors[si % defaultColors.length] }} />
              <span className="text-xs text-gray-400">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
