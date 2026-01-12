import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KennedyStudy } from '../../../data/projects/phase1Data';

interface CaseStudyFlowProps {
  study: KennedyStudy;
}

export default function CaseStudyFlow({ study }: CaseStudyFlowProps) {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{study.name}</h3>
        <p className="text-violet-100">{study.description}</p>
      </div>

      {/* Phase Navigation */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((activePhase + 1) / study.phases.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Phase Buttons */}
        <div className="relative flex justify-between">
          {study.phases.map((phase, i) => (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className="flex flex-col items-center"
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 transition-colors ${
                  i <= activePhase
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.div>
              <span className={`mt-2 text-xs font-medium max-w-[100px] text-center ${
                i === activePhase ? 'text-violet-600' : 'text-gray-500'
              }`}>
                {phase.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <span className="text-violet-600 font-bold">{activePhase + 1}</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{study.phases[activePhase].name}</h4>
              <p className="text-sm text-gray-500">{study.phases[activePhase].description}</p>
            </div>
          </div>

          {/* Findings */}
          {study.phases[activePhase].findings && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Key Findings
              </h5>
              <div className="space-y-2">
                {study.phases[activePhase].findings.map((finding, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg"
                  >
                    <span className="text-amber-500">⚠️</span>
                    <span className="text-sm text-amber-800">{finding}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {study.phases[activePhase].deliverables && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Deliverables
              </h5>
              <div className="flex flex-wrap gap-2">
                {study.phases[activePhase].deliverables.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    📄 {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interventions */}
          {study.phases[activePhase].interventions && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Design Interventions
              </h5>
              <div className="space-y-3">
                {study.phases[activePhase].interventions.map((intervention, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="font-medium text-gray-900 mb-1">{intervention.action}</div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <span>→</span>
                      <span>{intervention.impact}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes */}
          {study.phases[activePhase].outcomes && (
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Results
              </h5>
              <div className="space-y-2">
                {study.phases[activePhase].outcomes.map((outcome, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                  >
                    <span className="text-emerald-500">✓</span>
                    <span className="text-sm text-emerald-800">{outcome}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Analysis Grid Preview */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Simulation Matrix</h4>
        <p className="text-sm text-gray-500 mb-4">
          Illuminance analysis performed at key times across all seasons
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500"></th>
                {study.times.map((time) => (
                  <th key={time} className="py-2 px-3 font-medium text-gray-500 text-center">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {study.seasons.map((season, i) => (
                <tr key={season} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-700">{season}</td>
                  {study.times.map((time, j) => (
                    <td key={time} className="py-3 px-3 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (i * 3 + j) * 0.05 }}
                        className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium ${
                          (season === 'Summer' && time === '12pm')
                            ? 'bg-red-100 text-red-600'
                            : (season === 'Winter' && time === '5pm')
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {time === '12pm' ? '☀️' : time === '9am' ? '🌅' : '🌆'}
                      </motion.div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
