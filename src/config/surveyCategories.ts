import type { SurveyCategory } from '../services/surveyService';

export interface CategoryConfig {
  key: SurveyCategory;
  label: string;
  color: string;
  lightColor: string;
  description: string;
}

export const SURVEY_CATEGORIES: Record<SurveyCategory, CategoryConfig> = {
  'about-you': {
    key: 'about-you',
    label: 'About You',
    color: '#9CA3AF',
    lightColor: 'rgba(156, 163, 175, 0.15)',
    description: 'Demographics and background',
  },
  'people-centered': {
    key: 'people-centered',
    label: 'People-Centered Campus',
    color: '#3B82F6',
    lightColor: 'rgba(59, 130, 246, 0.15)',
    description: 'Belonging, inclusion, safety, and support',
  },
  'future-evolution': {
    key: 'future-evolution',
    label: 'Future Evolution',
    color: '#10B981',
    lightColor: 'rgba(16, 185, 129, 0.15)',
    description: 'Untapped potential, flexibility, and redevelopment',
  },
  'build-for-opportunity': {
    key: 'build-for-opportunity',
    label: 'Build for Opportunity',
    color: '#F97316',
    lightColor: 'rgba(249, 115, 22, 0.15)',
    description: 'Workforce training, academics, and partnerships',
  },
  'community-engagement': {
    key: 'community-engagement',
    label: 'Community Engagement',
    color: '#8B5CF6',
    lightColor: 'rgba(139, 92, 246, 0.15)',
    description: 'Campus-community connections and gathering',
  },
  'enduring-identity': {
    key: 'enduring-identity',
    label: 'Enduring Identity',
    color: '#F59E0B',
    lightColor: 'rgba(245, 158, 11, 0.15)',
    description: 'Character, history, and institutional spirit',
  },
  'barriers': {
    key: 'barriers',
    label: 'Barriers & Challenges',
    color: '#EF4444',
    lightColor: 'rgba(239, 68, 68, 0.15)',
    description: 'Physical barriers, safety concerns, and obstacles',
  },
};

/** Get category config, with fallback for unknown categories */
export function getCategoryConfig(category: string | null): CategoryConfig {
  if (category && category in SURVEY_CATEGORIES) {
    return SURVEY_CATEGORIES[category as SurveyCategory];
  }
  return {
    key: 'about-you',
    label: 'General',
    color: '#9CA3AF',
    lightColor: 'rgba(156, 163, 175, 0.15)',
    description: '',
  };
}
