import { motion } from 'framer-motion';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface RankingInputProps {
  options: string[];
  ranked: string[];
  onChange: (ranked: string[]) => void;
  categoryColor: string;
}

export function RankingInput({
  options,
  ranked,
  onChange,
  categoryColor,
}: RankingInputProps) {
  // Items not yet ranked
  const unranked = options.filter((o) => !ranked.includes(o));

  const handleAdd = (item: string) => {
    onChange([...ranked, item]);
  };

  const handleRemove = (index: number) => {
    const next = [...ranked];
    next.splice(index, 1);
    onChange(next);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...ranked];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === ranked.length - 1) return;
    const next = [...ranked];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Ranked items */}
      {ranked.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Ranking</p>
          {ranked.map((item, index) => (
            <motion.div
              key={item}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{
                background: `${categoryColor}12`,
                border: `1px solid ${categoryColor}30`,
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${categoryColor}25`, color: categoryColor }}
              >
                {index + 1}
              </div>
              <GripVertical className="w-3.5 h-3.5 text-gray-600 shrink-0" />
              <span className="text-sm text-white flex-1">{item}</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === ranked.length - 1}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors text-xs ml-1"
                >
                  &times;
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Unranked items to add */}
      {unranked.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {ranked.length > 0 ? 'Tap to add' : 'Tap items in order of priority'}
          </p>
          {unranked.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleAdd(item)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center text-[10px] text-gray-600">
                {ranked.length + unranked.indexOf(item) + 1}
              </div>
              {item}
            </motion.button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        {ranked.length} of {options.length} ranked
      </p>
    </div>
  );
}
