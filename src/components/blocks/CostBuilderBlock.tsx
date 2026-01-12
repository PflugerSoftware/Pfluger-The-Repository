import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { interpolate } from 'd3-interpolate';
import type { CostBuilderData, CostAlternate } from './types';

interface CostBuilderBlockProps {
  data: CostBuilderData;
}

export function CostBuilderBlock({ data }: CostBuilderBlockProps) {
  const { alternates, baseTotal, area } = data;
  const [selectedAlternates, setSelectedAlternates] = useState<number[]>([]);
  const [animatedTotal, setAnimatedTotal] = useState(baseTotal);

  const currentTotal = baseTotal + selectedAlternates.reduce((sum, id) => {
    const alt = alternates.find(a => a.id === id);
    return sum + (alt?.amount || 0);
  }, 0);

  const costPerSF = currentTotal / area;

  // Animate the total with d3-interpolate
  useEffect(() => {
    const interpolator = interpolate(animatedTotal, currentTotal);
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
      setAnimatedTotal(interpolator(eased));

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentTotal]);

  const toggleAlternate = (id: number) => {
    setSelectedAlternates(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const addAlternates = alternates.filter(a => a.type === 'add');
  const deductAlternates = alternates.filter(a => a.type === 'deduct');

  const differenceFromBase = currentTotal - baseTotal;
  const percentChange = ((currentTotal - baseTotal) / baseTotal) * 100;

  return (
    <div className="w-full">
      {/* Total Display */}
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-white/10"
        layout
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Estimated Total</p>
            <motion.p className="text-4xl font-bold text-white">
              {formatCurrency(Math.round(animatedTotal))}
            </motion.p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Cost per SF</p>
              <p className="text-xl font-semibold text-white">${costPerSF.toFixed(2)}/SF</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">vs Base</p>
              <motion.p
                className={`text-xl font-semibold ${
                  differenceFromBase > 0
                    ? 'text-red-400'
                    : differenceFromBase < 0
                    ? 'text-green-400'
                    : 'text-gray-400'
                }`}
                key={differenceFromBase}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {differenceFromBase >= 0 ? '+' : ''}
                {formatCurrency(differenceFromBase)}
                <span className="text-sm ml-1">
                  ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                </span>
              </motion.p>
            </div>
          </div>
        </div>

        {/* Visual bar showing position */}
        <div className="mt-6">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
            {/* Base marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: '50%' }}
            />

            {/* Current position */}
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: differenceFromBase > 0 ? '#f87171' : differenceFromBase < 0 ? '#4ade80' : '#60a5fa',
              }}
              animate={{
                width: `${Math.min(100, Math.max(5, (currentTotal / (baseTotal * 2)) * 100))}%`,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>Base: {formatCurrency(baseTotal)}</span>
            <span>{formatCurrency(baseTotal * 2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Alternates Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Alternates */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-sm">+</span>
            Add Alternates
          </h3>
          <div className="space-y-3">
            {addAlternates.map((alt) => (
              <AlternateCard
                key={alt.id}
                alternate={alt}
                isSelected={selectedAlternates.includes(alt.id)}
                onToggle={() => toggleAlternate(alt.id)}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        </div>

        {/* Deduct Alternates */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm">-</span>
            Deduct Alternates
          </h3>
          <div className="space-y-3">
            {deductAlternates.map((alt) => (
              <AlternateCard
                key={alt.id}
                alternate={alt}
                isSelected={selectedAlternates.includes(alt.id)}
                onToggle={() => toggleAlternate(alt.id)}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <AnimatePresence>
        {selectedAlternates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => setSelectedAlternates([])}
              className="text-gray-400 hover:text-white text-sm underline transition-colors"
            >
              Reset to Base Budget
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AlternateCardProps {
  alternate: CostAlternate;
  isSelected: boolean;
  onToggle: () => void;
  formatCurrency: (value: number) => string;
}

function AlternateCard({ alternate, isSelected, onToggle, formatCurrency }: AlternateCardProps) {
  const isAdd = alternate.type === 'add';

  return (
    <motion.button
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
        isSelected
          ? isAdd
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-green-500/50 bg-green-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-white text-sm">
            Alt {alternate.id}: {alternate.description}
          </p>
          <p className={`text-lg font-semibold mt-1 ${
            isAdd ? 'text-red-400' : 'text-green-400'
          }`}>
            {isAdd ? '+' : ''}{formatCurrency(alternate.amount)}
          </p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          isSelected
            ? isAdd
              ? 'bg-red-500 border-red-500'
              : 'bg-green-500 border-green-500'
            : 'border-gray-500'
        }`}>
          {isSelected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>
    </motion.button>
  );
}
