import { motion } from 'framer-motion';
import { MapPin, X, MousePointerClick } from 'lucide-react';
import type { SurveySubmissionPin } from '../../../services/surveyService';

interface MapPinPlacerProps {
  pins: SurveySubmissionPin[];
  maxPins: number;
  onUpdatePin: (index: number, pin: SurveySubmissionPin) => void;
  onRemovePin: (index: number) => void;
  isPlacingPin: boolean;
  categoryColor: string;
}

export function MapPinPlacer({
  pins,
  maxPins,
  onUpdatePin,
  onRemovePin,
  isPlacingPin,
  categoryColor,
}: MapPinPlacerProps) {
  const canAddMore = pins.length < maxPins;

  return (
    <div className="space-y-3">
      {/* Instruction */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{
            background: isPlacingPin ? `${categoryColor}20` : 'rgba(255, 255, 255, 0.05)',
            color: isPlacingPin ? categoryColor : 'rgba(156, 163, 175, 1)',
          }}
        >
          <MousePointerClick className="w-4 h-4 shrink-0" />
          <span>
            {isPlacingPin
              ? 'Click on the map to place a pin'
              : `Click the map to drop a pin (${pins.length}/${maxPins})`}
          </span>
        </motion.div>
      )}

      {/* Placed pins */}
      {pins.map((pin, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl space-y-2"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${categoryColor}30`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: categoryColor }} />
              <span className="text-xs text-gray-400">Pin {index + 1}</span>
            </div>
            <button
              onClick={() => onRemovePin(index)}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Note */}
          <textarea
            value={pin.note || ''}
            onChange={(e) => onUpdatePin(index, { ...pin, note: e.target.value })}
            maxLength={500}
            rows={2}
            placeholder="Add a note (optional)..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors resize-none"
            style={{ borderColor: `${categoryColor}30` }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${categoryColor}60`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = `${categoryColor}30`;
            }}
          />
        </motion.div>
      ))}

      {!canAddMore && pins.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Maximum pins reached ({maxPins})
        </p>
      )}
    </div>
  );
}
