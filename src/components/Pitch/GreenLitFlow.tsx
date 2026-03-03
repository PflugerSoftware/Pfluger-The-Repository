import { motion } from 'framer-motion';
import { Zap, Check, Loader2 } from 'lucide-react';
import { ScheduleCard } from './ScheduleCard';
import { calculateHoursPerWeek } from '../../views/Pitch/usePitchData';
import type { Pitch } from '../../services/pitchService';

interface GreenLitFlowProps {
  availableGreenlit: Pitch[];
  selectedPitch: Pitch | null;
  isSubmitting: boolean;
  onSelectPitch: (pitch: Pitch) => void;
  onClaim: () => void;
}

export function GreenLitFlow({
  availableGreenlit,
  selectedPitch,
  isSubmitting,
  onSelectPitch,
  onClaim,
}: GreenLitFlowProps) {
  return (
    <div className="flex gap-6">
      {/* Left: GreenLit List */}
      <div className="flex-1 min-w-0 h-full">
        <div className="bg-card border border-card rounded-2xl h-full flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800 shrink-0">
            <h2 className="text-lg font-bold text-white">Available GreenLit Pitches</h2>
            <p className="text-sm text-gray-500">Select a pre-approved pitch to claim</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {availableGreenlit.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No available greenlit pitches at the moment.
              </p>
            ) : (
              availableGreenlit.map((pitch) => {
                const isSelected = selectedPitch?.id === pitch.id;
                return (
                  <button
                    key={pitch.id}
                    onClick={() => onSelectPitch(pitch)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-green-900/30 border border-green-700'
                        : 'bg-gray-800/50 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{pitch.id}</span>
                      {pitch.scopeTier && (
                        <>
                          <span className="text-xs text-gray-600">-</span>
                          <span className="text-xs text-gray-400 capitalize">{pitch.scopeTier}</span>
                        </>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                    </div>
                    <h3 className={`font-medium mb-1 ${isSelected ? 'text-green-400' : 'text-white'}`}>
                      {pitch.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{pitch.researchIdea}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right: Selected pitch details + Claim button */}
      <div className="w-96 shrink-0 flex flex-col gap-4 h-full overflow-hidden">
        {selectedPitch ? (
          <>
            <div className="bg-card border border-card rounded-2xl p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Pre-Approved</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{selectedPitch.title}</h2>
              <p className="text-sm text-gray-400 mb-6">{selectedPitch.researchIdea}</p>
              <div className="space-y-4">
                {selectedPitch.scopeTier && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Scope</span>
                    <p className="text-white capitalize">{selectedPitch.scopeTier}</p>
                  </div>
                )}
                {selectedPitch.methodology && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Methodology</span>
                    <p className="text-white">{selectedPitch.methodology}</p>
                  </div>
                )}
                {selectedPitch.alignment && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Alignment</span>
                    <p className="text-white capitalize">{selectedPitch.alignment.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
            <ScheduleCard
              proposedScope={selectedPitch.scopeTier as 'simple' | 'medium' | 'complex' | ''}
              hoursPerWeek={selectedPitch.scopeTier && selectedPitch.timeline ? calculateHoursPerWeek(selectedPitch.scopeTier, selectedPitch.timeline) : undefined}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClaim}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-500 transition-all shrink-0 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Claim This Pitch
            </motion.button>
          </>
        ) : (
          <div className="bg-card border border-card rounded-2xl p-6 flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a pitch to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
