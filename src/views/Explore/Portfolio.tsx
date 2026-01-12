import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../context/ProjectsContext';

const PROJECTS_WITH_DASHBOARDS = ['X24-RB01', 'X25-RB01', 'X25-RB02', 'X25-RB03', 'X25-RB05', 'X25-RB06', 'X25-RB08', 'X25-RB13', 'X00-DEMO'];

interface PortfolioProps {
  onOpenProjectDashboard?: (projectId: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onOpenProjectDashboard }) => {
  const { projects, loading } = useProjects();

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const grouped: { [year: string]: typeof projects } = {};

    projects.forEach(project => {
      // Extract year directly from date string to avoid timezone issues
      const year = project.startDate
        ? project.startDate.substring(0, 4)
        : 'Upcoming';

      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(project);
    });

    // Sort years descending (newest first), with 'Upcoming' at the end
    const sortedYears = Object.keys(grouped).sort((a, b) => {
      if (a === 'Upcoming') return 1;
      if (b === 'Upcoming') return -1;
      return parseInt(b) - parseInt(a);
    });

    return sortedYears.map(year => ({
      year,
      projects: grouped[year]
    }));
  }, [projects]);

  const handleProjectClick = (project: { id: string }) => {
    if (PROJECTS_WITH_DASHBOARDS.includes(project.id) && onOpenProjectDashboard) {
      onOpenProjectDashboard(project.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-8">
      {/* Projects grouped by year */}
      <div className="space-y-16">
        {projectsByYear.map(({ year, projects: yearProjects }) => (
          <section key={year}>
            {/* Year header */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl font-bold text-white mb-8"
            >
              {year}
            </motion.h2>

            {/* Projects grid - 3 wide */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Card with background image */}
                  <div className="relative h-72 rounded-2xl overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      {/* Title */}
                      <h3 className="text-xl font-medium text-white mb-1">
                        {project.title}
                      </h3>

                      {/* Project ID and Explore button */}
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold text-white tracking-tight">
                          {project.id}
                        </span>
                        <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
                          explore
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
