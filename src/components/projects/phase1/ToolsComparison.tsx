import { useState } from 'react';
import { motion } from 'framer-motion';
import type { EnergyTool } from '../../../data/projects/phase1Data';

interface ToolsComparisonProps {
  tools: EnergyTool[];
}

function ToolCard({ tool }: { tool: EnergyTool }) {
  return (
    <motion.div
      key={tool.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-6"
        style={{ backgroundColor: tool.color + '10' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{tool.platform}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(tool.rating) ? 'text-amber-400' : 'text-gray-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{tool.rating}/5</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            tool.pricing === "Free"
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tool.pricing}
          </span>
          <span className="text-sm text-gray-500">{tool.bestFor}</span>
        </div>
      </div>

      {/* Evaluation Tools */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Evaluation Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          {tool.evaluationTools.map((evalTool) => (
            <span
              key={evalTool}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
            >
              {evalTool}
            </span>
          ))}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="p-6 grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3">
            ✓ Pros
          </h4>
          <ul className="space-y-2">
            {tool.pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
            ✗ Cons
          </h4>
          <ul className="space-y-2">
            {tool.cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function ToolsComparison({ tools }: ToolsComparisonProps) {
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTool, setCompareTool] = useState<EnergyTool | null>(null);

  return (
    <div className="space-y-6">
      {/* Tool Selector */}
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => {
              if (compareMode && selectedTool.id !== tool.id) {
                setCompareTool(tool);
              } else {
                setSelectedTool(tool);
                setCompareTool(null);
              }
            }}
            className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              selectedTool.id === tool.id || compareTool?.id === tool.id
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
            style={{
              backgroundColor: selectedTool.id === tool.id || compareTool?.id === tool.id
                ? tool.color
                : undefined,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tool.name}
            {tool.pricing === "Free" && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedTool.id === tool.id ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Free
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Compare Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setCompareMode(!compareMode);
            setCompareTool(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            compareMode
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {compareMode ? '✓ Compare Mode' : 'Compare Tools'}
        </button>
        {compareMode && !compareTool && (
          <span className="text-sm text-gray-500">Select another tool to compare</span>
        )}
      </div>

      {/* Tool Details */}
      <div className={`grid gap-6 ${compareTool ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        <ToolCard tool={selectedTool} />
        {compareTool && <ToolCard tool={compareTool} />}
      </div>

      {/* Quick Comparison Table */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-500">Tool</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Best For</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool, i) => (
                <motion.tr
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-b border-gray-100 cursor-pointer hover:bg-white transition-colors ${
                    selectedTool.id === tool.id ? 'bg-white' : ''
                  }`}
                  onClick={() => setSelectedTool(tool)}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tool.color }}
                      />
                      <span className="font-medium text-gray-900">{tool.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tool.bestFor}</td>
                  <td className="py-3 px-4">
                    <span className={tool.pricing === "Free" ? 'text-emerald-600 font-medium' : 'text-gray-600'}>
                      {tool.pricing === "Free" ? "Free" : tool.pricing.split("/")[0]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= Math.round(tool.rating) ? 'text-amber-400' : 'text-gray-200'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500">{tool.rating}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
