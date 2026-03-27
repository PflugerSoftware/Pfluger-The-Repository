import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, MessageSquare } from 'lucide-react';
import type { SurveyQuestion as SurveyQuestionType, SurveySubmissionAnswer } from '../../../services/surveyService';
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { OpenEndedInput } from './OpenEndedInput';
import { MapPinPlacer } from './MapPinPlacer';

interface SurveyQuestionProps {
  question: SurveyQuestionType;
  questionNumber: number;
  totalQuestions: number;
  answer: SurveySubmissionAnswer;
  onUpdateAnswer: (answer: SurveySubmissionAnswer) => void;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
  isSubmitting: boolean;
  isPlacingPin: boolean;
}

export function SurveyQuestionView({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onUpdateAnswer,
  onNext,
  onBack,
  isLast,
  isSubmitting,
  isPlacingPin,
}: SurveyQuestionProps) {
  const canProceed = () => {
    if (!question.required) return true;
    // Map-based questions: pins count as a valid answer
    if (question.is_map_based && (answer.pins?.length || 0) > 0) return true;
    if (question.question_type === 'multiple_choice') {
      return (answer.answerChoices?.length || 0) > 0;
    }
    if (question.question_type === 'open_ended') {
      return (answer.answerText?.trim().length || 0) > 0;
    }
    return true;
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="flex flex-col h-full"
    >
      {/* Question header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)' }}>
            {question.is_map_based ? (
              <MapPin className="w-4 h-4 text-sky-400" />
            ) : (
              <MessageSquare className="w-4 h-4 text-sky-400" />
            )}
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white leading-snug">
          {question.question_text}
        </h2>
        {question.is_map_based && (
          <p className="text-xs text-gray-500 mt-2">
            Tap the map to drop a pin, then select a color and add a note.
          </p>
        )}
      </div>

      {/* Answer area */}
      <div className="flex-1 px-6 overflow-y-auto">
        {question.is_map_based && (
          <MapPinPlacer
            pins={answer.pins || []}
            maxPins={question.max_pins || 3}
            onUpdatePin={(index, pin) => {
              const newPins = [...(answer.pins || [])];
              newPins[index] = pin;
              onUpdateAnswer({ ...answer, pins: newPins });
            }}
            onRemovePin={(index) => {
              const newPins = [...(answer.pins || [])];
              newPins.splice(index, 1);
              onUpdateAnswer({ ...answer, pins: newPins });
            }}
            isPlacingPin={isPlacingPin}
          />
        )}

        {question.question_type === 'multiple_choice' && question.options && (
          <div className={question.is_map_based ? 'mt-4' : ''}>
            <MultipleChoiceInput
              options={question.options}
              selected={answer.answerChoices || []}
              maxSelections={question.max_selections}
              onChange={(choices) =>
                onUpdateAnswer({ ...answer, answerChoices: choices })
              }
            />
          </div>
        )}

        {question.question_type === 'open_ended' && (
          <OpenEndedInput
            value={answer.answerText || ''}
            onChange={(text) => onUpdateAnswer({ ...answer, answerText: text })}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed() || isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
            canProceed() && !isSubmitting
              ? 'bg-sky-500 text-white hover:bg-sky-400'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isLast ? (
            'Submit'
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
