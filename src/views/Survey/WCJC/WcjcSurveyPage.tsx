import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../../../config/mapbox';
import { getSectionConfig } from '../../../config/surveyCategories';
import {
  getSurveyBySlug,
  getSurveyQuestions,
  submitSurveyResponse,
} from '../../../services/surveyService';
import type {
  Survey,
  SurveyQuestion,
  SurveySubmissionAnswer,
  SurveySubmissionPin,
} from '../../../services/surveyService';
import { SurveyProgress } from './components/SurveyProgress';
import { SurveyIntro } from './components/SurveyIntro';
import { SurveyQuestionView } from './components/SurveyQuestion';
import { SurveyThankYou } from './components/SurveyThankYou';

type Phase = 'loading' | 'intro' | 'section-intro' | 'question' | 'submitting' | 'thankyou' | 'error';

// Richmond campus respondents have no relationship to the Main campus map,
// so map-based questions (Q4-Q12) are hidden from their flow.
function isQuestionSkipped(
  question: SurveyQuestion,
  questions: SurveyQuestion[],
  answers: Map<string, SurveySubmissionAnswer>
): boolean {
  if (!question.is_map_based) return false;
  const campusQ = questions.find((q) => q.question_order === 2);
  if (!campusQ) return false;
  const choices = answers.get(campusQ.id)?.answerChoices ?? [];
  return choices.includes('Richmond campus');
}

const SURVEY_SLUG = 'WhartonCountyJuniorCollegeMasterPlanSurvey2026';

