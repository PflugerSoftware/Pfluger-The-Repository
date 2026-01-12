import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import type { TimelineData } from './types';
import { STATUS_COLORS, APP_COLORS } from '../System/ThemeManager';

interface TimelineBlockProps {
  data: TimelineData;
}

const statusConfig = {
  complete: {
    icon: CheckCircle,
    color: STATUS_COLORS.success.color,
    bgColor: STATUS_COLORS.success.color + '20',
  },
  'in-progress': {
    icon: Clock,
    color: APP_COLORS.secondary.skyBlue,
    bgColor: APP_COLORS.secondary.skyBlue + '20',
  },
  pending: {
    icon: Circle,
    color: STATUS_COLORS.neutral.color,
    bgColor: STATUS_COLORS.neutral.color + '20',
  },
};

function VerticalTimeline({ data }: { data: TimelineData }) {
  const { events } = data;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-card" />

      <div className="space-y-6">
        {events.map((event, index) => {
          const config = statusConfig[event.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={event.date + event.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex gap-4 pl-14"
            >
              {/* Icon */}
              <div
                className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.bgColor }}
              >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-white">{event.title}</span>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-500">{event.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HorizontalTimeline({ data }: { data: TimelineData }) {
  const { events, projectEvents = [], workload = [] } = data;

  // Parse date strings like "Jan 6", "Feb 10" into sortable values
  const parseDate = (dateStr: string): number => {
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]] ?? 0;
    const day = parseInt(parts[1], 10) || 1;
    return month * 100 + day;
  };

  // Combine and sort all events by date for positioning
  const allDates = [
    ...events.map((e) => e.date),
    ...projectEvents.map((e) => e.date),
    ...workload.map((w) => w.date),
  ];
  const uniqueDates = [...new Set(allDates)].sort((a, b) => parseDate(a) - parseDate(b));

  const getPosition = (date: string) => {
    const index = uniqueDates.indexOf(date);
    // Spread events evenly, with padding on edges
    return ((index + 0.5) / uniqueDates.length) * 100;
  };

  // Build workload river
  const maxHours = Math.max(...workload.map((w) => w.hours), 1);
  const riverMaxHeight = 20; // max thickness (in px, will expand up and down)

  const workloadPoints = workload.map((w) => ({
    x: getPosition(w.date),
    h: (w.hours / maxHours) * riverMaxHeight,
    hours: w.hours,
  }));

  return (
    <div className="relative py-8">
      {/* Research events (above line) */}
      <div className="relative h-32 mb-2">
        {events.map((event, index) => {
          const config = statusConfig[event.status];
          const Icon = config.icon;
          const left = getPosition(event.date);

          return (
            <motion.div
              key={event.date + event.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
            >
              {/* Content - top aligned */}
              <div className="text-center max-w-[120px]">
                <p className="text-xs text-gray-500 mb-0.5">{event.date}</p>
                <p className="text-sm font-medium text-white leading-tight">{event.title}</p>
              </div>
              {/* Connector line - grows to fill space */}
              <div className="w-px flex-1 bg-gray-600 my-2" />
              {/* Icon - at bottom */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: config.bgColor }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center timeline with workload river */}
      <div className="relative" style={{ height: riverMaxHeight * 2 + 8 }}>
        {/* Labels */}
        <div className="absolute -left-2 top-0 text-xs text-gray-500 uppercase tracking-wider" style={{ transform: 'translateY(-100%)' }}>
          Research
        </div>
        <div className="absolute -left-2 bottom-0 text-xs text-gray-500 uppercase tracking-wider" style={{ transform: 'translateY(100%)' }}>
          Project
        </div>

        {workloadPoints.length > 0 ? (
          <svg
            className="absolute inset-0 w-full"
            style={{ height: riverMaxHeight * 2 + 8 }}
            viewBox={`0 0 100 ${riverMaxHeight * 2 + 8}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={APP_COLORS.secondary.skyBlue} stopOpacity="0.1" />
                <stop offset="20%" stopColor={APP_COLORS.secondary.skyBlue} stopOpacity="0.5" />
                <stop offset="80%" stopColor={APP_COLORS.secondary.skyBlue} stopOpacity="0.5" />
                <stop offset="100%" stopColor={APP_COLORS.secondary.skyBlue} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={(() => {
                const centerY = riverMaxHeight + 4;
                const minH = 1;

                // Points with x as percentage (0-100)
                const pts = [
                  { x: 0, h: minH },
                  ...workloadPoints.map(p => ({ x: p.x, h: Math.max(minH, p.h) })),
                  { x: 100, h: minH },
                ];

                // Build path - use simple lines with vertical-only control points
                let path = `M 0,${centerY - pts[0].h}`;

                // Top edge
                for (let i = 1; i < pts.length; i++) {
                  const prev = pts[i - 1];
                  const curr = pts[i];
                  const midX = (prev.x + curr.x) / 2;
                  const prevY = centerY - prev.h;
                  const currY = centerY - curr.h;
                  // Control points at midX, with y from each endpoint (no horizontal offset)
                  path += ` C ${midX},${prevY} ${midX},${currY} ${curr.x},${currY}`;
                }

                // Connect to bottom
                const lastPt = pts[pts.length - 1];
                path += ` L ${lastPt.x},${centerY + lastPt.h}`;

                // Bottom edge (reverse)
                for (let i = pts.length - 2; i >= 0; i--) {
                  const prev = pts[i + 1];
                  const curr = pts[i];
                  const midX = (prev.x + curr.x) / 2;
                  const prevY = centerY + prev.h;
                  const currY = centerY + curr.h;
                  path += ` C ${midX},${prevY} ${midX},${currY} ${curr.x},${currY}`;
                }

                path += ' Z';
                return path;
              })()}
              fill="url(#riverGrad)"
            />
          </svg>
        ) : (
          <div
            className="absolute left-0 right-0 h-px bg-gray-700"
            style={{ top: '50%' }}
          />
        )}
      </div>

      {/* Project events (below line) */}
      <div className="relative h-24 mt-2">
        {projectEvents.map((event, index) => {
          const left = getPosition(event.date);

          return (
            <motion.div
              key={event.date + event.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
            >
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-500" />
              {/* Connector line */}
              <div className="w-px h-4 bg-gray-600" />
              {/* Content */}
              <div className="text-center mt-1 max-w-[120px]">
                <p className="text-xs text-gray-500 mb-0.5">{event.date}</p>
                <p className="text-sm text-gray-400 leading-tight">{event.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineBlock({ data }: TimelineBlockProps) {
  const { layout = 'vertical', projectEvents } = data;

  // Auto-select horizontal if projectEvents are provided
  const effectiveLayout = projectEvents && projectEvents.length > 0 ? 'horizontal' : layout;

  if (effectiveLayout === 'horizontal') {
    return <HorizontalTimeline data={data} />;
  }

  return <VerticalTimeline data={data} />;
}
