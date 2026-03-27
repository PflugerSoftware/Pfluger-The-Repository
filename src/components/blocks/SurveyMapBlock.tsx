import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Layers, Eye, Filter, Users, MessageSquare } from 'lucide-react';
import { MAPBOX_TOKEN } from '../../config/mapbox';
import {
  getSurveyPins,
  getSurveyStats,
  getSurveyQuestionsWithCounts,
  getQuestionResults,
  getPinStats,
} from '../../services/surveyService';
import type {
  SurveyPin,
  SurveyQuestion,
  SurveyStats,
  AnswerDistribution,
  PinStats,
} from '../../services/surveyService';
import type { SurveyMapData } from './types';

const PIN_COLORS: Record<string, string> = {
  green: '#10b981',
  yellow: '#fbbf24',
  red: '#ef4444',
};

interface SurveyMapBlockProps {
  data: SurveyMapData;
}

export function SurveyMapBlock({ data }: SurveyMapBlockProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [mapReady, setMapReady] = useState(false);
  const [viewMode, setViewMode] = useState<'pins' | 'heatmap'>(data.default_view || 'pins');
  const [questions, setQuestions] = useState<Array<SurveyQuestion & { answerCount: number }>>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [pins, setPins] = useState<SurveyPin[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [pinStats, setPinStats] = useState<PinStats>({ total: 0, green: 0, yellow: 0, red: 0 });
  const [distribution, setDistribution] = useState<AnswerDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function load() {
      const [questionsData, statsData, pinsData] = await Promise.all([
        getSurveyQuestionsWithCounts(data.survey_id),
        getSurveyStats(data.survey_id),
        getSurveyPins(data.survey_id),
      ]);
      setQuestions(questionsData);
      setStats(statsData);
      setPins(pinsData);
      setPinStats(getPinStats(pinsData));
      setLoading(false);
    }
    load();
  }, [data.survey_id]);

  // Reload pins and distribution when question filter changes
  useEffect(() => {
    async function reload() {
      const pinsData = await getSurveyPins(data.survey_id, selectedQuestionId);
      setPins(pinsData);
      setPinStats(getPinStats(pinsData));

      if (selectedQuestionId) {
        const dist = await getQuestionResults(selectedQuestionId);
        setDistribution(dist);
      } else {
        setDistribution(null);
      }
    }
    if (!loading) reload();
  }, [selectedQuestionId, data.survey_id, loading]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [data.map_center_lng, data.map_center_lat],
      zoom: data.map_zoom || 16,
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

    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapRef.current = m;

    return () => {
      m.remove();
      mapRef.current = null;
    };
  }, [data.map_center_lat, data.map_center_lng, data.map_zoom]);

  // Render pins or heatmap
  const renderPinMarkers = useCallback(() => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!mapRef.current || viewMode !== 'pins') return;

    for (const pin of pins) {
      const marker = new mapboxgl.Marker({
        color: PIN_COLORS[pin.color] || '#10b981',
        scale: 0.7,
      })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(mapRef.current);

      if (pin.note) {
        marker.setPopup(
          new mapboxgl.Popup({ closeButton: false, maxWidth: '240px' }).setHTML(
            `<div style="font-size:12px;color:#333;padding:2px"><strong style="color:#666">${pin.color}</strong><br/>${pin.note.replace(/</g, '&lt;')}</div>`
          )
        );
        marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
        marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());
      }

      markersRef.current.push(marker);
    }
  }, [pins, viewMode]);

  const renderHeatmap = useCallback(() => {
    if (!mapRef.current || !mapReady) return;

    // Remove existing heatmap layer/source
    if (mapRef.current.getLayer('survey-heatmap')) {
      mapRef.current.removeLayer('survey-heatmap');
    }
    if (mapRef.current.getSource('survey-pins')) {
      mapRef.current.removeSource('survey-pins');
    }

    if (viewMode !== 'heatmap' || pins.length === 0) return;

    mapRef.current.addSource('survey-pins', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: pins.map((pin) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [pin.longitude, pin.latitude],
          },
          properties: { color: pin.color },
        })),
      },
    });

    mapRef.current.addLayer({
      id: 'survey-heatmap',
      type: 'heatmap',
      source: 'survey-pins',
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 12, 1, 18, 3],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 12, 15, 18, 30],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,0,0)',
          0.2, '#3b82f6',
          0.4, '#8b5cf6',
          0.6, '#f59e0b',
          0.8, '#ef4444',
          1, '#ffffff',
        ],
        'heatmap-opacity': 0.8,
      },
    });
  }, [pins, viewMode, mapReady]);

  // Re-render when pins or viewMode change
  useEffect(() => {
    renderPinMarkers();
    renderHeatmap();
  }, [renderPinMarkers, renderHeatmap]);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden border border-white/10">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Glass sidebar */}
      <div
        className="absolute top-3 left-3 bottom-3 w-80 z-10 rounded-xl overflow-y-auto"
        style={{
          background: 'rgba(24, 16, 25, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Survey Analytics</h3>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pins')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'pins'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              Pins
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              Heatmap
            </button>
          </div>

          {/* Question filter */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Filter by Question</span>
            </div>
            <select
              value={selectedQuestionId || ''}
              onChange={(e) => setSelectedQuestionId(e.target.value || null)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500/50 appearance-none cursor-pointer"
            >
              <option value="">All Questions</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  Q{q.question_order}: {q.question_text.slice(0, 40)}
                  {q.question_text.length > 40 ? '...' : ''} ({q.answerCount})
                </option>
              ))}
            </select>
          </div>

          {/* Response stats */}
          {stats && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">Responses</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-white">{stats.totalResponses}</p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
                <div className="p-2.5 bg-white/5 rounded-lg">
                  <p className="text-lg font-bold text-white">{stats.completedResponses}</p>
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
              </div>
              {/* Role breakdown */}
              <div className="mt-2 space-y-1">
                {Object.entries(stats.roleBreakdown).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{role}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-sky-500/60 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(count / stats.totalResponses) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pin color breakdown */}
          {pinStats.total > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs text-gray-500">Pin Sentiment</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Positive', color: '#10b981', count: pinStats.green },
                  { label: 'Neutral', color: '#fbbf24', count: pinStats.yellow },
                  { label: 'Negative', color: '#ef4444', count: pinStats.red },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-400 flex-1">{item.label}</span>
                    <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${pinStats.total > 0 ? (item.count / pinStats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{pinStats.total} total pins</p>
            </div>
          )}

          {/* Answer distribution for selected question */}
          {distribution && selectedQuestion && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">Answers</span>
              </div>

              {distribution.questionType === 'multiple_choice' &&
                Object.keys(distribution.choiceCounts).length > 0 && (
                  <div className="space-y-1.5">
                    {Object.entries(distribution.choiceCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([choice, count]) => (
                        <div key={choice} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 truncate max-w-[160px]">
                              {choice}
                            </span>
                            <span className="text-xs text-gray-500">
                              {count} ({Math.round((count / distribution.totalAnswers) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-sky-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / distribution.totalAnswers) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

              {distribution.questionType === 'open_ended' &&
                distribution.openEndedAnswers.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {distribution.openEndedAnswers.slice(0, 10).map((answer, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-white/5 rounded-lg text-xs text-gray-300"
                      >
                        "{answer}"
                      </div>
                    ))}
                    {distribution.openEndedAnswers.length > 10 && (
                      <p className="text-[10px] text-gray-600">
                        +{distribution.openEndedAnswers.length - 10} more responses
                      </p>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Empty state */}
          {!loading && pinStats.total === 0 && stats?.totalResponses === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500">No responses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
