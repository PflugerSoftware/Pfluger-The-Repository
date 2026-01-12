import { motion } from 'framer-motion';
import { Quote as QuoteIcon, Star } from 'lucide-react';
import type { QuotesData } from './types';

interface QuotesBlockProps {
  data: QuotesData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export function QuotesBlock({ data }: QuotesBlockProps) {
  const { quotes, columns = 2 } = data;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {quotes.map((quote, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative bg-white/5 border border-white/10 rounded-xl p-5 group hover:bg-white/[0.07] transition-colors"
        >
          {/* Quote icon */}
          <div className="absolute -top-3 -left-2">
            <div className="w-8 h-8 bg-sky-500/20 rounded-full flex items-center justify-center">
              <QuoteIcon className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* Quote text */}
          <blockquote className="text-white text-sm leading-relaxed mb-4 pt-2">
            "{quote.text}"
          </blockquote>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {quote.rating && <StarRating rating={quote.rating} />}
              {quote.source && (
                <span className="text-xs text-gray-500">{quote.source}</span>
              )}
            </div>
            {quote.author && (
              <span className="text-xs text-gray-400">- {quote.author}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
