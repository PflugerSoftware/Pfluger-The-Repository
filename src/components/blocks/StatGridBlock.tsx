import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { StatGridData } from './types';

interface StatGridBlockProps {
  data: StatGridData;
}

// Parse numeric value from string (handles "42.3", "75%", "120 hrs", etc.)
function parseNumericValue(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (match) {
    return {
      prefix: match[1],
      num: parseFloat(match[2]),
      suffix: match[3],
    };
  }
  return null;
}

interface AnimatedNumberProps {
  value: string;
  duration?: number;
  trigger?: boolean;
}

function AnimatedNumber({ value, duration = 1000, trigger = true }: AnimatedNumberProps) {
  const parsed = parseNumericValue(value);
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (!parsed) return;

    // Reset to 0 when leaving view
    if (!trigger) {
      setDisplayNum(0);
      return;
    }

    const startTime = Date.now();
    const startNum = 0;
    const endNum = parsed.num;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startNum + (endNum - startNum) * eased;

      setDisplayNum(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [trigger, value, duration, parsed?.num]);

  if (!parsed) {
    // Non-numeric value, just display as-is
    return <span>{value}</span>;
  }

  const hasDecimal = parsed.num % 1 !== 0;
  const displayValue = hasDecimal ? displayNum.toFixed(1) : Math.round(displayNum);

  return (
    <span>
      {parsed.prefix}
      {displayValue}
      {parsed.suffix}
    </span>
  );
}

export function StatGridBlock({ data }: StatGridBlockProps) {
  const { stats } = data;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-100px' });

  return (
    <div ref={ref} className="flex flex-wrap justify-between gap-y-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <p className="text-5xl font-bold text-white tracking-tight mb-1">
            <AnimatedNumber value={stat.value} duration={1200 + index * 100} trigger={isInView} />
          </p>
          <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
          {stat.detail && (
            <p className="text-xs text-gray-600 mt-1">{stat.detail}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
