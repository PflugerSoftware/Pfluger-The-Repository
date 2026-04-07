import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, MessageSquare, MousePointerClick, X } from 'lucide-react';
import type { SurveyQuestion as SurveyQuestionType, SurveySubmissionAnswer, SurveySectionConfig } from '../../../services/surveyService';
import { getSectionConfig } from '../../../config/surveyCategories';
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { OpenEndedInput } from './OpenEndedInput';
import { MapPinPlacer } from './MapPinPlacer';
import { MatrixLikertInput } from './MatrixLikertInput';
import { RankingInput } from './RankingInput';

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
  sections?: SurveySectionConfig[] | null;
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
  sections,
}: SurveyQuestionProps) {
  const [showPinPanel, setShowPinPanel] = useState(!question.is_map_based && question.allow_pin);
  const section = getSectionConfig(sections, question.category);

  const canProceed = () => {
    if (!question.required) return true;

    // Map-based questions (Part 1): pins count as a valid answer
    if (question.is_map_based) {
      return (answer.pins?.length || 0) > 0;
    }

    switch (question.question_type) {
      case 'multiple_choice':
      case 'likert_single':
        return (answer.answerChoices?.length || 0) > 0;
      case 'open_ended':
        return (answer.answerText?.trim().length || 0) > 0;
      case 'matrix_likert':
        // All sub-items must be rated
        return (
          question.sub_items != null &&
          Object.keys(answer.answerMatrix || {}).length >= question.sub_items.length
        );
      case 'ranking':
        // All items must be ranked
        return (
          question.options != null &&
          (answer.answerRanking?.length || 0) >= question.options.length
        );
      default:
        return true;
    }
  };

  // Part 2 questions with allow_pin show an optional pin toggle
  const showOptionalPin = !question.is_map_based && question.allow_pin;

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
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: section.lightColor }}
          >
            {question.is_map_based ? (
              <MapPin className="w-4 h-4" style={{ color: section.color }} />
            ) : (
              <MessageSquare className="w-4 h-4" style={{ color: section.color }} />
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: section.color }}>
              {section.label}
            </span>
          </div>
          <span className="text-xs text-gray-600">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white leading-snug">
          {question.question_text}
        </h2>
      </div>

      {/* Answer area */}
      <div className="flex-1 px-6 overflow-y-auto pb-2">
        {/* Part 1: Map-based pin placement */}
        {question.is_map_based && (
          <MapPinPlacer
            pins={answer.pins || []}
            maxPins={question.max_pins || 10}
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
            accentColor={section.color}
          />
        )}

        {/* Multiple choice */}
        {(question.question_type === 'multiple_choice' || question.question_type === 'likert_single') &&
          question.options && (
            <div className={question.is_map_based ? 'mt-4' : ''}>
              <MultipleChoiceInput
                options={question.options}
                selected={answer.answerChoices || []}
                maxSelections={question.question_type === 'likert_single' ? 1 : question.max_selections}
                onChange={(choices) => {
                  const update: typeof answer = { ...answer, answerChoices: choices };
                  if (!choices.some((c) => c.toLowerCase().startsWith('other'))) {
                    update.answerText = '';
                  }
                  onUpdateAnswer(update);
                }}
                otherText={answer.answerText}
                onOtherTextChange={(text) =>
                  onUpdateAnswer({ ...answer, answerText: text })
                }
              />
            </div>
          )}

        {/* Open ended (skip for map-based questions, they use pins + notes only) */}
        {question.question_type === 'open_ended' && !question.is_map_based && (
          <OpenEndedInput
            value={answer.answerText || ''}
            onChange={(text) => onUpdateAnswer({ ...answer, answerText: text })}
          />
        )}

        {/* Matrix / Likert */}
        {question.question_type === 'matrix_likert' &&
          question.sub_items &&
          question.scale_labels && (
            <MatrixLikertInput
              subItems={question.sub_items}
              scaleLabels={question.scale_labels}
              selected={answer.answerMatrix || {}}
              onChange={(matrix) =>
                onUpdateAnswer({ ...answer, answerMatrix: matrix })
              }
              categoryColor={section.color}
            />
          )}

        {/* Ranking */}
        {question.question_type === 'ranking' && question.options && (
          <RankingInput
            options={question.options}
            ranked={answer.answerRanking || []}
            onChange={(ranking) =>
              onUpdateAnswer({ ...answer, answerRanking: ranking })
            }
            categoryColor={section.color}
          />
        )}

        {/* Optional pin panel for Part 2 questions */}
        {showOptionalPin && (
          <div className="mt-4">
            {!showPinPanel ? (
              <button
                onClick={() => setShowPinPanel(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 hover:bg-white/8"
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                Pin a location on the map (optional)
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: section.color }} />
                    Map Pin (optional)
                  </span>
                  <button
                    onClick={() => {
                      setShowPinPanel(false);
                      onUpdateAnswer({ ...answer, pins: [] });
                    }}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <MapPinPlacer
                  pins={answer.pins || []}
                  maxPins={1}
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
                  isPlacingPin={(answer.pins?.length || 0) < 1}
                  accentColor={section.color}
                />
              </div>
            )}
          </div>
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
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all"
          style={
            canProceed() && !isSubmitting
              ? {
                  background: section.color,
                  color: '#fff',
                }
              : {
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(107, 114, 128, 1)',
                  cursor: 'not-allowed',
                }
          }
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
