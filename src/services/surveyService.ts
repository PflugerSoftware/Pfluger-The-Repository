import DOMPurify from 'dompurify';
import { supabaseAnon } from '../config/supabase';

// ============================================
// Types
// ============================================

export type QuestionType =
  | 'multiple_choice'
  | 'open_ended'
  | 'matrix_likert'
  | 'ranking'
  | 'likert_single';

/** Section key - any string value; sections are defined per-survey in the DB */
export type SurveySection = string;

export interface SurveySectionConfig {
  key: string;
  label: string;
  color: string;
  lightColor: string;
  description: string;
  skipIntro?: boolean;
}

export interface Survey {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  map_center_lat: number | null;
  map_center_lng: number | null;
  map_zoom: number;
  roles: string[] | null;
  boundary_polygon: [number, number][] | null;
  sections: SurveySectionConfig[] | null;
}

export interface SurveyQuestion {
  id: string;
  survey_id: string;
  project_id: string;
  question_order: number;
  question_text: string;
  question_type: QuestionType;
  category: SurveySection | null;
  is_map_based: boolean;
  allow_pin: boolean;
  max_pins: number | null;
  options: string[] | null;
  max_selections: number | null;
  sub_items: string[] | null;
  scale_labels: string[] | null;
  required: boolean;
}

export interface SurveyPin {
  id: string;
  answer_id: string;
  response_id: string;
  question_id: string;
  survey_id: string;
  project_id: string;
  latitude: number;
  longitude: number;
  note: string | null;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  project_id: string;
  first_name: string | null;
  role: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface SurveySubmissionPin {
  latitude: number;
  longitude: number;
  note?: string;
}

export interface SurveySubmissionAnswer {
  questionId: string;
  answerText?: string;
  answerChoices?: string[];
  answerMatrix?: Record<string, string>;
  answerRanking?: string[];
  pins?: SurveySubmissionPin[];
}

export interface SurveySubmission {
  surveyId: string;
  projectId: string;
  firstName: string;
  role: string;
  answers: SurveySubmissionAnswer[];
}

export interface SurveyStats {
  totalResponses: number;
  completedResponses: number;
  roleBreakdown: Record<string, number>;
}

export interface AnswerDistribution {
  questionId: string;
  questionType: QuestionType;
  choiceCounts: Record<string, number>;
  openEndedAnswers: string[];
  matrixCounts: Record<string, Record<string, number>>;
  rankingAverages: Record<string, number>;
  rankingCounts: number;
  totalAnswers: number;
}

// ============================================
// Sanitization
// ============================================

const MAX_NAME_LENGTH = 100;
const MAX_NOTE_LENGTH = 500;
const MAX_TEXT_LENGTH = 2000;

/** Strip all HTML tags - plain text only */
export function sanitizeText(input: string, maxLength: number = MAX_TEXT_LENGTH): string {
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return cleaned.trim().slice(0, maxLength);
}

// ============================================
// Public (anonymous) - Survey Taking
// ============================================

/** Fetch survey config by slug */
export async function getSurveyBySlug(slug: string): Promise<Survey | null> {
  const { data, error } = await supabaseAnon
    .from('surveys')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as Survey;
}

/** Fetch ordered questions for a survey */
export async function getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]> {
  const { data, error } = await supabaseAnon
    .from('survey_questions')
    .select('*')
    .eq('survey_id', surveyId)
    .order('question_order', { ascending: true });

  if (error || !data) return [];
  return data as SurveyQuestion[];
}

