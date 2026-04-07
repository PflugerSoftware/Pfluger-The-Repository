import { motion } from 'framer-motion';
import { MapPin, X, MousePointerClick } from 'lucide-react';
import type { SurveySubmissionPin } from '../../../services/surveyService';

interface MapPinPlacerProps {
  pins: SurveySubmissionPin[];
  maxPins: number;
  onUpdatePin: (index: number, pin: SurveySubmissionPin) => void;
  onRemovePin: (index: number) => void;
  isPlacingPin: boolean;
  accentColor: string;
}

export function MapPinPlacer({
  pins,
  maxPins,
  onUpdatePin,
  onRemovePin,
  isPlacingPin,
  accentColor,
}: MapPinPlacerProps) {
  const canAddMore = pins.length < maxPins;

  return (
    <div className="space-y-3">
      {/* Instruction */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: isPlacingPin ? `${accentColor}20` : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
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
          className="p-3 rounded-xl space-y-3"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${accentColor}30`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm" style={{ color: '#ffffff' }}>Pin {index + 1}</span>
            </div>
            <button
              onClick={() => onRemovePin(index)}
              className="p-1 hover:text-red-400 transition-colors"
              style={{ color: '#ffffff' }}
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
            placeholder="Add a note..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-white/50 focus:outline-none transition-colors resize-none"
            style={{ color: '#ffffff', borderColor: `${accentColor}30` }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${accentColor}60`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = `${accentColor}30`;
            }}
          />
        </motion.div>
      ))}

      {!canAddMore && pins.length > 0 && (
        <p className="text-sm text-center" style={{ color: '#ffffff' }}>
          Maximum pins reached ({maxPins})
        </p>
      )}
    </div>
  );
}
