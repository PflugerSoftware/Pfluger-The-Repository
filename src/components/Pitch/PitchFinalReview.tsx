import { motion } from 'framer-motion';
import { CheckCircle, Send, Loader2 } from 'lucide-react';
import type { PitchData } from './PitchCard';

const SCOPE_HOURS: Record<string, string> = {
  simple: '8-20',
  medium: '20-40',
  complex: '40-80',
};

interface PitchFinalReviewProps {
  pitchData: PitchData;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
  onContinueEditing: () => void;
}

export function PitchFinalReview({
  pitchData,
  isSubmitting,
  submitError,
  onSubmit,
  onContinueEditing,
}: PitchFinalReviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-2xl h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-success/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-title font-bold">Pitch Ready for Review</h2>
            <p className="text-body-muted">Review your pitch before submitting</p>
          </div>
        </div>
      </div>

      {/* Pitch Summary */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-label font-semibold mb-2">Research Question</h3>
          <p className="text-white">{pitchData.researchIdea || 'Not specified'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-label font-semibold mb-2">Scope</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                pitchData.scopeTier === 'simple' ? 'bg-success/50 text-success' :
                pitchData.scopeTier === 'medium' ? 'bg-neutral/50 text-neutral' :
                pitchData.scopeTier === 'complex' ? 'bg-destructive/50 text-destructive' :
                'bg-secondary text-muted-foreground'
              }`}>
                {pitchData.scopeTier || 'Not set'}
              </span>
              {pitchData.scopeTier && (
                <span className="text-meta">
                  ({SCOPE_HOURS[pitchData.scopeTier]} hours)
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-label font-semibold mb-2">Methodology</h3>
            <p className="text-body">{pitchData.methodology || 'Not specified'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-label font-semibold mb-2">Project Connection</h3>
          <p className="text-body capitalize">
            {pitchData.alignment === 'current-project' ? 'Connected to Current Project' :
             pitchData.alignment === 'prospected-project' ? 'Prospected Project (Future/Potential)' :
             pitchData.alignment === 'thought-leadership' ? 'Thought Leadership / General Research' :
             'Not specified'}
          </p>
        </div>

        {pitchData.projectName && (pitchData.alignment === 'current-project' || pitchData.alignment === 'prospected-project') && (
          <div>
            <h3 className="text-label font-semibold mb-2">Project Name/Number</h3>
            <p className="text-body">{pitchData.projectName}</p>
          </div>
        )}

        {pitchData.partners && (
          <div>
            <h3 className="text-label font-semibold mb-2">Partner/Organization</h3>
            <p className="text-body">{pitchData.partners}</p>
          </div>
        )}

        {pitchData.timeline && (
          <div>
            <h3 className="text-label font-semibold mb-2">Timeline</h3>
            <p className="text-body">{pitchData.timeline}</p>
          </div>
        )}

        {pitchData.impact && (
          <div>
            <h3 className="text-label font-semibold mb-2">Expected Impact</h3>
            <p className="text-body">{pitchData.impact}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border space-y-3">
        {submitError && (
          <div className="p-3 rounded-lg bg-destructive/30 border border-destructive text-destructive text-sm">
            {submitError}
          </div>
        )}
        <motion.button
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-success text-white hover:bg-success/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Pitch
            </>
          )}
        </motion.button>
        <button
          onClick={onContinueEditing}
          disabled={isSubmitting}
          className="w-full text-center text-body-subtle hover:text-foreground transition-colors disabled:opacity-50"
        >
          Continue editing
        </button>
      </div>
    </motion.div>
  );
}
