import { motion } from 'framer-motion';
import type { SourcesData } from './types';

interface SourcesBlockProps {
  data: SourcesData;
}

export function SourcesBlock({ data }: SourcesBlockProps) {
  const { sources } = data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {sources.map((source, index) => (
        <motion.div
          key={source.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-medium text-muted-foreground">
            {source.id}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body-muted">{source.title}</p>
            {source.author && (
              <p className="text-meta">{source.author}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
