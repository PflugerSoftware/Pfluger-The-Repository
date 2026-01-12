import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { FeedbackSummaryData, FeedbackTheme } from './types';

interface FeedbackSummaryBlockProps {
  data: FeedbackSummaryData;
}

interface ActivityRingProps {
  score: number;
  color: string;
  size?: number;
}

function ActivityRing({ score, color, size = 120 }: ActivityRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
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
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}%</span>
      </div>
    </div>
  );
}

interface ThemeListProps {
  themes: FeedbackTheme[];
  color: string;
}

function ThemeList({ themes, color }: ThemeListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const maxMentions = Math.max(...themes.map(t => t.mentions));

  return (
    <div ref={ref} className="space-y-3">
      {themes.map((theme, index) => {
        const percentage = (theme.mentions / maxMentions) * 100;

        return (
          <div key={theme.theme} className="group">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white">{theme.theme}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {theme.mentions}x
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                </div>
              </div>
            </div>
            {theme.description && (
              <p className="text-xs text-gray-500 mt-1.5">{theme.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FeedbackSummaryBlock({ data }: FeedbackSummaryBlockProps) {
  const { positives, concerns } = data;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Positives (Yay) */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <ActivityRing score={positives.score} color="#10b981" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">
                {positives.title || 'What Excites'}
              </h4>
            </div>
            <p className="text-sm text-gray-400">
              {positives.themes.length} themes identified
            </p>
          </div>
        </div>
        <ThemeList themes={positives.themes} color="#10b981" />
      </div>

      {/* Concerns (Nay) */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <ActivityRing score={concerns.score} color="#ef4444" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-white">
                {concerns.title || 'Concerns Raised'}
              </h4>
            </div>
            <p className="text-sm text-gray-400">
              {concerns.themes.length} themes identified
            </p>
          </div>
        </div>
        <ThemeList themes={concerns.themes} color="#ef4444" />
      </div>
    </div>
  );
}
