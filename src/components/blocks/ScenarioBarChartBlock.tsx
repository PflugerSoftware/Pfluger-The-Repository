import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ScenarioBarChartData } from './types';

interface ScenarioBarChartBlockProps {
  data: ScenarioBarChartData;
}

export function ScenarioBarChartBlock({ data }: ScenarioBarChartBlockProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showCostPerSF, setShowCostPerSF] = useState(false);

  const { scenarios, baseTotal } = data;

  const maxValue = Math.max(...scenarios.map(s => s.total));
  const maxCostPerSF = Math.max(...scenarios.map(s => s.costPerSF));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBarColor = (scenario: { total: number }) => {
    if (scenario.total > baseTotal) return 'hsl(var(--destructive))'; // over budget
    if (scenario.total < baseTotal) return 'hsl(var(--success))';     // under budget
    return 'hsl(var(--info))';                                        // base
  };

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setShowCostPerSF(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !showCostPerSF ? 'bg-white/10 shadow text-white' : 'text-muted-foreground'
            }`}
          >
            Total Cost
          </button>
          <button
            onClick={() => setShowCostPerSF(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showCostPerSF ? 'bg-white/10 shadow text-white' : 'text-muted-foreground'
            }`}
          >
            Cost per SF
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {scenarios.map((scenario, index) => {
          const value = showCostPerSF ? scenario.costPerSF : scenario.total;
          const max = showCostPerSF ? maxCostPerSF : maxValue;
          const percentage = (value / max) * 100;
          const color = getBarColor(scenario);

          return (
            <motion.div
              key={scenario.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              className="group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-body font-medium">
                  {scenario.name}
                </span>
                <motion.span
                  key={`${scenario.name}-${showCostPerSF}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-semibold text-foreground"
                >
                  {showCostPerSF
                    ? `$${scenario.costPerSF.toFixed(2)}/SF`
                    : formatCurrency(scenario.total)
                  }
                </motion.span>
              </div>

              <div className="h-10 bg-white/5 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full rounded-lg"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${percentage}%`,
                    filter: hoveredBar === index ? 'brightness(1.2)' : 'brightness(1)',
                  }}
                  transition={{
                    width: { duration: 0.8, delay: index * 0.1, ease: 'easeOut' },
                    filter: { duration: 0.2 },
                  }}
                />

                {/* Difference indicator */}
                {index > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredBar === index ? 1 : 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-badge bg-black/60 px-2 py-1 rounded"
                  >
                    {scenario.total > baseTotal ? '+' : ''}
                    {formatCurrency(scenario.total - baseTotal)}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-body-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-info" />
          <span>Base</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span>Over Base</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success" />
          <span>Under Base</span>
        </div>
      </div>
    </div>
  );
}
