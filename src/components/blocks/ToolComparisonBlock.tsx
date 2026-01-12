import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import type { ToolComparisonData } from './types';

interface ToolComparisonBlockProps {
  data: ToolComparisonData;
}

function ActivityRing({ rating, color, size = 80, delay = 0 }: { rating: number; color: string; size?: number; delay?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rating / 100) * circumference;

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </svg>
      {/* Center value */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      >
        <span className="text-lg font-bold text-white">{rating}</span>
      </motion.div>
    </motion.div>
  );
}

export function ToolComparisonBlock({ data }: ToolComparisonBlockProps) {
  const { tools, columns = 3 } = data;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {tools.map((tool, index) => {
        const isExpanded = expandedId === tool.name;
        const hasProsOrCons = (tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0);

        return (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-card rounded-2xl overflow-hidden"
          >
            {/* Main card content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Activity Ring */}
                <ActivityRing rating={tool.rating} color={tool.color} delay={index * 0.1} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{tool.category}</p>
                  <div
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: tool.color + '20', color: tool.color }}
                  >
                    {tool.price}
                  </div>
                </div>
              </div>

              {tool.description && (
                <p className="text-sm text-gray-400 mt-4">{tool.description}</p>
              )}
            </div>

            {/* Expand button */}
            {hasProsOrCons && (
              <>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tool.name)}
                  className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-card"
                >
                  <span>{isExpanded ? 'Hide details' : 'Show pros & cons'}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                        {/* Pros */}
                        {tool.pros && tool.pros.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Pros</p>
                            <ul className="space-y-1.5">
                              {tool.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Cons */}
                        {tool.cons && tool.cons.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Cons</p>
                            <ul className="space-y-1.5">
                              {tool.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
