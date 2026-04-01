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

// Lee College campus boundary from KMZ
const CAMPUS_BOUNDARY: [number, number][] = [
  [-94.98003392626333, 29.73728390164641],
  [-94.98026680778955, 29.7362245466406],
  [-94.97994758091579, 29.73611213706491],
  [-94.98023472889521, 29.73555965639588],
  [-94.9810798632486, 29.73531616858645],
  [-94.98032373607042, 29.73408650959582],
  [-94.97846727829557, 29.73490870425564],
  [-94.97825036631228, 29.73442691557635],
  [-94.97820252185326, 29.73399353001699],
  [-94.97817777978511, 29.73369660299584],
  [-94.97837071625727, 29.73343632524895],
  [-94.9785631114835, 29.73324782208751],
  [-94.9787643811968, 29.73305054214907],
  [-94.97900367844501, 29.732737735653],
  [-94.97908014186132, 29.73249723692],
  [-94.97908202874716, 29.73215094952845],
  [-94.97899875661199, 29.73177970826987],
  [-94.97891759401598, 29.73143657617207],
  [-94.978849751857, 29.73120875106844],
  [-94.97876152855817, 29.73091136273915],
  [-94.97862050796223, 29.73051933538711],
  [-94.9785102529823, 29.73013790710168],
  [-94.97849210149494, 29.72981890315342],
  [-94.97433973735936, 29.72987949759868],
  [-94.97213767519371, 29.73507213633389],
  [-94.9783129221989, 29.73708615842378],
  [-94.98003392626333, 29.73728390164641],
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pins, setPins] = useState<SurveyPin[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [distribution, setDistribution] = useState<AnswerDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  // Build question -> category lookup for pin coloring
  const questionCategoryMap: Record<string, string | null> = {};
  for (const q of questions) {
    questionCategoryMap[q.id] = q.category;
  }

  // Unique categories present in questions
  const availableCategories = [...new Set(questions.map((q) => q.category).filter(Boolean))] as string[];

  // Filter pins by selected category
  const filteredPins = selectedCategory
    ? pins.filter((p) => questionCategoryMap[p.question_id] === selectedCategory)
    : pins;

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
      // Add campus boundary outline
      if (!m.getSource('campus-boundary')) {
        m.addSource('campus-boundary', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [CAMPUS_BOUNDARY] },
            properties: {},
          },
        });
        m.addLayer({
          id: 'campus-boundary-line',
          type: 'line',
          source: 'campus-boundary',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
            'line-dasharray': [4, 3],
            'line-opacity': 0.6,
          },
        });
      }
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
      // Re-add boundary after style switch
      if (!m.getSource('campus-boundary')) {
        m.addSource('campus-boundary', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [CAMPUS_BOUNDARY] },
            properties: {},
          },
        });
        m.addLayer({
          id: 'campus-boundary-line',
          type: 'line',
          source: 'campus-boundary',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
            'line-dasharray': [4, 3],
            'line-opacity': 0.6,
          },
        });
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

    for (const pin of filteredPins) {
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
  }, [filteredPins, showPins, questionCategoryMap]);

  const renderHeatmap = useCallback(() => {
    if (!mapRef.current || !mapReady) return;
    if (!mapRef.current.isStyleLoaded()) return;

    // Clean up previous layers/sources
    const style = mapRef.current.getStyle();
    if (style?.layers) {
      for (const layer of style.layers) {
        if (layer.id.startsWith('survey-contour-')) {
          mapRef.current.removeLayer(layer.id);
        }
      }
    }
    if (style?.sources) {
      for (const srcId of Object.keys(style.sources)) {
        if (srcId.startsWith('survey-contour-')) {
          mapRef.current.removeSource(srcId);
        }
      }
    }

    if (!showContour || filteredPins.length < 3) return;

    // Parse hex color to [r, g, b]
    function hexToRgb(hex: string): [number, number, number] {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    function rgbToHex(r: number, g: number, b: number): string {
      return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
    }

    const SENTIMENT_COLORS: Record<string, string> = { good: '#22C55E', ok: '#EAB308', bad: '#EF4444' };
    const useSentiment = !!selectedQuestionId || !!selectedCategory;

    // Assign a color to each pin
    const coloredPins = filteredPins.map((pin) => {
      let color: string;
      if (useSentiment && pin.sentiment) {
        // Filtered view: sentiment gradient (green-yellow-red)
        color = SENTIMENT_COLORS[pin.sentiment] || '#9CA3AF';
      } else {
        // All questions/categories: category color blend
        const cat = questionCategoryMap[pin.question_id] || null;
        color = getCategoryConfig(cat).color;
      }
      return { lng: pin.longitude, lat: pin.latitude, rgb: hexToRgb(color) };
    });

    // Point-in-polygon test against campus boundary
    function insideCampus(lng: number, lat: number): boolean {
      let inside = false;
      for (let i = 0, j = CAMPUS_BOUNDARY.length - 1; i < CAMPUS_BOUNDARY.length; j = i++) {
        const xi = CAMPUS_BOUNDARY[i][0], yi = CAMPUS_BOUNDARY[i][1];
        const xj = CAMPUS_BOUNDARY[j][0], yj = CAMPUS_BOUNDARY[j][1];
        if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }

    // Use campus boundary bounding box so heatmap fills the whole campus
    const bLngs = CAMPUS_BOUNDARY.map((c) => c[0]);
    const bLats = CAMPUS_BOUNDARY.map((c) => c[1]);
    const minLng = Math.min(...bLngs);
    const maxLng = Math.max(...bLngs);
    const minLat = Math.min(...bLats);
    const maxLat = Math.max(...bLats);
    const gridRes = 160;
    const stepLng = (maxLng - minLng) / gridRes;
    const stepLat = (maxLat - minLat) / gridRes;

    if (stepLng === 0 || stepLat === 0) return;

    // IDW color blend: for each grid cell, blend all pin colors by inverse-distance weight
    const power = 2;
    const features: GeoJSON.Feature[] = [];

    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        const cLng = minLng + (i + 0.5) * stepLng;
        const cLat = minLat + (j + 0.5) * stepLat;

        // Clip to campus boundary
        if (!insideCampus(cLng, cLat)) continue;

        let wSum = 0;
        let rSum = 0, gSum = 0, bSum = 0;

        for (const p of coloredPins) {
          const dx = (p.lng - cLng) * 111320 * Math.cos((cLat * Math.PI) / 180);
          const dy = (p.lat - cLat) * 110540;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const w = 1 / Math.pow(Math.max(dist, 1), power);
          wSum += w;
          rSum += w * p.rgb[0];
          gSum += w * p.rgb[1];
          bSum += w * p.rgb[2];
        }

        // Fade opacity by distance from nearest pin
        const maxDist = 300; // meters
        const closestDist = Math.min(
          ...coloredPins.map((p) => {
            const dx = (p.lng - cLng) * 111320 * Math.cos((cLat * Math.PI) / 180);
            const dy = (p.lat - cLat) * 110540;
            return Math.sqrt(dx * dx + dy * dy);
          })
        );
        if (closestDist > maxDist) continue;

        const blendedColor = rgbToHex(rSum / wSum, gSum / wSum, bSum / wSum);
        // Opacity falls off with distance from nearest pin
        const opacity = Math.max(0, 1 - closestDist / maxDist);

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
          properties: { color: blendedColor, opacity: opacity * 0.45 },
        });
      }
    }

    if (features.length === 0) return;

    mapRef.current.addSource('survey-contour-blend', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    mapRef.current.addLayer({
      id: 'survey-contour-fill-blend',
      type: 'fill',
      source: 'survey-contour-blend',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': ['get', 'opacity'],
        'fill-emissive-strength': 1,
      },
    });
  }, [filteredPins, showContour, mapReady, questionCategoryMap, selectedQuestionId, selectedCategory]);

  // Re-render when pins or viewMode change
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const style = mapRef.current.getStyle();
      if (style?.layers) {
        for (const layer of style.layers) {
          if (layer.id.startsWith('survey-contour-')) {
            mapRef.current.removeLayer(layer.id);
          }
        }
      }
      if (style?.sources) {
        for (const srcId of Object.keys(style.sources)) {
          if (srcId.startsWith('survey-contour-')) {
            mapRef.current.removeSource(srcId);
          }
        }
      }
    }

    renderPinMarkers();
    renderHeatmap();
  }, [renderPinMarkers, renderHeatmap]);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  // Build category breakdown from filtered pins
  const categoryBreakdown: Record<string, number> = {};
  for (const pin of filteredPins) {
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
        className="absolute top-3 left-3 bottom-3 w-80 z-10 rounded-xl overflow-y-auto scrollbar-thin"
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

          {/* Category filter */}
          {availableCategories.length > 1 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Filter className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">Filter by Category</span>
              </div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500/50 cursor-pointer"
                style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="" style={{ background: '#1e1e1e', color: '#fff' }}>All Categories</option>
                {availableCategories.map((cat) => {
                  const config = getCategoryConfig(cat);
                  return (
                    <option key={cat} value={cat} style={{ background: '#1e1e1e', color: '#fff' }}>
                      {config.label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Response stats */}
          {stats && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">{stats.totalResponses} Responses</span>
              </div>
              <div className="space-y-1">
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
          {filteredPins.length > 0 && (
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
                        <span className="text-xs text-gray-400 flex-1 truncate">
                          {config.label}
                        </span>
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: config.color }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${filteredPins.length > 0 ? (count / filteredPins.length) * 100 : 0}%`,
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
              <p className="text-[10px] text-gray-600 mt-1">{filteredPins.length} total pins</p>
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
          {!loading && filteredPins.length === 0 && stats?.totalResponses === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500">No responses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
