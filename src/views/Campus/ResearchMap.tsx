import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, BarChart3, ExternalLink, MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useProjects } from '../../context/ProjectsContext';
import type { ResearchProject } from '../../data/loadProjects';
import { useTheme } from '../../components/System/ThemeManager';
import { MAPBOX_TOKEN } from '../../config/mapbox';

mapboxgl.accessToken = MAPBOX_TOKEN;

// Projects that have interactive dashboards
const PROJECTS_WITH_DASHBOARDS = ['X25-RB02', 'X25-RB08'];

interface ResearchMapProps {
  onOpenProjectDashboard?: (projectId: string) => void;
}

const ResearchMap: React.FC<ResearchMapProps> = ({ onOpenProjectDashboard }) => {
  const { projects: researchProjects, loading } = useProjects();
  const { researchColors, componentThemes } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const initialized = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

  // Extract category colors from theme
  const categoryColors = Object.entries(researchColors).reduce((acc, [key, value]) => {
    acc[key] = value.color;
    return acc;
  }, {} as Record<string, string>);

  // Group projects by office
  const projectsByOffice = useMemo(() => {
    const filtered = researchProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.researcher.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const grouped: Record<string, ResearchProject[]> = {};
    filtered.forEach(project => {
      const office = project.office || 'Other';
      if (!grouped[office]) grouped[office] = [];
      grouped[office].push(project);
    });

    // Sort offices alphabetically
    const sorted: Record<string, ResearchProject[]> = {};
    Object.keys(grouped).sort().forEach(key => {
      sorted[key] = grouped[key];
    });

    return sorted;
  }, [researchProjects, searchTerm]);

  useEffect(() => {
    if (!mapContainer.current || initialized.current || loading) return;

    initialized.current = true;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-97.7431, 30.2672],
      zoom: 5,
      pitch: 30,
      bearing: 0,
      projection: 'mercator',
      antialias: true
    });

    map.current.on('style.load', () => {
      if (!map.current) return;
      map.current.setConfigProperty('basemap', 'lightPreset', 'night');

      // Hide POI labels and road labels
      try {
        map.current.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.current.setConfigProperty('basemap', 'showRoadLabels', false);
      } catch (e) {
        // Config not available
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initialized.current = false;
    };
  }, [loading]);

  // Add markers when projects load
  useEffect(() => {
    if (!map.current || researchProjects.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    researchProjects.forEach((project) => {
      const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
      const baseColor = categoryColors[project.category] || componentThemes.map.dark.confidentialColor;
      const color = isConfidential ? '#666666' : baseColor;

      const marker = new mapboxgl.Marker({
        color: color,
        scale: 1
      })
        .setLngLat([project.position[1], project.position[0]])
        .addTo(map.current!);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'research-popup'
      }).setHTML(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: ${color};">
            ${isConfidential ? 'CONFIDENTIAL' : project.title}
          </strong><br/>
          <span style="font-size: 11px; color: #999;">${project.id}</span>
        </div>
      `);

      marker.setPopup(popup);

      marker.getElement().addEventListener('click', () => {
        setSelectedProject(project);
        map.current?.flyTo({
          center: [project.position[1], project.position[0]],
          zoom: 11,
          pitch: 45,
          duration: 2000
        });
      });

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [researchProjects, categoryColors, componentThemes]);

  return (
    <div className="relative h-[calc(100vh-5rem)]">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Floating Glassmorphism Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 bottom-6 z-10 w-80 flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(24, 16, 25, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-white">Research Campus</h2>
          <p className="text-sm text-gray-500 mt-1">Projects by office</p>
        </div>

        {/* Search */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Project List by Office */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="space-y-6">
            {Object.entries(projectsByOffice).map(([office, projects]) => (
              <div key={office}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{office}</p>
                <div className="space-y-2">
                  {projects.map(project => {
                    const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
                    const markerColor = isConfidential ? '#666666' : categoryColors[project.category];

                    return (
                      <motion.div
                        key={project.id}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                        onClick={() => {
                          setSelectedProject(project);
                          map.current?.flyTo({
                            center: [project.position[1], project.position[0]],
                            zoom: 11,
                            pitch: 45,
                            duration: 2000
                          });
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: markerColor }}
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isConfidential ? 'text-gray-500' : 'text-white'}`}>
                            {isConfidential ? 'Confidential' : project.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{project.researcher}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-6 left-[22rem] bottom-6 z-20 w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(24, 16, 25, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="p-5 flex items-start justify-between border-b border-white/10">
              <div className="flex-1 min-w-0">
                {['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id) && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confidential</p>
                )}
                <h2 className={`text-xl font-bold truncate ${
                  ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id)
                    ? 'text-gray-400'
                    : 'text-white'
                }`}>{selectedProject.title}</h2>
                <p className="text-sm text-gray-500">{selectedProject.id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100%-5rem)]">
              {/* Researcher */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Researcher</p>
                <p className="text-white">{selectedProject.researcher}</p>
              </div>

              {/* Office */}
              {selectedProject.office && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-400">{selectedProject.office}</p>
                </div>
              )}

              {/* Phase */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Phase</p>
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                  {selectedProject.phase}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Timeline */}
              {(selectedProject.startDate || selectedProject.completionDate) && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
                  <div className="space-y-2">
                    {selectedProject.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">Started:</span>
                        <span className="text-white">{selectedProject.startDate}</span>
                      </div>
                    )}
                    {selectedProject.completionDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-white">{selectedProject.completionDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Partners */}
              {selectedProject.partners && selectedProject.partners.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Partners</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.partners.map(partner => (
                      <span
                        key={partner}
                        className="px-3 py-1 bg-white/10 text-sm text-gray-300 rounded-full"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* View Dashboard Button */}
              {PROJECTS_WITH_DASHBOARDS.includes(selectedProject.id) && onOpenProjectDashboard && (
                <motion.button
                  onClick={() => onOpenProjectDashboard(selectedProject.id)}
                  className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BarChart3 className="w-5 h-5" />
                  View Dashboard
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchMap;
