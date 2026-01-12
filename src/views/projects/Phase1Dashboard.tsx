import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  ToolsComparison,
  PrecedentGallery,
  CaseStudyFlow,
  StrategiesOverview,
} from '../../components/projects/phase1';
import {
  projectInfo,
  energyTools,
  precedentProjects,
  kennedyStudy,
  keyStrategies,
  conclusions,
} from '../../data/projects/phase1Data';

interface Phase1DashboardProps {
  onBack?: () => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'tools', label: 'Modeling Tools', icon: '🛠️' },
  { id: 'precedents', label: 'Precedents', icon: '🏆' },
  { id: 'casestudy', label: 'Case Study', icon: '🔬' },
];

export default function Phase1Dashboard({ onBack }: Phase1DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {onBack && (
                  <motion.button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                )}
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📐</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                      {projectInfo.name}
                    </h1>
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                      {projectInfo.code}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{projectInfo.subtitle} — {projectInfo.context}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{projectInfo.researcher}</div>
                <div className="text-gray-500 text-xs">Researcher</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{projectInfo.totalHours} hrs</div>
                <div className="text-gray-500 text-xs">{projectInfo.researchType}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-4 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-violet-600 bg-white border-t border-x border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="phase1ActiveTab"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-white"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <section className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Research Overview
                    </h2>
                    <p className="text-gray-500">
                      Key strategies and conclusions from literature review and precedent analysis
                    </p>
                  </div>
                  <StrategiesOverview
                    strategies={keyStrategies}
                    conclusions={conclusions}
                  />
                </div>
              </section>
            )}

            {activeTab === 'tools' && (
              <section className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Energy Modeling Tools Comparison
                    </h2>
                    <p className="text-gray-500">
                      Evaluation of tools for early-stage sustainability modeling
                    </p>
                  </div>
                  <ToolsComparison tools={energyTools} />
                </div>
              </section>
            )}

            {activeTab === 'precedents' && (
              <section className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Award-Winning Precedent Projects
                    </h2>
                    <p className="text-gray-500">
                      CAE & COTE award winners demonstrating effective massing strategies
                    </p>
                  </div>
                  <PrecedentGallery projects={precedentProjects} />
                </div>
              </section>
            )}

            {activeTab === 'casestudy' && (
              <section className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200/50 p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Kennedy Elementary Case Study
                    </h2>
                    <p className="text-gray-500">
                      Iterative simulation workflow from base model to refined design
                    </p>
                  </div>
                  <CaseStudyFlow study={kennedyStudy} />
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
