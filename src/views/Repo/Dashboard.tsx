import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '../../context/ProjectsContext';

// Calendar events data
const CALENDAR_EVENTS: Record<number, string[]> = {
  3: ['Team kickoff meeting'],
  7: ['Modulizer review', 'Submit draft report'],
  12: ['Client presentation'],
  14: ['Research workshop'],
  18: ['Phase 2 deadline'],
  21: ['Partner sync call'],
  25: ['Monthly review'],
  28: ['Quarter planning'],
};

// Key milestones - always visible
const KEY_MILESTONES = [
  { date: 'Feb 18', project: 'Modulizer Part 2', label: 'Phase 2 Deadline' },
  { date: 'Mar 1', project: 'Mass Timber Study', label: 'Texas Architect Submission' },
  { date: 'Mar 15', project: 'Phase 1 Research', label: 'Q1 Research Review' },
  { date: 'Apr 10', project: 'Immersive Learning', label: 'Conference Presentation' },
];

const Dashboard: React.FC = () => {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'in-progress' | 'completed' | 'future'>('in-progress');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Filter projects by status
  const myProjects = useMemo(() => {
    const filtered = projects.filter(p => {
      if (projectFilter === 'in-progress') return p.phase === 'Developmental';
      if (projectFilter === 'completed') return p.phase === 'Completed';
      if (projectFilter === 'future') return p.phase === 'Pre-Research';
      return true;
    });
    return filtered.slice(0, 4);
  }, [projects, projectFilter]);

  // February 2025 calendar data
  const daysInMonth = 28;
  const firstDayOfWeek = 6; // February 2025 starts on Saturday (0 = Sunday)
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Updates
  const updates = [
    { project: 'Modulizer Part 2', action: 'Phase completed', time: '2 hours ago' },
    { project: 'Mass Timber Study', action: 'New comment added', time: '5 hours ago' },
    { project: 'Phase 1 Research', action: 'Files uploaded', time: 'Yesterday' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-12 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-hero mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your research projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - My Projects */}
        <div className="lg:col-span-2 space-y-8">
          {/* My Projects */}
          <section>
            <h2 className="text-h3 mb-6">My Projects</h2>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'in-progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
                { id: 'future', label: 'Future' },
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setProjectFilter(filter.id as typeof projectFilter)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    projectFilter === filter.id
                      ? 'bg-white text-black'
                      : 'bg-transparent text-muted-foreground hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer group ${
                    selectedProject === project.id ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <span className="text-xs text-foreground-secondary mb-1">{project.phase}</span>
                    <h3 className="text-h4">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Post Update */}
          <section>
            <h2 className="text-h3 mb-6">Post Update</h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <textarea
                placeholder="Share a project update..."
                className="w-full bg-transparent text-white placeholder-muted-foreground resize-none h-24 focus:outline-none"
              />
              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-5 py-2 btn-cta text-sm font-medium rounded-full transition-colors">
                  Post
                </button>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-h3 mb-6">Updates</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {updates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <p className="text-meta mb-1">{update.project}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white">{update.action}</p>
                    <span className="text-body-subtle">{update.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column - Calendar */}
        <div className="space-y-6">
          {/* Key Milestones - Always visible */}
          <section>
            <h2 className="text-h3 mb-6">Upcoming</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {KEY_MILESTONES.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="text-right min-w-[60px]">
                    <p className="text-body font-medium">{milestone.date}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <p className="text-meta mb-1">{milestone.project}</p>
                    <p className="text-body">{milestone.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Calendar */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3">February 2025</h2>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              {/* Week days header */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-meta py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the 1st */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasEvents = CALENDAR_EVENTS[day];
                  const isSelected = selectedDate === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(hasEvents ? day : null)}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm transition-all relative ${
                        isSelected
                          ? 'bg-white text-black'
                          : hasEvents
                          ? 'text-white hover:bg-secondary'
                          : 'text-foreground-subtle hover:text-foreground-secondary'
                      }`}
                    >
                      {day}
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Events panel */}
          {selectedDate && CALENDAR_EVENTS[selectedDate] && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-h4 mb-4">
                February {selectedDate}
              </h3>
              <div className="space-y-2">
                {CALENDAR_EVENTS[selectedDate].map((event, i) => (
                  <div
                    key={i}
                    className="p-4 bg-card border border-border rounded-xl text-body hover:border-border transition-colors cursor-pointer"
                  >
                    {event}
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
