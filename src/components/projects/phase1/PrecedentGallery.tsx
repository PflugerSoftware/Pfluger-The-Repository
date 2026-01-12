import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PrecedentProject } from '../../../data/projects/phase1Data';

interface PrecedentGalleryProps {
  projects: PrecedentProject[];
}

export default function PrecedentGallery({ projects }: PrecedentGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<PrecedentProject | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'education', label: 'Education' },
    { id: 'other', label: 'Other Sectors' },
  ];

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'education') return p.type === undefined;
    return p.type !== undefined;
  });

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project, i) => (
          <motion.button
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedProject(project)}
            className="text-left p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: project.color }}
              >
                {project.name.charAt(0)}
              </div>
              {project.awards && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {project.awards.length} Award{project.awards.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{project.location}</p>

            {project.strategies && (
              <div className="space-y-1">
                {project.strategies.slice(0, 2).map((strategy, j) => (
                  <div key={j} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="text-emerald-500">→</span>
                    {strategy.name}
                  </div>
                ))}
                {project.strategies.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{project.strategies.length - 2} more strategies
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{project.architect}</span>
              <span>{project.year}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div
                className="p-6 sticky top-0 z-10"
                style={{ backgroundColor: selectedProject.color + '15' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <p className="text-gray-600">{selectedProject.location} • {selectedProject.architect}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{selectedProject.year}</div>
                    <div className="text-xs text-gray-500">Year</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{selectedProject.size}</div>
                    <div className="text-xs text-gray-500">Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{selectedProject.stories || selectedProject.type || '-'}</div>
                    <div className="text-xs text-gray-500">{selectedProject.stories ? 'Stories' : 'Type'}</div>
                  </div>
                </div>

                {/* Awards */}
                {selectedProject.awards && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Awards</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.awards.map((award, i) => (
                        <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">
                          🏆 {award}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategies */}
                {selectedProject.strategies && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Massing & Orientation Strategies</h4>
                    <div className="space-y-3">
                      {selectedProject.strategies.map((strategy, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-xl">
                          <div className="font-medium text-gray-900 mb-1">{strategy.name}</div>
                          <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <span>→</span>
                            <span className="font-medium">{strategy.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {selectedProject.metrics && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProject.metrics.eui && (
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">{selectedProject.metrics.eui}</div>
                          <div className="text-xs text-blue-600">kBtu/sf/yr EUI</div>
                        </div>
                      )}
                      {selectedProject.metrics.carbonReduction && (
                        <div className="p-3 bg-emerald-50 rounded-xl">
                          <div className="text-2xl font-bold text-emerald-600">{selectedProject.metrics.carbonReduction}</div>
                          <div className="text-xs text-emerald-600">Carbon Reduction</div>
                        </div>
                      )}
                      {selectedProject.metrics.renewable && (
                        <div className="p-3 bg-amber-50 rounded-xl col-span-2">
                          <div className="text-lg font-bold text-amber-600">{selectedProject.metrics.renewable}</div>
                          <div className="text-xs text-amber-600">Renewable Energy</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                {selectedProject.features && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
