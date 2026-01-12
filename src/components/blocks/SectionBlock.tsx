import { motion } from 'framer-motion';
import type { SectionData } from './types';

interface SectionBlockProps {
  data: SectionData;
}

export function SectionBlock({ data }: SectionBlockProps) {
  const { title, sources } = data;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-8 flex items-center justify-between gap-4"
    >
      <h2 className="text-5xl font-bold text-white">{title}</h2>
      {sources && sources.length > 0 && (
        <div className="flex items-center gap-2">
          {sources.map((sourceId) => (
            <div
              key={sourceId}
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-gray-400"
            >
              {sourceId}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
