import { motion } from 'framer-motion';

interface SurveyProgressProps {
  current: number;
  total: number;
}

export function SurveyProgress({ current, total }: SurveyProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-sky-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      />
    </div>
  );
}
