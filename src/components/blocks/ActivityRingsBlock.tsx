import { motion } from 'framer-motion';
import * as d3 from 'd3';
import type { ActivityRingsData, ActivityRingsItem } from './types';

interface ActivityRingsBlockProps {
  data: ActivityRingsData;
}

function RingCard({ item, index }: { item: ActivityRingsItem; index: number }) {
  const { title, subtitle, centerValue, centerLabel, rings } = item;

  // Ring configuration
  const size = 130;
  const center = size / 2;
  const strokeWidth = 12;
  const gap = 2; // Gap between rings

  // Ring radii - first ring in data array = outermost
  // Each ring: outerRadius, innerRadius = outerRadius - strokeWidth
  const ringRadii = rings.slice(0, 3).map((_, i) => {
    const outerR = center - (i * (strokeWidth + gap)) - strokeWidth / 2;
    const innerR = outerR - strokeWidth;
    return { inner: innerR, outer: outerR };
  });

  // D3 arc generators
  // Background: full circle, no corner radius needed
  const bgArcGenerator = d3.arc<unknown>()
    .startAngle(0)
    .endAngle(2 * Math.PI);

  // Foreground: partial fill with rounded ends
  const fgArcGenerator = d3.arc<unknown>()
    .startAngle(0)
    .cornerRadius(strokeWidth / 2);

  return (
    <motion.div
      className="bg-white/5 rounded-2xl p-5 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Rings */}
      <div className="flex justify-center mb-5">
        <svg width={size} height={size}>
          <g transform={`translate(${center}, ${center})`}>
            {rings.slice(0, 3).map((ring, ringIndex) => {
              const { inner, outer } = ringRadii[ringIndex];

              // Background arc (full circle)
              const bgPath = bgArcGenerator
                .innerRadius(inner)
                .outerRadius(outer)(null) || '';

              // Foreground arc (partial based on value, starts at 12 o'clock)
              const scoreAngle = (ring.value / 100) * 2 * Math.PI;
              const fgPath = ring.value > 0
                ? fgArcGenerator
                    .innerRadius(inner)
                    .outerRadius(outer)
                    .endAngle(scoreAngle)(null) || ''
                : '';

              return (
                <g key={ring.name}>
                  {/* Background arc - full circle at 25% opacity */}
                  <path
                    d={bgPath}
                    fill={ring.color}
                    opacity={0.25}
                  />
                  {/* Foreground arc - filled portion */}
                  {ring.value > 0 && (
                    <motion.path
                      d={fgPath}
                      fill={ring.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.05 + ringIndex * 0.15 }}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Center content */}
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-2xl font-bold"
          >
            {centerValue}
          </text>
          {centerLabel && (
            <text
              x={center}
              y={center + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-500 text-xs"
            >
              {centerLabel}
            </text>
          )}
        </svg>
      </div>

      {/* Title area - below rings */}
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold text-white">{title}</h4>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>

      {/* Ring legend - compact with percentages */}
      <div className="space-y-1.5">
        {rings.slice(0, 3).map((ring) => (
          <div key={ring.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: ring.color }}
            />
            <span className="text-sm text-gray-400">{ring.name}</span>
            <span className="text-sm text-gray-500 ml-auto">{ring.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function ActivityRingsBlock({ data }: ActivityRingsBlockProps) {
  const { groups, columns = 4 } = data;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  let itemIndex = 0;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.vendor}>
          {/* Vendor header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <h3 className="text-lg font-semibold text-white">{group.vendor}</h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Items grid */}
          <div className={`grid ${gridCols[columns]} gap-4`}>
            {group.items.map((item) => {
              const currentIndex = itemIndex++;
              return (
                <RingCard
                  key={item.title}
                  item={item}
                  index={currentIndex}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
