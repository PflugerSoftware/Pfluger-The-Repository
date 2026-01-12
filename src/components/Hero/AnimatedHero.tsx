import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = [
  'explore',
  'create',
  'wonder',
  'connect',
  'innovate',
  'discover'
];

interface AnimatedHeroProps {
  onCycleComplete?: () => void;
}

export function AnimatedHero({ onCycleComplete }: AnimatedHeroProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);

  // Ramping intervals - starts VERY slow, accelerates dramatically
  const intervals = [2500, 1800, 1200, 700, 350, 150];

  useEffect(() => {
    const currentInterval = intervals[currentWordIndex] || 200;

    const timeout = setTimeout(() => {
      setCurrentWordIndex((prev) => {
        const nextIndex = (prev + 1) % ROTATING_WORDS.length;

        // Check if we've completed one full cycle
        if (nextIndex === 0 && !hasCompletedCycle) {
          setHasCompletedCycle(true);
          // Wait for the last word to be visible before hiding
          setTimeout(() => {
            if (onCycleComplete) {
              onCycleComplete();
            }
          }, 200);
        }

        return nextIndex;
      });
    }, currentInterval);

    return () => clearTimeout(timeout);
  }, [currentWordIndex, hasCompletedCycle, onCycleComplete]);

  return (
    <div className="w-full h-[40vh] flex items-center justify-center bg-background px-12">
      <div className="flex items-center gap-8">
        {/* Static "Lets" text */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-9xl font-medium text-white"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Lets
        </motion.h1>

        {/* Rotating words container */}
        <div className="relative h-40 w-[600px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentWordIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="text-9xl font-bold text-white absolute left-0"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {ROTATING_WORDS[currentWordIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
