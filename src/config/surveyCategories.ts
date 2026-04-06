import type { SurveySectionConfig } from '../services/surveyService';

// ============================================
// Sentiment config (universal - used by all surveys)
// ============================================

export type Sentiment = 'good' | 'ok' | 'bad';

export const SENTIMENT_CONFIG: Record<Sentiment, { color: string; lightColor: string; label: string }> = {
  good: { color: '#22C55E', lightColor: 'rgba(34, 197, 94, 0.15)', label: 'Positive' },
  ok:   { color: '#EAB308', lightColor: 'rgba(234, 179, 8, 0.15)', label: 'Neutral' },
  bad:  { color: '#EF4444', lightColor: 'rgba(239, 68, 68, 0.15)', label: 'Negative' },
};

export const SENTIMENT_NONE_COLOR = '#9CA3AF';

/** Get sentiment color, gray for null/unknown */
export function getSentimentColor(sentiment: string | null): string {
  if (sentiment && sentiment in SENTIMENT_CONFIG) {
    return SENTIMENT_CONFIG[sentiment as Sentiment].color;
  }
  return SENTIMENT_NONE_COLOR;
}

// ============================================
// Section helpers (data-driven from survey record)
// ============================================

const DEFAULT_SECTION: SurveySectionConfig = {
  key: 'general',
  label: 'General',
  color: '#9CA3AF',
  lightColor: 'rgba(156, 163, 175, 0.15)',
  description: '',
  skipIntro: true,
};

/** Look up a section config from the survey's sections array */
export function getSectionConfig(
  sections: SurveySectionConfig[] | null | undefined,
  sectionKey: string | null
): SurveySectionConfig {
  if (!sectionKey || !sections) return DEFAULT_SECTION;
  const found = sections.find((s) => s.key === sectionKey);
  return found || DEFAULT_SECTION;
}
