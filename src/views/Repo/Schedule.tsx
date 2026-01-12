import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, FileText, Presentation, CheckCircle, Play, Users, Calendar, BarChart3, GanttChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as d3 from 'd3';
import { useProjects } from '../../context/ProjectsContext';

// ============================================
// TYPES
// ============================================

interface TimelineEvent {
  id: string;
  date: Date;
  dayOfYear: number;
  title: string;
  description: string;
  projectId: string;
  projectTitle: string;
  category: string;
  type: 'start' | 'milestone' | 'deadline' | 'presentation' | 'completion';
}

interface ProjectBar {
  id: string;
  title: string;
  category: string;
  researcher: string;
  startDay: number;
  endDay: number;
  status: StatusFilter;
}

type StatusFilter = 'all' | 'in-progress' | 'completed' | 'future';

// ============================================
// DATA
// ============================================

const EVENTS_2025 = [
  { date: '2025-01-15', title: 'Project Start', description: 'Research phase begins', projectId: 'X25-RB01', type: 'start' as const },
  { date: '2025-01-15', title: 'Project Start', description: 'Computational design research initiated', projectId: 'X25-RB08', type: 'start' as const },
  { date: '2025-02-01', title: 'Project Start', description: 'Phase 2 development begins', projectId: 'X25-RB02', type: 'start' as const },
  { date: '2025-02-18', title: 'Phase 2 Deadline', description: 'Design iteration deliverables due', projectId: 'X25-RB02', type: 'deadline' as const },
  { date: '2025-02-20', title: 'Final Presentation', description: 'Present findings to stakeholders', projectId: 'X25-RB01', type: 'presentation' as const },
  { date: '2025-03-01', title: 'Client Review', description: 'Flour Bluff CTE review meeting', projectId: 'X25-RB02', type: 'presentation' as const },
  { date: '2025-03-05', title: 'Publication Deadline', description: 'Texas Architect article submission', projectId: 'X25-RB01', type: 'deadline' as const },
  { date: '2025-03-10', title: 'Data Collection', description: 'Field research data gathering complete', projectId: 'X25-RB05', type: 'milestone' as const },
  { date: '2025-04-01', title: 'Texas Architect', description: 'Submit article for review', projectId: 'X25-RB05', type: 'deadline' as const },
  { date: '2025-05-15', title: 'Mid-Year Review', description: 'Material research progress update', projectId: 'X25-RB03', type: 'presentation' as const },
  { date: '2025-06-01', title: 'Summer Kickoff', description: 'Urban design research begins', projectId: 'X25-RB06', type: 'start' as const },
  { date: '2025-07-15', title: 'Partner Workshop', description: 'Wood Works collaboration session', projectId: 'X25-RB05', type: 'presentation' as const },
  { date: '2025-09-15', title: 'Fall Symposium', description: 'Present at architecture symposium', projectId: 'X25-RB02', type: 'presentation' as const },
  { date: '2025-09-30', title: 'Completion', description: 'Research cycle complete', projectId: 'X25-RB01', type: 'completion' as const },
  { date: '2025-10-01', title: 'Q4 Planning', description: 'Next phase planning begins', projectId: 'X25-RB08', type: 'milestone' as const },
  { date: '2025-11-15', title: 'Documentation', description: 'Final documentation and handoff', projectId: 'X25-RB08', type: 'deadline' as const },
  { date: '2025-11-30', title: 'Completion', description: 'Project complete', projectId: 'X25-RB08', type: 'completion' as const },
  { date: '2025-12-10', title: 'Annual Review', description: 'Year-end research presentation', projectId: 'X25-RB01', type: 'presentation' as const },
];

const PROJECT_SPANS: Record<string, { start: string; end: string }> = {
  'X25-RB01': { start: '2025-01-15', end: '2025-12-31' },
  'X25-RB02': { start: '2025-02-01', end: '2025-10-15' },
  'X25-RB03': { start: '2025-01-01', end: '2025-08-30' },
  'X25-RB05': { start: '2025-02-15', end: '2025-09-30' },
  'X25-RB06': { start: '2025-06-01', end: '2025-12-31' },
  'X25-RB08': { start: '2025-01-15', end: '2025-11-30' },
};

