import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface MultipleChoiceInputProps {
  options: string[];
  selected: string[];
  maxSelections: number | null;
  onChange: (selected: string[]) => void;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

export function MultipleChoiceInput({
  options,
  selected,
  maxSelections,
  onChange,
  otherText,
  onOtherTextChange,
}: MultipleChoiceInputProps) {
  const isSingleSelect = maxSelections === 1;

  const handleToggle = (option: string) => {
    if (isSingleSelect) {
      onChange([option]);
      return;
    }

    const isSelected = selected.includes(option);
    if (isSelected) {
      onChange(selected.filter((s) => s !== option));
    } else {
      // Check max selections limit
      if (maxSelections && selected.length >= maxSelections) return;
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selected.includes(option);
        const isDisabled =
          !isSelected && !isSingleSelect && maxSelections != null && selected.length >= maxSelections;

        return (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => !isDisabled && handleToggle(option)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all ${
              isSelected
                ? 'bg-accent/20 border border-accent/50 text-white'
                : isDisabled
                  ? 'bg-white/5 border border-white/5 text-foreground-subtle cursor-not-allowed'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {/* Selection indicator */}
            <div
              className={`w-5 h-5 shrink-0 rounded-${isSingleSelect ? 'full' : 'md'} border flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-accent border-accent'
                  : 'border-white/20'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            {option}
          </motion.button>
        );
      })}
      {onOtherTextChange &&
        selected.some((s) => s.toLowerCase().startsWith('other')) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <textarea
              value={otherText || ''}
              onChange={(e) => onOtherTextChange(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Please specify..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-body placeholder:text-foreground-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </motion.div>
        )}
      {maxSelections && maxSelections > 1 && (
        <p className="text-meta mt-1">
          Select up to {maxSelections} ({selected.length}/{maxSelections})
        </p>
      )}
    </div>
  );
}
