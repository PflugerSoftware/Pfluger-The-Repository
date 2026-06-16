import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';

interface ProjectSchedule {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  color: string;
}

// Mock data - would come from user's actual project assignments
const USER_PROJECTS: ProjectSchedule[] = [
  {
    id: 'P-001',
    name: 'Manor ISD High School',
    role: 'Design Team',
    startDate: '2025-01',
    endDate: '2025-06',
    hoursPerWeek: 25,
    color: '#00A9E0'
  },
  {
    id: 'P-002',
    name: 'Austin Community College',
    role: 'Project Architect',
    startDate: '2025-03',
    endDate: '2025-09',
    hoursPerWeek: 15,
    color: '#67823A'
  }
];

interface ScheduleCardProps {
  proposedScope?: 'simple' | 'medium' | 'complex' | '';
  hoursPerWeek?: number; // Dynamic hours from actual methodology
}

// Fallback hours if not provided
const SCOPE_HOURS: Record<string, { weekly: number; duration: string }> = {
  simple: { weekly: 4, duration: '5-15 weeks' },
  medium: { weekly: 4, duration: '15-30 weeks' },
  complex: { weekly: 4, duration: '30-50 weeks' }
};

export function ScheduleCard({ proposedScope, hoursPerWeek }: ScheduleCardProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const currentMonth = new Date().getMonth(); // 0-indexed

  // Calculate total weekly hours from existing projects
  const totalProjectHours = USER_PROJECTS.reduce((sum, p) => sum + p.hoursPerWeek, 0);
  // Use provided hoursPerWeek, or fall back to scope-based estimate
  const proposedHours = hoursPerWeek || (proposedScope ? SCOPE_HOURS[proposedScope]?.weekly || 0 : 0);
  const totalWithResearch = totalProjectHours + proposedHours;

  const getMonthIndex = (dateStr: string) => {
    const month = parseInt(dateStr.split('-')[1]) - 1;
    return month;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-body font-medium">Your Schedule</span>
        </div>
        <div className="text-caption">
          {totalProjectHours}hrs/wk on projects
          {proposedHours > 0 && (
            <span className="text-neutral"> + {proposedHours}hrs research</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Month headers */}
        <div className="flex border-b border-border pb-2 mb-3">
          {months.map((month, i) => (
            <div
              key={month}
              className={`flex-1 text-xs text-center ${
                i === currentMonth ? 'text-white font-medium' : 'text-foreground-subtle'
              }`}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Project bars */}
        <div className="space-y-2">
          {USER_PROJECTS.map((project) => {
            const startIdx = getMonthIndex(project.startDate);
            const endIdx = getMonthIndex(project.endDate);
            const leftPercent = (startIdx / months.length) * 100;
            const widthPercent = ((endIdx - startIdx + 1) / months.length) * 100;

            return (
              <div key={project.id} className="relative h-6">
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${widthPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute h-full rounded-md flex items-center px-2 overflow-hidden"
                  style={{
                    left: `${leftPercent}%`,
                    backgroundColor: `${project.color}30`,
                    borderLeft: `2px solid ${project.color}`
                  }}
                >
                  <span className="text-xs text-foreground truncate">{project.name}</span>
                </motion.div>
              </div>
            );
          })}

          {/* Proposed research slot */}
          {proposedScope && (
            <div className="relative h-6">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '40%', opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute h-full rounded-md flex items-center px-2 overflow-hidden border border-dashed border-neutral"
                style={{
                  left: `${(currentMonth / months.length) * 100}%`,
                  backgroundColor: 'rgba(234, 179, 8, 0.1)'
                }}
              >
                <Plus className="w-3 h-3 text-neutral mr-1 shrink-0" />
                <span className="text-xs text-neutral truncate">New Research</span>
              </motion.div>
            </div>
          )}

          {/* Empty state for research */}
          {!proposedScope && (
            <div className="relative h-6">
              <div
                className="absolute h-full rounded-md flex items-center justify-center px-2 border border-dashed border-border bg-secondary/30"
                style={{ left: '0%', width: '100%' }}
              >
                <span className="text-meta">Research time will appear here</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Capacity indicator */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-meta">Weekly capacity</span>
          <span className={totalWithResearch > 40 ? 'text-destructive' : 'text-muted-foreground'}>
            {totalWithResearch}/40 hrs
          </span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalWithResearch / 40) * 100, 100)}%` }}
            style={{
              backgroundColor: totalWithResearch > 40 ? '#f87171' : totalWithResearch > 32 ? '#fbbf24' : '#4ade80'
            }}
          />
        </div>
      </div>
    </div>
  );
}
