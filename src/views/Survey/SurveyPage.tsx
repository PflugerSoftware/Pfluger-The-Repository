import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../../config/mapbox';
import {
  getSurveyBySlug,
  getSurveyQuestions,
  submitSurveyResponse,
} from '../../services/surveyService';
import type {
  Survey,
  SurveyQuestion,
  SurveySubmissionAnswer,
  SurveySubmissionPin,
} from '../../services/surveyService';
import { SurveyProgress } from './components/SurveyProgress';
import { SurveyIntro } from './components/SurveyIntro';
import { SurveyQuestionView } from './components/SurveyQuestion';
import { SurveyThankYou } from './components/SurveyThankYou';

type Phase = 'loading' | 'intro' | 'question' | 'submitting' | 'thankyou' | 'error';

const PIN_COLOR_MAP: Record<string, string> = {
  green: '#10b981',
  yellow: '#fbbf24',
  red: '#ef4444',
};

export default function SurveyPage() {
  const { slug } = useParams<{ slug: string }>();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Survey state
  const [phase, setPhase] = useState<Phase>('loading');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [answers, setAnswers] = useState<Map<string, SurveySubmissionAnswer>>(new Map());
  const [errorMessage, setErrorMessage] = useState('');

  // Map state
  const [mapReady, setMapReady] = useState(false);
  const [mapDimmed, setMapDimmed] = useState(false);

  const currentQuestion = questions[currentIndex] || null;
  const currentAnswer = currentQuestion
    ? answers.get(currentQuestion.id) || {
        questionId: currentQuestion.id,
        answerChoices: [],
        pins: [],
      }
    : null;

  // Load survey data
  useEffect(() => {
    if (!slug) {
      setErrorMessage('No survey specified.');
      setPhase('error');
      return;
    }

    async function load() {
      const surveyData = await getSurveyBySlug(slug!);
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
  }, [slug]);

  // Initialize map
  useEffect(() => {
    if (!survey || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [survey.map_center_lng || -94.977375, survey.map_center_lat || 29.731609],
      zoom: survey.map_zoom || 16,
      pitch: 30,
      antialias: true,
    });

    m.on('style.load', () => {
      m.setConfigProperty('basemap', 'lightPreset', 'night');
      m.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    });

    m.on('load', () => {
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
      if (!currentQuestion?.is_map_based || !currentAnswer) return;

      const maxPins = currentQuestion.max_pins || 3;
      if ((currentAnswer.pins?.length || 0) >= maxPins) return;

      const newPin: SurveySubmissionPin = {
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
        color: 'green',
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
    if (phase !== 'question' || !currentQuestion?.is_map_based) return;

    map.current.on('click', handleMapClick);
    map.current.getCanvas().style.cursor = 'crosshair';

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        map.current.getCanvas().style.cursor = '';
      }
    };
  }, [phase, currentQuestion, handleMapClick, mapReady]);

  // Sync markers with current answer pins
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!map.current || !currentAnswer?.pins) return;

    for (const pin of currentAnswer.pins) {
      const marker = new mapboxgl.Marker({
        color: PIN_COLOR_MAP[pin.color] || '#10b981',
        scale: 0.85,
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

      markersRef.current.push(marker);
    }
  }, [currentAnswer?.pins]);

  // Dim/undim map based on current question type
  useEffect(() => {
    if (phase === 'question' && currentQuestion) {
      setMapDimmed(!currentQuestion.is_map_based);
    } else if (phase === 'intro') {
      setMapDimmed(false);
    } else {
      setMapDimmed(true);
    }
  }, [phase, currentQuestion]);

  // Navigation handlers
  const handleStart = (name: string, r: string) => {
    setFirstName(name);
    setRole(r);
    setCurrentIndex(0);
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
    if (currentIndex < questions.length - 1) {
      // Clear markers before moving to next question
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setCurrentIndex((i) => i + 1);
    } else {
      // Submit
      setPhase('submitting');
      const submission = {
        surveyId: survey!.id,
        projectId: survey!.project_id,
        firstName,
        role,
        answers: questions.map((q) => {
          const a = answers.get(q.id);
          return {
            questionId: q.id,
            answerText: a?.answerText,
            answerChoices: a?.answerChoices,
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
    if (currentIndex > 0) {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setCurrentIndex((i) => i - 1);
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
        className={`absolute inset-0 bg-black/50 pointer-events-none transition-opacity duration-500 ${
          mapDimmed ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Glass sidebar */}
      <div
        className="absolute top-4 left-4 bottom-4 w-96 z-10 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'rgba(24, 16, 25, 0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Progress bar */}
        {phase === 'question' && (
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
                      (currentQuestion.max_pins || 3)
                  }
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
