import type { SurveySectionConfig } from '../services/surveyService';

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