// Hours per month per project (mock data - would come from API)
const HOURS_DATA = [
  { month: 'Jan', 'RB01': 40, 'RB02': 0, 'RB03': 20, 'RB05': 0, 'RB06': 0, 'RB08': 35 },
  { month: 'Feb', 'RB01': 45, 'RB02': 30, 'RB03': 25, 'RB05': 15, 'RB06': 0, 'RB08': 40 },
  { month: 'Mar', 'RB01': 50, 'RB02': 45, 'RB03': 30, 'RB05': 25, 'RB06': 0, 'RB08': 35 },
  { month: 'Apr', 'RB01': 35, 'RB02': 50, 'RB03': 35, 'RB05': 40, 'RB06': 0, 'RB08': 30 },
  { month: 'May', 'RB01': 30, 'RB02': 45, 'RB03': 40, 'RB05': 45, 'RB06': 0, 'RB08': 25 },
  { month: 'Jun', 'RB01': 25, 'RB02': 40, 'RB03': 30, 'RB05': 35, 'RB06': 20, 'RB08': 30 },
  { month: 'Jul', 'RB01': 30, 'RB02': 35, 'RB03': 25, 'RB05': 40, 'RB06': 35, 'RB08': 35 },
  { month: 'Aug', 'RB01': 35, 'RB02': 30, 'RB03': 15, 'RB05': 30, 'RB06': 40, 'RB08': 40 },
  { month: 'Sep', 'RB01': 40, 'RB02': 35, 'RB03': 0, 'RB05': 20, 'RB06': 45, 'RB08': 35 },
  { month: 'Oct', 'RB01': 35, 'RB02': 20, 'RB03': 0, 'RB05': 0, 'RB06': 50, 'RB08': 45 },
  { month: 'Nov', 'RB01': 30, 'RB02': 0, 'RB03': 0, 'RB05': 0, 'RB06': 45, 'RB08': 30 },
  { month: 'Dec', 'RB01': 25, 'RB02': 0, 'RB03': 0, 'RB05': 0, 'RB06': 40, 'RB08': 0 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EVENT_ICONS = {
  start: Play,
  milestone: Flag,
  deadline: FileText,
  presentation: Presentation,
  completion: CheckCircle,
};

// Status colors
const STATUS_COLORS: Record<StatusFilter, string> = {
  'all': '#666666',
  'in-progress': '#2563eb', // blue-600
  'completed': '#16a34a',   // green-600
  'future': '#ca8a04',      // yellow-600
};

function getStatusColor(status: StatusFilter): string {
  return STATUS_COLORS[status] || STATUS_COLORS['future'];
}

// ============================================
// COMPONENTS
// ============================================

// Event Icon Component
interface EventIconProps {
  icon: LucideIcon;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  position: number;
}

function EventIcon({ icon: Icon, color, isSelected, onClick, position }: EventIconProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${position}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: isSelected ? color : 'transparent',
          border: isSelected ? '2px solid white' : '2px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <Icon size={12} color={isSelected ? '#000' : color} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

// D3 Stacked Area Chart Component - aligned with timeline layout
interface StackedAreaChartProps {
  data: typeof HOURS_DATA;
  projectBars: ProjectBar[];
  maxY: number; // Fixed Y scale max for consistency across filters
}

function StackedAreaChart({ data, projectBars, maxY }: StackedAreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || projectBars.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 240;
    const margin = { top: 20, right: 10, bottom: 20, left: 40 };

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get keys (project IDs) - only for visible projects
    const keys = projectBars.map(p => p.id.replace('X25-', ''));

    // Stack the data
    const stack = d3.stack<typeof HOURS_DATA[0]>()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    // Scales
    const x = d3.scalePoint<string>()
      .domain(data.map(d => d.month))
      .range([0, innerWidth])
      .padding(0);

    // Use fixed maxY for consistent scale across filters
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([innerHeight, 0]);

    // Area generator with smooth interpolation
    const area = d3.area<d3.SeriesPoint<typeof HOURS_DATA[0]>>()
      .x(d => x(d.data.month) || 0)
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    // Flat area (for animation start)
    const areaFlat = d3.area<d3.SeriesPoint<typeof HOURS_DATA[0]>>()
      .x(d => x(d.data.month) || 0)
      .y0(innerHeight)
      .y1(innerHeight)
      .curve(d3.curveMonotoneX);

    // Draw areas with grow-up animation
    g.selectAll('.layer')
      .data(stackedData)
      .join('path')
      .attr('class', 'layer')
      .attr('d', areaFlat)
      .attr('fill', (d) => {
        const project = projectBars.find(p => p.id.replace('X25-', '') === d.key);
        return project ? getStatusColor(project.status) : '#666';
      })
      .attr('fill-opacity', 0.6)
      .attr('stroke', (d) => {
        const project = projectBars.find(p => p.id.replace('X25-', '') === d.key);
        return project ? getStatusColor(project.status) : '#666';
      })
      .attr('stroke-width', 1.5)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('d', area);

    // Y Axis with hour values
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#333').attr('stroke-dasharray', '2,2'))
      .call(g => g.selectAll('.tick text').attr('fill', '#888').attr('font-size', '10px'));

    // Hover elements
    const hoverLine = g.append('line')
      .attr('class', 'hover-line')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    const hoverDots = g.append('g').attr('class', 'hover-dots');

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Invisible rect for mouse events
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);

        // Find closest month
        const months = data.map(d => d.month);
        const xPositions = months.map(m => x(m) || 0);
        let closestIndex = 0;
        let closestDist = Infinity;
        xPositions.forEach((pos, i) => {
          const dist = Math.abs(pos - mouseX);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });

        const monthData = data[closestIndex];
        const xPos = x(monthData.month) || 0;

        // Update hover line
        hoverLine
          .attr('x1', xPos)
          .attr('x2', xPos)
          .style('opacity', 1);

        // Update dots
        hoverDots.selectAll('circle').remove();
        let totalHours = 0;
        stackedData.forEach((layer) => {
          const point = layer[closestIndex];
          const project = projectBars.find(p => p.id.replace('X25-', '') === layer.key);
          const color = project ? getStatusColor(project.status) : '#666';
          const hours = point[1] - point[0];
          totalHours += hours;

          if (hours > 0) {
            hoverDots.append('circle')
              .attr('cx', xPos)
              .attr('cy', y(point[1]))
              .attr('r', 4)
              .attr('fill', color)
              .attr('stroke', '#fff')
              .attr('stroke-width', 2);
          }
        });

        // Update tooltip
        let tooltipContent = `<div class="text-xs text-gray-400 mb-1">${monthData.month}</div>`;
        tooltipContent += `<div class="text-sm text-white font-medium mb-2">${totalHours} total hrs</div>`;
        keys.forEach(key => {
          const hours = (monthData as Record<string, number | string>)[key] as number;
          if (hours > 0) {
            const project = projectBars.find(p => p.id.replace('X25-', '') === key);
            const color = project ? getStatusColor(project.status) : '#666';
            tooltipContent += `<div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full" style="background:${color}"></span>
              <span class="text-gray-400">${key}:</span>
              <span class="text-white">${hours}h</span>
            </div>`;
          }
        });

        tooltip
          .html(tooltipContent)
          .style('opacity', 1)
          .style('left', `${xPos + margin.left + 10}px`)
          .style('top', '20px');
      })
      .on('mouseleave', function() {
        hoverLine.style('opacity', 0);
        hoverDots.selectAll('circle').remove();
        tooltip.style('opacity', 0);
      });

  }, [data, projectBars, maxY]);

  return (
    <div className="flex gap-4">
      <div className="w-12 shrink-0" />
      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="w-full" />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-card border border-gray-700 rounded-lg px-3 py-2 transition-opacity"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}

// Progress Bar Component (shared) - aligned with project bars
function ProgressBar({ yearProgress }: { yearProgress: number }) {
  return (
    <div className="mt-4">
      {/* Bar */}
      <div className="flex items-center gap-4">
        <div className="w-12 shrink-0" />
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          {/* Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${yearProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '9999px'
            }}
          />
        </div>
      </div>

      {/* Month labels */}
      <div className="flex items-center gap-4 mt-3">
        <div className="w-12 shrink-0" />
        <div className="flex-1 flex justify-between">
          {MONTHS.map(month => (
            <span key={month} className="text-xs text-gray-600 w-0 text-center">
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ============================================
// MAIN COMPONENT
// ============================================

// Determine project status based on phase from CSV
function getProjectStatus(projectId: string, projects: ReturnType<typeof useProjects>['projects']): StatusFilter {
  const project = projects.find(p => p.id === projectId);
  if (!project) return 'future';

  const phase = project.phase?.toLowerCase() || '';
  if (phase.includes('completed')) return 'completed';
  if (phase.includes('developmental') || phase.includes('in progress')) return 'in-progress';
  return 'future'; // Pre-Research or unknown
}

export default function Schedule() {
  const { projects } = useProjects();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'hours'>('timeline');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const yearProgress = useMemo(() => {
    const now = new Date();
    // For 2025 schedule, show progress based on current date
    // If before 2025, show 0%. If after 2025, show 100%
    if (now.getFullYear() < 2025) return 0;
    if (now.getFullYear() > 2025) return 100;
    return (getDayOfYear(now) / 365) * 100;
  }, []);

  // Calculate maxY from ALL projects for consistent Y scale
  const maxYHours = useMemo(() => {
    const allProjectKeys = Object.keys(PROJECT_SPANS).map(id => id.replace('X25-', ''));
    let max = 0;
    HOURS_DATA.forEach(month => {
      let monthTotal = 0;
      allProjectKeys.forEach(key => {
        monthTotal += (month as Record<string, number | string>)[key] as number || 0;
      });
      if (monthTotal > max) max = monthTotal;
    });
    return max;
  }, []);

  const allProjectBars = useMemo(() => {
    const projectIds = Object.keys(PROJECT_SPANS).sort();
    return projectIds.map(id => {
      const project = projects.find(p => p.id === id);
      const span = PROJECT_SPANS[id];
      return {
        id,
        title: project?.title || id,
        category: project?.category || 'sustainability',
        researcher: project?.researcher || 'TBD',
        startDay: getDayOfYear(new Date(span.start)),
        endDay: getDayOfYear(new Date(span.end)),
        status: getProjectStatus(id, projects),
      };
    });
  }, [projects]);

  // Filter projects based on status
  const projectBars = useMemo(() => {
    if (statusFilter === 'all') return allProjectBars;
    return allProjectBars.filter(p => p.status === statusFilter);
  }, [allProjectBars, statusFilter]);

  const timelineEvents = useMemo(() => {
    const visibleProjectIds = new Set(projectBars.map(p => p.id));
    return EVENTS_2025
      .filter(event => visibleProjectIds.has(event.projectId))
      .map((event, i) => {
        const date = new Date(event.date);
        const project = projects.find(p => p.id === event.projectId);
        return {
          id: `ev-${i}`,
          date,
          dayOfYear: getDayOfYear(date),
          title: event.title,
          description: event.description,
          projectId: event.projectId,
          projectTitle: project?.title || event.projectId,
          category: project?.category || 'sustainability',
          type: event.type,
        };
      });
  }, [projects, projectBars]);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  return (
    <div className="px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Schedule</h1>
        <p className="text-gray-400">2025 Research Activity</p>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between mb-8">
        {/* Left: Legend */}
        <div className="flex gap-6">
          {viewMode === 'timeline' && Object.entries(EVENT_ICONS).map(([type, Icon]) => (
            <div key={type} className="flex items-center gap-2">
              <Icon className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 capitalize">{type}</span>
            </div>
          ))}
          {viewMode === 'hours' && projectBars.map((project) => {
            const statusColor = getStatusColor(project.status);
            return (
              <div key={project.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColor }} />
                <span className="text-xs text-gray-400">{project.id.replace('X25-', '')}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Filters + View toggle */}
        <div className="flex items-center gap-4">
          {/* Status filter */}
          <div className="flex items-center gap-1">
            {(['all', 'in-progress', 'completed', 'future'] as const).map((filter) => {
              const isActive = statusFilter === filter;
              const colorClasses = {
                'all': isActive ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white',
                'in-progress': isActive ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-400',
                'completed': isActive ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-400',
                'future': isActive ? 'bg-yellow-600 text-white' : 'text-gray-500 hover:text-yellow-400',
              };
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${colorClasses[filter]}`}
                >
                  {filter === 'all' ? 'All' : filter === 'in-progress' ? 'In Progress' : filter === 'completed' ? 'Completed' : 'Future'}
                </button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-gray-700" />

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors ${
                viewMode === 'timeline' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <GanttChart className="w-3 h-3" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('hours')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors ${
                viewMode === 'hours' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Hours
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - centered 80% */}
      <div className="mx-auto" style={{ width: '80%' }}>

        {/* Fixed height container for content - flex column with items at bottom */}
        <div className="flex flex-col justify-end" style={{ minHeight: '280px' }}>
          {/* Empty state */}
          {projectBars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No projects match the selected filter</p>
            </div>
          )}

          {/* PART 1: Timeline View (Gantt bars) */}
          {viewMode === 'timeline' && projectBars.length > 0 && (
            <div className="space-y-3">
            {projectBars.map((project, rowIndex) => {
              const statusColor = getStatusColor(project.status);
              const projectEvents = timelineEvents.filter(e => e.projectId === project.id);
              const barStart = (project.startDay / 365) * 100;
              const barWidth = ((project.endDay - project.startDay) / 365) * 100;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 shrink-0 text-right">
                    <span className="text-xs font-mono text-gray-500">
                      {project.id.replace('X25-', '')}
                    </span>
                  </div>

                  <div className="flex-1 relative h-8">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 rounded-full"
                      style={{
                        left: `${barStart}%`,
                        width: `${barWidth}%`,
                        backgroundColor: `${statusColor}40`,
                      }}
                    >
                      {projectEvents.map((event) => {
                        const eventPosition = ((event.dayOfYear - project.startDay) / (project.endDay - project.startDay)) * 100;
                        const clampedPosition = Math.max(6, Math.min(94, eventPosition));

                        return (
                          <EventIcon
                            key={event.id}
                            icon={EVENT_ICONS[event.type]}
                            color={statusColor}
                            isSelected={selectedEvent?.id === event.id}
                            onClick={() => handleEventClick(event)}
                            position={clampedPosition}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

          {/* PART 2: Hours View (D3 Stacked Area) */}
          {viewMode === 'hours' && projectBars.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <StackedAreaChart
                data={HOURS_DATA}
                projectBars={projectBars}
                maxY={maxYHours}
              />
            </motion.div>
          )}
        </div>

        {/* PART 3: Progress Bar (shared) - always at same position */}
        <ProgressBar yearProgress={yearProgress} />
      </div>

      {/* Selected event details (timeline mode only) */}
      <AnimatePresence>
        {viewMode === 'timeline' && selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-auto mt-12 p-6 bg-card border border-gray-800 rounded-2xl"
            style={{ width: '80%' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const project = projectBars.find(p => p.id === selectedEvent.projectId);
                    const statusColor = project ? getStatusColor(project.status) : '#666';
                    return (
                      <span
                        className="px-2 py-1 rounded text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                        }}
                      >
                        {selectedEvent.type}
                      </span>
                    );
                  })()}
                  <span className="text-xs font-mono text-gray-500">{selectedEvent.projectId}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedEvent.title}</h3>
                <p className="text-gray-400">{selectedEvent.projectTitle}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedEvent.date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-300">{selectedEvent.description}</p>

            {(() => {
              const project = projectBars.find(p => p.id === selectedEvent.projectId);
              if (project?.researcher && project.researcher !== 'TBD') {
                return (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Team</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.researcher.split(',').map((member, i) => (
                        <span key={i} className="text-sm text-gray-300 px-2 py-1 bg-gray-800 rounded">
                          {member.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
