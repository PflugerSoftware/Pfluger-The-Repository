import { motion } from 'framer-motion';

interface MatrixLikertInputProps {
  subItems: string[];
  scaleLabels: string[];
  selected: Record<string, string>;
  onChange: (selected: Record<string, string>) => void;
  categoryColor: string;
}

export function MatrixLikertInput({
  subItems,
  scaleLabels,
  selected,
  onChange,
  categoryColor,
}: MatrixLikertInputProps) {
  const handleSelect = (subItem: string, label: string) => {
    onChange({ ...selected, [subItem]: label });
  };

  return (
    <div className="space-y-3">
      {/* Scale legend (sticky at top on scroll) */}
      <div className="flex items-center gap-1.5 justify-end pr-1 mb-1">
        {scaleLabels.map((label) => (
          <span
            key={label}
            className="text-[10px] text-gray-500 text-center w-14 leading-tight"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Sub-items */}
      {subItems.map((item, index) => {
        const isAnswered = item in selected;

        return (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`p-3 rounded-xl transition-all ${
              isAnswered ? 'bg-white/8' : 'bg-white/[0.03]'
            }`}
            style={{
              border: isAnswered
                ? `1px solid ${categoryColor}30`
                : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <p className="text-sm text-gray-300 mb-2.5 leading-snug">{item}</p>
            <div className="flex items-center gap-1.5 justify-end">
              {scaleLabels.map((label) => {
                const isSelected = selected[item] === label;

                return (
                  <button
                    key={label}
                    onClick={() => handleSelect(item, label)}
                    className="w-14 h-8 rounded-lg text-[10px] font-medium transition-all"
                    style={{
                      background: isSelected ? `${categoryColor}25` : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected
                        ? `1px solid ${categoryColor}60`
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? categoryColor : 'rgba(156, 163, 175, 1)',
                    }}
                    title={label}
                  >
                    {isSelected ? '\u2713' : '\u00B7'}
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Completion hint */}
      <p className="text-xs text-gray-500 text-center mt-1">
        {Object.keys(selected).length} of {subItems.length} rated
      </p>
    </div>
  );
}
