import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../context/ProjectsContext';
import { hasProject } from '../../services/projects';

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
      projects: grouped[year].sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, '').slice(-2));
        const numB = parseInt(b.id.replace(/\D/g, '').slice(-2));
        return numB - numA;
      })
    }));
  }, [projects]);

  const handleProjectClick = (project: { id: string }) => {
    if (hasProject(project.id) && onOpenProjectDashboard) {
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
    <div>
      {projectsByYear.map(({ year, projects: yearProjects }) => (
        <section key={year}>
          {/* Year header */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold text-white py-10 px-8"
          >
            {year}
          </motion.h2>

          {/* Full-bleed grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {yearProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="group cursor-pointer relative aspect-video overflow-hidden border border-[#1a1a1a]"
                onClick={() => handleProjectClick(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Gradient - subtle, stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {project.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Portfolio;