/** Submit a complete survey response with all answers and pins */
export async function submitSurveyResponse(
  submission: SurveySubmission
): Promise<{ responseId: string } | null> {
  // 1. Create the response record
  const { data: response, error: responseError } = await supabaseAnon
    .from('survey_responses')
    .insert({
      survey_id: submission.surveyId,
      project_id: submission.projectId,
      first_name: sanitizeText(submission.firstName, MAX_NAME_LENGTH),
      role: submission.role,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (responseError || !response) {
    console.error('Failed to create survey response:', responseError);
    return null;
  }

  const responseId = response.id;

  // 2. Insert all answers
  for (const answer of submission.answers) {
    const { data: answerRow, error: answerError } = await supabaseAnon
      .from('survey_answers')
      .insert({
        response_id: responseId,
        question_id: answer.questionId,
        survey_id: submission.surveyId,
        project_id: submission.projectId,
        answer_text: answer.answerText
          ? sanitizeText(answer.answerText, MAX_TEXT_LENGTH)
          : null,
        answer_choices: answer.answerChoices || null,
        answer_matrix: answer.answerMatrix || null,
        answer_ranking: answer.answerRanking || null,
      })
      .select('id')
      .single();

    if (answerError || !answerRow) {
      console.error('Failed to insert answer:', answerError);
      continue;
    }

    // 3. Insert pins for this answer (if any)
    if (answer.pins && answer.pins.length > 0) {
      const pinRows = answer.pins.map((pin) => ({
        answer_id: answerRow.id,
        response_id: responseId,
        question_id: answer.questionId,
        survey_id: submission.surveyId,
        project_id: submission.projectId,
        latitude: pin.latitude,
        longitude: pin.longitude,
        note: pin.note ? sanitizeText(pin.note, MAX_NOTE_LENGTH) : null,
      }));

      const { error: pinError } = await supabaseAnon
        .from('survey_pins')
        .insert(pinRows);

      if (pinError) {
        console.error('Failed to insert pins:', pinError);
      }
    }
  }

  return { responseId };
}

// ============================================
// Authenticated (team) - Analytics
// ============================================

/** Fetch all pins for a survey, optionally filtered by question or category */
export async function getSurveyPins(
  surveyId: string,
  questionId?: string | null
): Promise<SurveyPin[]> {
  let query = supabaseAnon
    .from('survey_pins')
    .select('*')
    .eq('survey_id', surveyId)
    .limit(2000);

  if (questionId) {
    query = query.eq('question_id', questionId);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as SurveyPin[];
}

/** Fetch survey response stats */
export async function getSurveyStats(surveyId: string): Promise<SurveyStats> {
  const { data, error } = await supabaseAnon
    .from('survey_responses')
    .select('id, role, completed_at')
    .eq('survey_id', surveyId);

  if (error || !data) {
    return { totalResponses: 0, completedResponses: 0, roleBreakdown: {} };
  }

  const roleBreakdown: Record<string, number> = {};
  let completedCount = 0;

  for (const row of data) {
    if (row.completed_at) completedCount++;
    const role = row.role || 'unknown';
    roleBreakdown[role] = (roleBreakdown[role] || 0) + 1;
  }

  return {
    totalResponses: data.length,
    completedResponses: completedCount,
    roleBreakdown,
  };
}

/** Individual response with all answers */
export interface ResponseWithAnswers {
  id: string;
  firstName: string | null;
  role: string | null;
  completedAt: string | null;
  createdAt: string;
  answers: {
    questionId: string;
    answerText: string | null;
    answerChoices: string[] | null;
    answerMatrix: Record<string, string> | null;
    answerRanking: string[] | null;
  }[];
  pinCount: number;
}

/** Fetch all individual responses for a survey with their answers */
export async function getSurveyResponses(
  surveyId: string
): Promise<ResponseWithAnswers[]> {
  const { data: responses, error: rErr } = await supabaseAnon
    .from('survey_responses')
    .select('id, first_name, role, completed_at, created_at')
    .eq('survey_id', surveyId)
    .order('created_at', { ascending: false });

  if (rErr || !responses) return [];

  const { data: answers, error: aErr } = await supabaseAnon
    .from('survey_answers')
    .select('response_id, question_id, answer_text, answer_choices, answer_matrix, answer_ranking')
    .eq('survey_id', surveyId);

  const { data: pins, error: pErr } = await supabaseAnon
    .from('survey_pins')
    .select('response_id')
    .eq('survey_id', surveyId);

  const answersByResponse: Record<string, NonNullable<typeof answers>> = {};
  if (!aErr && answers) {
    for (const a of answers) {
      if (!answersByResponse[a.response_id]) answersByResponse[a.response_id] = [];
      answersByResponse[a.response_id].push(a);
    }
  }

  const pinCountByResponse: Record<string, number> = {};
  if (!pErr && pins) {
    for (const p of pins) {
      pinCountByResponse[p.response_id] = (pinCountByResponse[p.response_id] || 0) + 1;
    }
  }

  return responses.map((r) => ({
    id: r.id,
    firstName: r.first_name,
    role: r.role,
    completedAt: r.completed_at,
    createdAt: r.created_at,
    answers: (answersByResponse[r.id] || []).map((a) => ({
      questionId: a.question_id,
      answerText: a.answer_text,
      answerChoices: a.answer_choices as string[] | null,
      answerMatrix: a.answer_matrix as Record<string, string> | null,
      answerRanking: a.answer_ranking as string[] | null,
    })),
    pinCount: pinCountByResponse[r.id] || 0,
  }));
}

/** Fetch answer distribution for a specific question */
export async function getQuestionResults(questionId: string): Promise<AnswerDistribution> {
  const { data, error } = await supabaseAnon
    .from('survey_answers')
    .select('answer_text, answer_choices, answer_matrix, answer_ranking')
    .eq('question_id', questionId);

  if (error || !data) {
    return {
      questionId,
      questionType: 'multiple_choice',
      choiceCounts: {},
      openEndedAnswers: [],
      matrixCounts: {},
      rankingAverages: {},
      rankingCounts: 0,
      totalAnswers: 0,
    };
  }

  const choiceCounts: Record<string, number> = {};
  const openEndedAnswers: string[] = [];
  const matrixCounts: Record<string, Record<string, number>> = {};
  const rankingSums: Record<string, number> = {};
  const rankingOccurrences: Record<string, number> = {};
  let rankingCounts = 0;
  let isOpenEnded = false;
  let isMatrix = false;
  let isRanking = false;

  for (const row of data) {
    if (row.answer_choices && Array.isArray(row.answer_choices) && (row.answer_choices as string[]).length > 0) {
      for (const choice of row.answer_choices as string[]) {
        choiceCounts[choice] = (choiceCounts[choice] || 0) + 1;
      }
    }
    if (row.answer_text) {
      openEndedAnswers.push(row.answer_text);
      isOpenEnded = true;
    }
    if (row.answer_matrix && typeof row.answer_matrix === 'object' && Object.keys(row.answer_matrix as Record<string, string>).length > 0) {
      isMatrix = true;
      for (const [subItem, rating] of Object.entries(row.answer_matrix as Record<string, string>)) {
        if (!matrixCounts[subItem]) matrixCounts[subItem] = {};
        matrixCounts[subItem][rating] = (matrixCounts[subItem][rating] || 0) + 1;
      }
    }
    if (row.answer_ranking && Array.isArray(row.answer_ranking) && (row.answer_ranking as string[]).length > 0) {
      isRanking = true;
      rankingCounts++;
      const items = row.answer_ranking as string[];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        rankingSums[item] = (rankingSums[item] || 0) + (i + 1);
        rankingOccurrences[item] = (rankingOccurrences[item] || 0) + 1;
      }
    }
  }

  const rankingAverages: Record<string, number> = {};
  for (const item of Object.keys(rankingSums)) {
    rankingAverages[item] = rankingSums[item] / rankingOccurrences[item];
  }

  const questionType: QuestionType = isRanking
    ? 'ranking'
    : isMatrix
      ? 'matrix_likert'
      : isOpenEnded
        ? 'open_ended'
        : 'multiple_choice';

  return {
    questionId,
    questionType,
    choiceCounts,
    openEndedAnswers,
    matrixCounts,
    rankingAverages,
    rankingCounts,
    totalAnswers: data.length,
  };
}

/** Fetch respondent details for a specific pin */
export async function getPinResponseDetails(
  responseId: string
): Promise<{ firstName: string | null; role: string | null } | null> {
  const { data, error } = await supabaseAnon
    .from('survey_responses')
    .select('first_name, role')
    .eq('id', responseId)
    .single();

  if (error || !data) return null;
  return { firstName: data.first_name, role: data.role };
}

/** Fetch all questions with answer counts for the filter dropdown */
export async function getSurveyQuestionsWithCounts(
  surveyId: string
): Promise<Array<SurveyQuestion & { answerCount: number }>> {
  const questions = await getSurveyQuestions(surveyId);

  const { data: answers, error } = await supabaseAnon
    .from('survey_answers')
    .select('question_id')
    .eq('survey_id', surveyId);

  if (error || !answers) {
    return questions.map((q) => ({ ...q, answerCount: 0 }));
  }

  const countMap: Record<string, number> = {};
  for (const row of answers) {
    countMap[row.question_id] = (countMap[row.question_id] || 0) + 1;
  }

  return questions.map((q) => ({
    ...q,
    answerCount: countMap[q.id] || 0,
  }));
}
