import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, Layers, Eye, Filter, Users, MessageSquare, Building2, Satellite } from 'lucide-react';
import { MAPBOX_TOKEN, MAPBOX_STYLES } from '../../config/mapbox';
import { getCategoryConfig } from '../../config/surveyCategories';
import {
  getSurveyPins,
  getSurveyStats,
  getSurveyQuestionsWithCounts,
  getQuestionResults,
} from '../../services/surveyService';
import type {
  SurveyPin,
  SurveyQuestion,
  SurveyStats,
  AnswerDistribution,
} from '../../services/surveyService';
import type { SurveyMapData } from './types';

interface SurveyMapBlockProps {
  data: SurveyMapData;
}

export function SurveyMapBlock({ data }: SurveyMapBlockProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [mapReady, setMapReady] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [showContour, setShowContour] = useState(false);
  const [mapMode, setMapMode] = useState<'3d' | 'satellite'>('3d');
  const [questions, setQuestions] = useState<Array<SurveyQuestion & { answerCount: number }>>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [pins, setPins] = useState<SurveyPin[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [distribution, setDistribution] = useState<AnswerDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  // Build question -> category lookup for pin coloring
  const questionCategoryMap: Record<string, string | null> = {};
  for (const q of questions) {
    questionCategoryMap[q.id] = q.category;
  }

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
      setLoading(false);
    }
    load();
  }, [data.survey_id]);

  // Reload pins and distribution when question filter changes
  useEffect(() => {
    async function reload() {
      const pinsData = await getSurveyPins(data.survey_id, selectedQuestionId);
      setPins(pinsData);

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
      logoPosition: 'bottom-left',
      attributionControl: false,
    });
    m.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

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

  // Switch map style and camera when mapMode changes
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !mapReady) return;

    const center: [number, number] = [data.map_center_lng, data.map_center_lat];
    const zoom = data.map_zoom || 16;

    if (mapMode === 'satellite') {
      m.setStyle(MAPBOX_STYLES.satellite);
      m.easeTo({ center, zoom, pitch: 0, bearing: 0, duration: 800 });
    } else {
      m.setStyle(MAPBOX_STYLES.standardNight);
      m.easeTo({ center, zoom, pitch: 30, bearing: 0, duration: 800 });
    }

    m.once('style.load', () => {
      if (mapMode === '3d') {
        m.setConfigProperty('basemap', 'lightPreset', 'night');
        m.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      }
      renderPinMarkers();
      renderHeatmap();
    });
  }, [mapMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render pins colored by category
  const renderPinMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!mapRef.current || !showPins) return;

    for (const pin of pins) {
      const cat = questionCategoryMap[pin.question_id] || null;
      const config = getCategoryConfig(cat);

      const marker = new mapboxgl.Marker({
        color: config.color,
        scale: 0.7,
      })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(mapRef.current);

      if (pin.note) {
        marker.setPopup(
          new mapboxgl.Popup({ closeButton: false }).setText(pin.note)
        );
      }

      markersRef.current.push(marker);
    }
  }, [pins, showPins, questionCategoryMap]);

  const renderHeatmap = useCallback(() => {
    if (!mapRef.current || !mapReady) return;

    const layerIds = ['survey-contour-fill', 'survey-contour-line'];
    for (const id of layerIds) {
      if (mapRef.current.getLayer(id)) mapRef.current.removeLayer(id);
    }
    if (mapRef.current.getSource('survey-contour')) {
      mapRef.current.removeSource('survey-contour');
    }

    if (!showContour || pins.length < 3) return;

    // For contour, use pin density (all pins equal weight)
    const pts = pins.map((p) => ({
      lng: p.longitude,
      lat: p.latitude,
      val: 1,
    }));

    // Convex hull (Graham scan)
    function cross(o: { lng: number; lat: number }, a: { lng: number; lat: number }, b: { lng: number; lat: number }) {
      return (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
    }
    const sorted = [...pts].sort((a, b) => a.lng - b.lng || a.lat - b.lat);
    const lower: typeof pts = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper: typeof pts = [];
    for (const p of sorted.reverse()) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    upper.pop();
    lower.pop();
    const hull = [...lower, ...upper];

    const cx = hull.reduce((s, p) => s + p.lng, 0) / hull.length;
    const cy = hull.reduce((s, p) => s + p.lat, 0) / hull.length;
    const expandedHull = hull.map((p) => ({
      lng: cx + (p.lng - cx) * 1.15,
      lat: cy + (p.lat - cy) * 1.15,
    }));

    const minLng = Math.min(...expandedHull.map((p) => p.lng));
    const maxLng = Math.max(...expandedHull.map((p) => p.lng));
    const minLat = Math.min(...expandedHull.map((p) => p.lat));
    const maxLat = Math.max(...expandedHull.map((p) => p.lat));
    const gridRes = 40;
    const stepLng = (maxLng - minLng) / gridRes;
    const stepLat = (maxLat - minLat) / gridRes;

    function insideHull(lng: number, lat: number) {
      let inside = false;
      for (let i = 0, j = expandedHull.length - 1; i < expandedHull.length; j = i++) {
        const xi = expandedHull[i].lng, yi = expandedHull[i].lat;
        const xj = expandedHull[j].lng, yj = expandedHull[j].lat;
        if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }

    function idw(lng: number, lat: number): number {
      let wSum = 0;
      let vSum = 0;
      const power = 2;
      for (const p of pts) {
        const dx = (p.lng - lng) * 111320 * Math.cos((lat * Math.PI) / 180);
        const dy = (p.lat - lat) * 110540;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) return p.val;
        const w = 1 / Math.pow(dist, power);
        wSum += w;
        vSum += w * p.val;
      }
      return wSum > 0 ? vSum / wSum : 0;
    }

    const features: GeoJSON.Feature[] = [];
    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        const cLng = minLng + (i + 0.5) * stepLng;
        const cLat = minLat + (j + 0.5) * stepLat;
        if (!insideHull(cLng, cLat)) continue;

        const val = idw(cLng, cLat);
        const x0 = minLng + i * stepLng;
        const x1 = x0 + stepLng;
        const y0 = minLat + j * stepLat;
        const y1 = y0 + stepLat;

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]],
          },
          properties: { density: val },
        });
      }
    }

    mapRef.current.addSource('survey-contour', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    mapRef.current.addLayer({
      id: 'survey-contour-fill',
      type: 'fill',
      source: 'survey-contour',
      paint: {
        'fill-color': '#00A9E0',
        'fill-opacity': ['interpolate', ['linear'], ['get', 'density'], 0, 0.05, 1, 0.4],
        'fill-emissive-strength': 1,
      },
    });

    mapRef.current.addLayer({
      id: 'survey-contour-line',
      type: 'line',
      source: 'survey-contour',
      paint: {
        'line-color': '#00A9E0',
        'line-width': 0.3,
        'line-opacity': 0.2,
      },
    });
  }, [pins, showContour, mapReady]);

  // Re-render when pins or viewMode change
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (mapRef.current) {
      for (const id of ['survey-contour-fill', 'survey-contour-line']) {
        if (mapRef.current.getLayer(id)) mapRef.current.removeLayer(id);
      }
      if (mapRef.current.getSource('survey-contour')) {
        mapRef.current.removeSource('survey-contour');
      }
    }

    renderPinMarkers();
    renderHeatmap();
  }, [renderPinMarkers, renderHeatmap]);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  // Build category breakdown from pins
  const categoryBreakdown: Record<string, number> = {};
  for (const pin of pins) {
    const cat = questionCategoryMap[pin.question_id] || 'unknown';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  }

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
            <MapIcon className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Survey Analytics</h3>
          </div>

          {/* Layer toggles */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
              <Eye className={`w-3 h-3 ${showPins ? 'text-sky-300' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium flex-1 ${showPins ? 'text-sky-300' : 'text-gray-400 group-hover:text-white'}`}>Pins</span>
              <button
                onClick={() => setShowPins((v) => !v)}
                className={`w-8 h-4 rounded-full relative transition-colors ${showPins ? 'bg-sky-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${showPins ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
              <Layers className={`w-3 h-3 ${showContour ? 'text-sky-300' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium flex-1 ${showContour ? 'text-sky-300' : 'text-gray-400 group-hover:text-white'}`}>Density</span>
              <button
                onClick={() => setShowContour((v) => !v)}
                className={`w-8 h-4 rounded-full relative transition-colors ${showContour ? 'bg-sky-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${showContour ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>

          {/* Map mode toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMapMode('3d')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mapMode === '3d'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              3D
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mapMode === 'satellite'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              Satellite
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
              className="w-full px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500/50 cursor-pointer"
              style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="" style={{ background: '#1e1e1e', color: '#fff' }}>All Questions</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id} style={{ background: '#1e1e1e', color: '#fff' }}>
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

          {/* Category breakdown (replaces old green/yellow/red) */}
          {pins.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs text-gray-500">Pins by Principle</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => {
                    const config = getCategoryConfig(cat);
                    return (
                      <div key={cat} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-xs text-gray-400 flex-1 truncate">
                          {config.label}
                        </span>
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: config.color }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${pins.length > 0 ? (count / pins.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{pins.length} total pins</p>
            </div>
          )}

          {/* Answer distribution for selected question */}
          {distribution && selectedQuestion && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">Answers</span>
              </div>

              {(distribution.questionType === 'multiple_choice' || distribution.questionType === 'likert_single') &&
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

              {distribution.questionType === 'matrix_likert' &&
                Object.keys(distribution.matrixCounts).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(distribution.matrixCounts).map(([subItem, ratings]) => (
                      <div key={subItem} className="space-y-0.5">
                        <span className="text-xs text-gray-300 block truncate">{subItem}</span>
                        <div className="flex gap-0.5">
                          {Object.entries(ratings)
                            .sort(([, a], [, b]) => b - a)
                            .map(([rating, count]) => (
                              <div
                                key={rating}
                                className="h-1.5 bg-sky-500/60 rounded-full"
                                style={{ flex: count }}
                                title={`${rating}: ${count}`}
                              />
                            ))}
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
          {!loading && pins.length === 0 && stats?.totalResponses === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500">No responses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
