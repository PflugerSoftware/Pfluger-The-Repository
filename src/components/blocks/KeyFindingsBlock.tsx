import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, DollarSign, Zap, Target, Award } from 'lucide-react';
import type { KeyFindingsData } from './types';

const iconMap: Record<string, typeof Lightbulb> = {
  lightbulb: Lightbulb,
  trend: TrendingUp,
  dollar: DollarSign,
  energy: Zap,
  target: Target,
  award: Award,
};

interface KeyFindingsBlockProps {
  data: KeyFindingsData;
}

export function KeyFindingsBlock({ data }: KeyFindingsBlockProps) {
  const { findings } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {findings.map((finding, index) => {
        const Icon = iconMap[finding.icon || 'lightbulb'] || Lightbulb;

        return (
          <motion.div
            key={finding.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-5 bg-card border border-card rounded-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{finding.title}</p>
              <p className="text-2xl font-bold text-white mb-1">{finding.value}</p>
              <p className="text-xs text-gray-500">{finding.detail}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
