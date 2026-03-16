import { CheckCircle } from 'lucide-react';
import { PitchChatPanel } from './PitchChatPanel';
import { PitchFinalReview } from './PitchFinalReview';
import { ScheduleCard } from './ScheduleCard';
import { calculateHoursPerWeek } from '../../views/Pitch/usePitchData';
import type { PitchData } from './PitchCard';
import type { ExtractedPitch } from '../../services/pitchAgent';

const PITCH_STEPS = [
  { id: 'idea', label: 'Research Idea', description: 'What do you want to explore?' },
  { id: 'goal', label: 'Goal & Outcome', description: 'What will you create?' },
  { id: 'scope', label: 'Scope & Method', description: 'How will you approach it?' },
  { id: 'details', label: 'Timeline & Partners', description: 'When and with whom?' },
  { id: 'submit', label: 'Submit', description: 'Ready for review' },
];

// Each step is independently checkable — steps can complete out of order
// as Ezra's conversation flow doesn't always match the checklist order.
function getStepCompletion(pitchData: PitchData): boolean[] {
  return [
    !!pitchData.researchIdea,                         // Research Idea
    !!pitchData.impact,                               // Goal & Outcome (deliverable)
    !!pitchData.methodology,                          // Scope & Method
    !!pitchData.timeline,                             // Timeline & Partners
    false,                                            // Submit (always manual)
  ];
}

function getCurrentStep(pitchData: PitchData): number {
  const completion = getStepCompletion(pitchData);
  const firstIncomplete = completion.findIndex(c => !c);
  return firstIncomplete === -1 ? completion.length : firstIncomplete;
}

interface PitchBuilderProps {
  pitchData: PitchData;
  isPitchComplete: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  chatMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  draftPitchId?: string;
  userId?: string;
  onPitchUpdate: (extracted: ExtractedPitch) => void;
  onMessagesChange: (msgs: Array<{ id: string; role: 'user' | 'assistant'; content: string }>) => void;
  onSubmit: () => void;
  onContinueEditing: () => void;
}

export function PitchBuilder({
  pitchData,
  isPitchComplete,
  isSubmitting,
  submitError,
  chatMessages,
  draftPitchId,
  userId,
  onPitchUpdate,
  onMessagesChange,
  onSubmit,
  onContinueEditing,
}: PitchBuilderProps) {
  if (isPitchComplete) {
    return (
      <div className="flex gap-6 max-w-3xl mx-auto">
        <div className="flex-1 min-w-0">
          <PitchFinalReview
            pitchData={pitchData}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={onSubmit}
            onContinueEditing={onContinueEditing}
          />
        </div>
      </div>
    );
  }

  const completed = getStepCompletion(pitchData);
  const currentStep = getCurrentStep(pitchData);

  return (
    <div className="flex gap-6">
      {/* Left: Chat Panel */}
      <div className="flex-1 min-w-0">
        <PitchChatPanel
          pitchId={draftPitchId}
          userId={userId}
          onPitchUpdate={onPitchUpdate}
          initialMessages={chatMessages}
          onMessagesChange={onMessagesChange}
        />
      </div>

      {/* Right: Progress Sidebar */}
      <div className="w-72 shrink-0 h-full">
        <div className="bg-card border border-card rounded-2xl p-4 h-full flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Pitch Progress</h3>
          <div className="space-y-3 flex-1">
            {PITCH_STEPS.map((step, index) => {
              const isComplete = completed[index];
              const isCurrent = index === currentStep;
              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                    isComplete ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-sky-500 text-white' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isComplete || isCurrent ? 'text-white' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <ScheduleCard
              proposedScope={pitchData.scopeTier as 'simple' | 'medium' | 'complex' | ''}
              hoursPerWeek={pitchData.scopeTier && pitchData.timeline ? calculateHoursPerWeek(pitchData.scopeTier, pitchData.timeline) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
