import { motion } from 'framer-motion';
import type { KeyStrategy, Conclusions } from '../../../data/projects/phase1Data';

interface StrategiesOverviewProps {
  strategies: KeyStrategy[];
  conclusions: Conclusions;
}

export default function StrategiesOverview({ strategies, conclusions }: StrategiesOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Key Strategies */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Strategies from Award Winners</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy, i) => (
            <motion.div
              key={strategy.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">{strategy.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
              <div className="text-sm text-emerald-600 font-medium">
                → {strategy.impact}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Finding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">💡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Key Finding</h3>
            <p className="text-violet-100 text-lg leading-relaxed">
              {conclusions.mainFinding}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Points */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Conclusions</h3>
        <div className="space-y-3">
          {conclusions.keyPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-bold text-sm">{i + 1}</span>
              </div>
              <p className="text-gray-700">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Phase & Future */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔮</span>
            <h4 className="font-semibold text-indigo-900">Next Phase</h4>
          </div>
          <p className="text-indigo-700">{conclusions.nextPhase}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏗️</span>
            <h4 className="font-semibold text-emerald-900">Future Project Alignment</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {conclusions.futureProjects.map((project) => (
              <span
                key={project}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium"
              >
                {project}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quote Block */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="p-6 bg-gray-50 rounded-2xl border-l-4 border-violet-500"
      >
        <p className="text-gray-700 italic text-lg leading-relaxed">
          "Performance modeling can't be an afterthought. When integrated early in the design process,
          it bridges the gap between what architects intend and what buildings actually deliver—creating
          schools that are both contextually grounded and environmentally efficient."
        </p>
        <p className="text-gray-500 mt-3 text-sm">— The Modelizer Phase 1 Research</p>
      </motion.div>
    </div>
  );
}
