import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, Layers, Eye, Filter, Users, MessageSquare, Building2, Satellite, X, MapPin, User, Clock } from 'lucide-react';
import { MAPBOX_TOKEN, MAPBOX_STYLES } from '../../config/mapbox';
import { getSentimentColor, SENTIMENT_CONFIG, SENTIMENT_NONE_COLOR } from '../../config/surveyCategories';
import {
  getSurveyPins,
  getSurveyStats,
  getSurveyQuestionsWithCounts,
  getQuestionResults,
  getPinResponseDetails,
} from '../../services/surveyService';
import type { SurveySectionConfig } from '../../services/surveyService';
import { supabaseAnon } from '../../config/supabase';
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
  const markersRef = useRef<{ marker: mapboxgl.Marker; pinId: string }[]>([]);

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
  const [boundary, setBoundary] = useState<[number, number][] | null>(null);
  const [sections, setSections] = useState<SurveySectionConfig[]>([]);
  const [selectedPin, setSelectedPin] = useState<SurveyPin | null>(null);
  const [pinRespondent, setPinRespondent] = useState<{ firstName: string | null; role: string | null } | null>(null);
  const [pinDetailLoading, setPinDetailLoading] = useState(false);

  // Only show map-relevant questions in the filter dropdown
  const mapQuestions = questions.filter((q) => q.is_map_based || q.allow_pin);

  // Load initial data (including survey boundary)
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

      // Fetch survey boundary + sections
      const { data: surveyRow } = await supabaseAnon
        .from('surveys')
        .select('boundary_polygon, sections')
        .eq('id', data.survey_id)
        .single();
      if (surveyRow?.boundary_polygon) {
        setBoundary(surveyRow.boundary_polygon as [number, number][]);
      }
      if (surveyRow?.sections) {
        setSections(surveyRow.sections as SurveySectionConfig[]);
      }

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
      // Re-add boundary after style switch
      addBoundaryToMap(m);
      renderPinMarkers();
      renderHeatmap();
    });
  }, [mapMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add boundary polygon to map (if available from DB)
  const addBoundaryToMap = useCallback((m: mapboxgl.Map) => {
    if (!boundary || boundary.length < 3) return;
    if (m.getSource('campus-boundary')) return;

    m.addSource('campus-boundary', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [boundary] },
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
  }, [boundary]);

  // Render boundary when both map and boundary data are ready
  useEffect(() => {
    if (!mapRef.current || !mapReady || !boundary) return;
    addBoundaryToMap(mapRef.current);
  }, [mapReady, boundary, addBoundaryToMap]);

  // Handle pin click - load respondent details and show panel
  const handlePinClick = useCallback(async (pin: SurveyPin) => {
    setSelectedPin(pin);
    setPinDetailLoading(true);
    setPinRespondent(null);
    const details = await getPinResponseDetails(pin.response_id);
    setPinRespondent(details);
    setPinDetailLoading(false);
  }, []);

  // Render pins colored by sentiment
  const renderPinMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    if (!mapRef.current || !showPins) return;

    for (const pin of pins) {
      const color = getSentimentColor(pin.sentiment);
      const isSelected = selectedPin?.id === pin.id;

      const marker = new mapboxgl.Marker({
        color,
        scale: isSelected ? 1.0 : 0.7,
      })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(mapRef.current);

      // Add click handler and highlight styling
      const el = marker.getElement();
      el.style.cursor = 'pointer';
      el.style.transition = 'filter 0.2s, transform 0.2s';
      if (isSelected) {
        el.style.filter = `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})`;
        el.style.zIndex = '10';
      }
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePinClick(pin);
      });

      markersRef.current.push({ marker, pinId: pin.id });
    }
  }, [pins, showPins, handlePinClick, selectedPin]);

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

    if (!showContour || pins.length < 1) return;

    // Parse hex color to [r, g, b]
    function hexToRgb(hex: string): [number, number, number] {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    function rgbToHex(r: number, g: number, b: number): string {
      return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
    }

    // Always use sentiment colors for heatmap
    const coloredPins = pins.map((pin) => {
      const color = getSentimentColor(pin.sentiment);
      return { lng: pin.longitude, lat: pin.latitude, rgb: hexToRgb(color) };
    });

    // Point-in-polygon test against site boundary (if available)
    const clipBoundary = boundary && boundary.length > 2 ? boundary : null;
    function insideBoundary(lng: number, lat: number): boolean {
      if (!clipBoundary) return true; // No boundary = no clipping
      let inside = false;
      for (let i = 0, j = clipBoundary.length - 1; i < clipBoundary.length; j = i++) {
        const xi = clipBoundary[i][0], yi = clipBoundary[i][1];
        const xj = clipBoundary[j][0], yj = clipBoundary[j][1];
        if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }

    // Use site boundary bounding box if available, otherwise derive from pins
    const bLngs = clipBoundary ? clipBoundary.map((c) => c[0]) : coloredPins.map((p) => p.lng);
    const bLats = clipBoundary ? clipBoundary.map((c) => c[1]) : coloredPins.map((p) => p.lat);
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
        if (!insideBoundary(cLng, cLat)) continue;

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
  }, [pins, showContour, mapReady, boundary]);

  // Re-render when pins or viewMode change
  useEffect(() => {
    markersRef.current.forEach(({ marker }) => marker.remove());
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

  // Build sentiment breakdown from pins
  const sentimentBreakdown: Record<string, number> = { good: 0, ok: 0, bad: 0, none: 0 };
  for (const pin of pins) {
    const key = pin.sentiment || 'none';
    sentimentBreakdown[key] = (sentimentBreakdown[key] || 0) + 1;
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
              {(() => {
                // Group questions by section
                const grouped: Record<string, typeof mapQuestions> = {};
                for (const q of mapQuestions) {
                  const key = q.category || 'other';
                  if (!grouped[key]) grouped[key] = [];
                  grouped[key].push(q);
                }
                return Object.entries(grouped).map(([sectionKey, qs]) => {
                  const sectionLabel = sections.find((s) => s.key === sectionKey)?.label || sectionKey;
                  return (
                    <optgroup key={sectionKey} label={sectionLabel} style={{ background: '#1e1e1e', color: '#fff' }}>
                      {qs.map((q) => (
                        <option key={q.id} value={q.id} style={{ background: '#1e1e1e', color: '#fff' }}>
                          Q{q.question_order}: {q.question_text.slice(0, 40)}
                          {q.question_text.length > 40 ? '...' : ''} ({q.answerCount})
                        </option>
                      ))}
                    </optgroup>
                  );
                });
              })()}
            </select>
          </div>

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

          {/* Sentiment breakdown */}
          {pins.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs text-gray-500">Pins by Sentiment</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(sentimentBreakdown)
                  .filter(([, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a)
                  .map(([sentiment, count]) => {
                    const color = sentiment === 'none'
                      ? SENTIMENT_NONE_COLOR
                      : SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG].color;
                    const label = sentiment === 'none'
                      ? 'No Sentiment'
                      : SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG].label;
                    return (
                      <div key={sentiment} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs text-gray-400 flex-1 truncate">
                          {label}
                        </span>
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
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

      {/* Pin detail panel - slides in from right */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-3 right-3 bottom-3 w-72 z-10 rounded-xl overflow-y-auto scrollbar-thin"
            style={{
              background: 'rgba(24, 16, 25, 0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="p-4 space-y-4">
              {/* Header with close button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">Pin Details</h3>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Sentiment badge */}
              {(() => {
                const sentiment = selectedPin.sentiment;
                const config = sentiment && sentiment in SENTIMENT_CONFIG
                  ? SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG]
                  : null;
                return (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: config ? config.lightColor : 'rgba(156, 163, 175, 0.15)',
                      color: config ? config.color : SENTIMENT_NONE_COLOR,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config ? config.color : SENTIMENT_NONE_COLOR }}
                    />
                    {config ? config.label : 'No Sentiment'}
                  </div>
                );
              })()}

              {/* Respondent info */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Respondent</span>
                </div>
                {pinDetailLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 border border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                ) : pinRespondent ? (
                  <div className="px-3 py-2 bg-white/5 rounded-lg space-y-1">
                    <p className="text-sm text-white font-medium">
                      {pinRespondent.firstName || 'Anonymous'}
                    </p>
                    {pinRespondent.role && (
                      <p className="text-xs text-gray-400 capitalize">{pinRespondent.role}</p>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500">Unknown respondent</p>
                  </div>
                )}
              </div>

              {/* Question */}
              {(() => {
                const question = questions.find((q) => q.id === selectedPin.question_id);
                if (!question) return null;
                const section = sections.find((s) => s.key === question.category);
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">Question</span>
                    </div>
                    {section && (
                      <span
                        className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: section.lightColor,
                          color: section.color,
                        }}
                      >
                        {section.label}
                      </span>
                    )}
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Q{question.question_order}: {question.question_text}
                    </p>
                  </div>
                );
              })()}

              {/* Note */}
              {selectedPin.note && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-500">Note</span>
                  <div className="px-3 py-2.5 bg-white/5 rounded-lg border-l-2 border-sky-500/40">
                    <p className="text-xs text-gray-200 leading-relaxed italic">
                      "{selectedPin.note}"
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] text-gray-600">
                  {new Date(selectedPin.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Coordinates */}
              <div className="text-[10px] text-gray-600">
                {selectedPin.latitude.toFixed(5)}, {selectedPin.longitude.toFixed(5)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