export default function WcjcSurveyPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Survey state
  const [phase, setPhase] = useState<Phase>('loading');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [answers, setAnswers] = useState<Map<string, SurveySubmissionAnswer>>(new Map());
  const [errorMessage, setErrorMessage] = useState('');

  // Map state
  const [mapReady, setMapReady] = useState(false);
  const [mapDimmed, setMapDimmed] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);

  // Track which section we last showed
  const [lastShownSection, setLastShownSection] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex] || null;
  const currentSection = currentQuestion ? getSectionConfig(survey?.sections, currentQuestion.category) : null;

  const currentAnswer = currentQuestion
    ? answers.get(currentQuestion.id) || {
        questionId: currentQuestion.id,
        answerChoices: [],
        answerMatrix: {},
        answerRanking: [],
        pins: [],
      }
    : null;

  // Load survey data
  useEffect(() => {
    async function load() {
      const surveyData = await getSurveyBySlug(SURVEY_SLUG);
      if (!surveyData) {
        setErrorMessage('Survey not found or is no longer active.');
        setPhase('error');
        return;
      }

      const questionData = await getSurveyQuestions(surveyData.id);
      if (questionData.length === 0) {
        setErrorMessage('This survey has no questions configured yet.');
        setPhase('error');
        return;
      }

      setSurvey(surveyData);
      setQuestions(questionData);
      setPhase('intro');
    }

    load();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!survey || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [survey.map_center_lng || -94.977375, survey.map_center_lat || 29.731609],
      zoom: survey.map_zoom || 16,
      pitch: 0,
      antialias: true,
    });

    m.on('load', () => {
      // Site boundary - glowing red outline (if survey has boundary data)
      if (survey.boundary_polygon && survey.boundary_polygon.length > 2) {
        m.addSource('campus-boundary', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [survey.boundary_polygon] },
            properties: {},
          },
        });
        // Outer glow
        m.addLayer({
          id: 'campus-boundary-glow',
          type: 'line',
          source: 'campus-boundary',
          paint: {
            'line-color': '#EF4444',
            'line-width': 10,
            'line-opacity': 1,
            'line-blur': 8,
            'line-emissive-strength': 1,
          },
        });
        // Inner glow
        m.addLayer({
          id: 'campus-boundary-glow-inner',
          type: 'line',
          source: 'campus-boundary',
          paint: {
            'line-color': '#EF4444',
            'line-width': 5,
            'line-opacity': 1,
            'line-blur': 4,
            'line-emissive-strength': 1,
          },
        });
        // Core line
        m.addLayer({
          id: 'campus-boundary-line',
          type: 'line',
          source: 'campus-boundary',
          paint: {
            'line-color': '#EF4444',
            'line-width': 2,
            'line-opacity': 1,
            'line-emissive-strength': 1,
          },
        });
      }

      setMapReady(true);
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, [survey]);

  // Handle map click for pin placement
  const handleMapClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      if (!currentQuestion || !currentAnswer) return;

      // Only handle clicks for map-based questions or questions with allow_pin that have the panel open
      const isMapQuestion = currentQuestion.is_map_based;
      const isOptionalPin = currentQuestion.allow_pin;
      if (!isMapQuestion && !isOptionalPin) return;

      const maxPins = isMapQuestion ? (currentQuestion.max_pins || 10) : 1;
      if ((currentAnswer.pins?.length || 0) >= maxPins) return;

      const newPin: SurveySubmissionPin = {
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      };

      const updatedAnswer: SurveySubmissionAnswer = {
        ...currentAnswer,
        pins: [...(currentAnswer.pins || []), newPin],
      };

      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, updatedAnswer);
        return next;
      });
    },
    [currentQuestion, currentAnswer]
  );

  // Attach/detach map click handler
  useEffect(() => {
    if (!map.current || !mapReady) return;
    if (phase !== 'question') return;

    const shouldListen =
      currentQuestion?.is_map_based || currentQuestion?.allow_pin;
    if (!shouldListen) return;

    map.current.on('click', handleMapClick);
    map.current.getCanvas().style.cursor = 'crosshair';

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        map.current.getCanvas().style.cursor = '';
      }
    };
  }, [phase, currentQuestion, handleMapClick, mapReady]);

  // Sync markers with current answer pins (using category color, draggable)
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!map.current || !currentAnswer?.pins || !currentSection || !currentQuestion) return;

    for (let idx = 0; idx < currentAnswer.pins.length; idx++) {
      const pin = currentAnswer.pins[idx];
      const pinIndex = idx;

      const marker = new mapboxgl.Marker({
        color: currentSection.color,
        scale: 0.85,
        draggable: true,
      })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map.current);

      if (pin.note) {
        marker.setPopup(
          new mapboxgl.Popup({ closeButton: false, className: 'survey-pin-popup' }).setText(
            pin.note
          )
        );
      }

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setAnswers((prev) => {
          const next = new Map(prev);
          const existing = next.get(currentQuestion.id);
          if (!existing?.pins) return next;
          const updatedPins = [...existing.pins];
          updatedPins[pinIndex] = {
            ...updatedPins[pinIndex],
            latitude: lngLat.lat,
            longitude: lngLat.lng,
          };
          next.set(currentQuestion.id, { ...existing, pins: updatedPins });
          return next;
        });
      });

      markersRef.current.push(marker);
    }
  }, [currentAnswer?.pins, currentSection, currentQuestion]);

  // Dim/undim map based on current question type
  useEffect(() => {
    if (phase === 'question' && currentQuestion) {
      setMapDimmed(!currentQuestion.is_map_based && !currentQuestion.allow_pin);
    } else if (phase === 'intro') {
      setMapDimmed(false);
    } else if (phase === 'section-intro') {
      setMapDimmed(true);
    } else {
      setMapDimmed(true);
    }
  }, [phase, currentQuestion]);

  // Check if we need a section intro when moving to a new question
  const checkSectionTransition = useCallback(
    (targetIndex: number) => {
      const targetQuestion = questions[targetIndex];
      if (!targetQuestion?.category) return false;

      // Check if this section has skipIntro set
      const sectionConfig = getSectionConfig(survey?.sections, targetQuestion.category);
      if (sectionConfig.skipIntro) return false;

      // Show section intro if entering a new section
      if (targetQuestion.category !== lastShownSection) {
        setLastShownSection(targetQuestion.category);
        setCurrentIndex(targetIndex);
        setPhase('section-intro');
        return true;
      }
      return false;
    },
    [questions, lastShownSection, survey?.sections]
  );

  // Navigation handlers
  const handleStart = (name: string) => {
    setFirstName(name);
    setCurrentIndex(0);

    // Check if first section needs an intro
    const firstQ = questions[0];
    const firstSectionConfig = firstQ ? getSectionConfig(survey?.sections, firstQ.category) : null;
    if (firstQ?.category && firstSectionConfig && !firstSectionConfig.skipIntro) {
      setLastShownSection(firstQ.category);
      setPhase('section-intro');
    } else {
      setPhase('question');
    }
  };

  const handleSectionContinue = () => {
    setPhase('question');
  };

  const handleUpdateAnswer = (answer: SurveySubmissionAnswer) => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(currentQuestion.id, answer);
      return next;
    });
  };

  const handleNext = async () => {
    let nextIndex = currentIndex + 1;
    while (
      nextIndex < questions.length &&
      isQuestionSkipped(questions[nextIndex], questions, answers)
    ) {
      nextIndex++;
    }

    if (nextIndex < questions.length) {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setPanelExpanded(false);

      if (!checkSectionTransition(nextIndex)) {
        setCurrentIndex(nextIndex);
      }
    } else {
      // Submit - drop skipped questions so we don't write empty rows.
      // Role is read from Q1's answer (the relationship-to-WCJC question);
      // intro no longer collects it separately.
      setPhase('submitting');
      const relationshipQ = questions.find((q) => q.question_order === 1);
      const role = relationshipQ
        ? (answers.get(relationshipQ.id)?.answerChoices?.[0] ?? '')
        : '';
      const submission = {
        surveyId: survey!.id,
        projectId: survey!.project_id,
        firstName,
        role,
        answers: questions
          .filter((q) => !isQuestionSkipped(q, questions, answers))
          .map((q) => {
            const a = answers.get(q.id);
            return {
              questionId: q.id,
              answerText: a?.answerText,
              answerChoices: a?.answerChoices,
              answerMatrix: a?.answerMatrix,
              answerRanking: a?.answerRanking,
              pins: a?.pins,
            };
          }),
      };

      const result = await submitSurveyResponse(submission);
      if (result) {
        setPhase('thankyou');
      } else {
        setErrorMessage('Failed to submit. Please try again.');
        setPhase('error');
      }
    }
  };

  const handleBack = () => {
    setPanelExpanded(false);
    let prevIndex = currentIndex - 1;
    while (
      prevIndex >= 0 &&
      isQuestionSkipped(questions[prevIndex], questions, answers)
    ) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setCurrentIndex(prevIndex);
      setPhase('question');
    } else {
      setPhase('intro');
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map dim overlay for non-map questions */}
      <div
        className={`absolute inset-0 bg-black/90 pointer-events-none transition-opacity duration-500 ${
          mapDimmed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Glass panel - sidebar on desktop, full-screen or bottom-sheet on mobile */}
      <div
        className={`absolute z-10 overflow-hidden flex flex-col shadow-2xl transition-all duration-300
          left-0 right-0 bottom-0
          ${phase === 'question' && currentQuestion?.is_map_based
            ? panelExpanded ? 'top-1/3 rounded-t-2xl' : 'top-2/3 rounded-t-2xl'
            : 'top-0'}
          md:top-4 md:left-4 md:bottom-4 md:right-auto md:w-96 md:rounded-2xl
        `}
        style={{
          background: 'rgba(15, 15, 20, 0.65)',
          backdropFilter: 'blur(40px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Mobile drag handle - only on map questions */}
        {phase === 'question' && currentQuestion?.is_map_based && (
          <button
            onClick={() => setPanelExpanded((v) => !v)}
            className="md:hidden flex items-center justify-center pt-2 pb-1 w-full"
          >
            <div className="w-10 h-1 rounded-full bg-white/30" />
          </button>
        )}
        {/* Progress bar */}
        {(phase === 'question' || phase === 'section-intro') && (
          <div className="px-6 pt-4">
            <SurveyProgress
              current={currentIndex + 1}
              total={questions.length}
            />
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <div className="flex items-center justify-center h-full" key="loading">
                <div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
              </div>
            )}

            {phase === 'intro' && survey && (
              <SurveyIntro
                key="intro"
                survey={survey}
                onStart={handleStart}
              />
            )}

            {phase === 'section-intro' && currentSection && (
              <motion.div
                key={`section-${currentQuestion?.category}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full px-8 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: currentSection.lightColor }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: currentSection.color }}
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {currentSection.label}
                </h2>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-xs">
                  {currentSection.description}
                </p>
                <button
                  onClick={handleSectionContinue}
                  className="px-8 py-3 rounded-xl font-medium text-sm text-white transition-all hover:brightness-110"
                  style={{ background: currentSection.color }}
                >
                  Continue
                </button>
              </motion.div>
            )}

            {(phase === 'question' || phase === 'submitting') &&
              currentQuestion &&
              currentAnswer && (
                <SurveyQuestionView
                  key={currentQuestion.id}
                  question={currentQuestion}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  answer={currentAnswer}
                  onUpdateAnswer={handleUpdateAnswer}
                  onNext={handleNext}
                  onBack={handleBack}
                  isLast={currentIndex === questions.length - 1}
                  isSubmitting={phase === 'submitting'}
                  isPlacingPin={
                    phase === 'question' &&
                    !!currentQuestion.is_map_based &&
                    (currentAnswer.pins?.length || 0) <
                      (currentQuestion.max_pins || 10)
                  }
                  sections={survey?.sections}
                />
              )}

            {phase === 'thankyou' && survey && (
              <SurveyThankYou key="thanks" surveyTitle={survey.title} />
            )}

            {phase === 'error' && (
              <div
                key="error"
                className="flex flex-col items-center justify-center h-full px-6 text-center"
              >
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
