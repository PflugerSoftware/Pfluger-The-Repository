import { motion } from 'framer-motion';
import { CheckCircle, Send, Loader2 } from 'lucide-react';
import type { PitchData } from './PitchCard';

const SCOPE_HOURS: Record<string, string> = {
  simple: '20-60',
  medium: '60-120',
  complex: '120+',
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
      className="bg-card border border-card rounded-2xl h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-green-900/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pitch Ready for Review</h2>
            <p className="text-sm text-gray-400">Review your pitch before submitting</p>
          </div>
        </div>
      </div>

      {/* Pitch Summary */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Research Question</h3>
          <p className="text-white">{pitchData.researchIdea || 'Not specified'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Scope</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                pitchData.scopeTier === 'simple' ? 'bg-green-900/50 text-green-400' :
                pitchData.scopeTier === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                pitchData.scopeTier === 'complex' ? 'bg-red-900/50 text-red-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {pitchData.scopeTier || 'Not set'}
              </span>
              {pitchData.scopeTier && (
                <span className="text-xs text-gray-500">
                  ({SCOPE_HOURS[pitchData.scopeTier]} hours)
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Methodology</h3>
            <p className="text-white text-sm">{pitchData.methodology || 'Not specified'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Connection</h3>
          <p className="text-white text-sm capitalize">
            {pitchData.alignment === 'current-project' ? 'Connected to Current Project' :
             pitchData.alignment === 'prospected-project' ? 'Prospected Project (Future/Potential)' :
             pitchData.alignment === 'thought-leadership' ? 'Thought Leadership / General Research' :
             'Not specified'}
          </p>
        </div>

        {pitchData.projectName && (pitchData.alignment === 'current-project' || pitchData.alignment === 'prospected-project') && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Name/Number</h3>
            <p className="text-white text-sm">{pitchData.projectName}</p>
          </div>
        )}

        {pitchData.partners && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Partner/Organization</h3>
            <p className="text-white text-sm">{pitchData.partners}</p>
          </div>
        )}

        {pitchData.timeline && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</h3>
            <p className="text-white text-sm">{pitchData.timeline}</p>
          </div>
        )}

        {pitchData.impact && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Expected Impact</h3>
            <p className="text-white text-sm">{pitchData.impact}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-800 space-y-3">
        {submitError && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
            {submitError}
          </div>
        )}
        <motion.button
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
        >
          Continue editing
        </button>
      </div>
    </motion.div>
  );
}
