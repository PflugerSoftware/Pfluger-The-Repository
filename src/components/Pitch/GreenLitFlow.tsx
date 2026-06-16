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
        <div className="bg-card border border-border rounded-2xl h-full flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border shrink-0">
            <h2 className="text-h4 font-bold">Available GreenLit Pitches</h2>
            <p className="text-body-subtle">Select a pre-approved pitch to claim</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {availableGreenlit.length === 0 ? (
              <p className="text-body-subtle text-center py-8">
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
                        ? 'bg-success/30 border border-success'
                        : 'bg-secondary/50 border border-transparent hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-code">{pitch.id}</span>
                      {pitch.scopeTier && (
                        <>
                          <span className="text-meta">-</span>
                          <span className="text-caption capitalize">{pitch.scopeTier}</span>
                        </>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-success ml-auto" />}
                    </div>
                    <h3 className={`font-medium mb-1 ${isSelected ? 'text-success' : 'text-white'}`}>
                      {pitch.title}
                    </h3>
                    <p className="text-meta line-clamp-2">{pitch.researchIdea}</p>
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
            <div className="bg-card border border-border rounded-2xl p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-success" />
                <span className="text-label font-semibold text-success tracking-wider">Pre-Approved</span>
              </div>
              <h2 className="text-title font-bold mb-2">{selectedPitch.title}</h2>
              <p className="text-body-muted mb-6">{selectedPitch.researchIdea}</p>
              <div className="space-y-4">
                {selectedPitch.scopeTier && (
                  <div>
                    <span className="text-meta font-semibold uppercase">Scope</span>
                    <p className="text-white capitalize">{selectedPitch.scopeTier}</p>
                  </div>
                )}
                {selectedPitch.methodology && (
                  <div>
                    <span className="text-meta font-semibold uppercase">Methodology</span>
                    <p className="text-white">{selectedPitch.methodology}</p>
                  </div>
                )}
                {selectedPitch.alignment && (
                  <div>
                    <span className="text-meta font-semibold uppercase">Alignment</span>
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-success text-white hover:bg-success/80 transition-all shrink-0 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Claim This Pitch
            </motion.button>
          </>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 flex-1 flex items-center justify-center">
            <div className="text-center text-foreground-subtle">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a pitch to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
