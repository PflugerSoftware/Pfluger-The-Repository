interface OpenEndedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function OpenEndedInput({ value, onChange, placeholder }: OpenEndedInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={2000}
      rows={4}
      placeholder={placeholder || 'Type your answer...'}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:border-sky-500/50 focus:outline-none transition-colors resize-none"
    />
  );
}
