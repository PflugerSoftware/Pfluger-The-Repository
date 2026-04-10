import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ListOrdered,
  Grid3X3,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Hash,
} from 'lucide-react';
import {
  getSurveyQuestionsWithCounts,
  getQuestionResults,
} from '../../services/surveyService';
import type {
  SurveyQuestion,
  AnswerDistribution,
  SurveySectionConfig,
} from '../../services/surveyService';
import { supabaseAnon } from '../../config/supabase';
import type { SurveyResultsData } from './types';

interface SurveyResultsBlockProps {
  data: SurveyResultsData;
}

// Colors for bar charts
const BAR_COLORS = [
  '#00A9E0', '#67823A', '#F2A900', '#f16555', '#B5BD00', '#003C71',
  '#9A3324', '#22C55E', '#EAB308', '#8B5CF6',
];

// Likert scale colors (negative to positive)
const LIKERT_COLORS: Record<string, string> = {
  'Strongly Disagree': '#EF4444',
  'Disagree': '#F97316',
  'Neutral': '#EAB308',
  'Agree': '#34D399',
  'Strongly Agree': '#10B981',
  'Very Dissatisfied': '#EF4444',
  'Dissatisfied': '#F97316',
  'Neither': '#EAB308',
  'Satisfied': '#34D399',
  'Very Satisfied': '#10B981',
  '1': '#EF4444',
  '2': '#F97316',
  '3': '#EAB308',
  '4': '#34D399',
  '5': '#10B981',
};

function getLikertColor(label: string, index: number): string {
  return LIKERT_COLORS[label] || BAR_COLORS[index % BAR_COLORS.length];
}

// ========== Summary sub-components ==========

function ChoiceDistribution({
  distribution,
}: {
  distribution: AnswerDistribution;
}) {
  const sorted = Object.entries(distribution.choiceCounts).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(([choice, count]) => (
        <span
          key={choice}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs"
        >
          <span className="text-gray-300">{choice}</span>
          <span className="text-sky-400 font-semibold">{count}</span>
        </span>
      ))}
    </div>
  );
}

function RankingResults({
  distribution,
}: {
  distribution: AnswerDistribution;
}) {
  const sorted = Object.entries(distribution.rankingAverages).sort(
    ([, a], [, b]) => a - b
  );

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(([item, avgRank], i) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs"
        >
          <span className="text-gray-500 font-semibold">#{i + 1}</span>
          <span className="text-gray-300">{item}</span>
          <span className="text-gray-600 text-[10px]">avg {avgRank.toFixed(1)}</span>
        </span>
      ))}
    </div>
  );
}

function MatrixResults({
  distribution,
}: {
  distribution: AnswerDistribution;
}) {
  const subItems = Object.keys(distribution.matrixCounts);

  // Collect all unique rating labels, sorted by a logical likert order
  const likertOrder = ['Strongly Agree', 'Agree', 'No Opinion', 'Disagree', 'Strongly Disagree'];
  const allRatings = new Set<string>();
  for (const ratings of Object.values(distribution.matrixCounts)) {
    for (const key of Object.keys(ratings)) {
      allRatings.add(key);
    }
  }
  const ratingLabels = Array.from(allRatings).sort((a, b) => {
    const ai = likertOrder.indexOf(a);
    const bi = likertOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-gray-500 font-medium pb-2 pr-4" />
            {ratingLabels.map((label, i) => (
              <th
                key={label}
                className="text-center font-medium pb-2 px-2 whitespace-nowrap"
                style={{ color: getLikertColor(label, i) }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subItems.map((subItem) => {
            const ratings = distribution.matrixCounts[subItem];
            return (
              <tr key={subItem} className="border-t border-white/5">
                <td className="text-gray-300 py-2 pr-4 leading-snug max-w-xs">
                  {subItem}
                </td>
                {ratingLabels.map((label) => {
                  const count = ratings[label] || 0;
                  return (
                    <td key={label} className="text-center py-2 px-2">
                      {count > 0 ? (
                        <span className="text-white font-medium">{count}</span>
                      ) : (
                        <span className="text-gray-700">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OpenEndedResults({
  distribution,
}: {
  distribution: AnswerDistribution;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? distribution.openEndedAnswers.length : 4;
  const answers = distribution.openEndedAnswers.slice(0, visibleCount);

  return (
    <div className="space-y-2">
      {answers.map((answer, i) => (
        <div
          key={i}
          className="px-3 py-2.5 bg-white/5 rounded-lg border-l-2 border-sky-500/30"
        >
          <p className="text-xs text-gray-300 leading-relaxed italic">"{answer}"</p>
        </div>
      ))}
      {distribution.openEndedAnswers.length > 4 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors pt-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Show all {distribution.openEndedAnswers.length} responses
            </>
          )}
        </button>
      )}
    </div>
  );
}

function QuestionTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'multiple_choice':
    case 'likert_single':
      return <BarChart3 className="w-4 h-4" />;
    case 'ranking':
      return <ListOrdered className="w-4 h-4" />;
    case 'matrix_likert':
      return <Grid3X3 className="w-4 h-4" />;
    case 'open_ended':
      return <MessageCircle className="w-4 h-4" />;
    default:
      return <Hash className="w-4 h-4" />;
  }
}

// ========== Main component ==========

export function SurveyResultsBlock({ data }: SurveyResultsBlockProps) {
  const [questions, setQuestions] = useState<Array<SurveyQuestion & { answerCount: number }>>([]);
  const [results, setResults] = useState<Record<string, AnswerDistribution>>({});
  const [sections, setSections] = useState<SurveySectionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [questionsData, surveyRow] = await Promise.all([
        getSurveyQuestionsWithCounts(data.survey_id),
        supabaseAnon
          .from('surveys')
          .select('sections')
          .eq('id', data.survey_id)
          .single(),
      ]);

      if (surveyRow.data?.sections) {
        setSections(surveyRow.data.sections as SurveySectionConfig[]);
      }

      // Filter to non-map questions for summary view
      const structured = questionsData.filter((q) => !q.is_map_based);
      setQuestions(structured);

      // Fetch results for each question in parallel
      const entries = await Promise.all(
        structured.map(async (q) => {
          const dist = await getQuestionResults(q.id);
          return [q.id, dist] as const;
        })
      );
      setResults(Object.fromEntries(entries));
      setLoading(false);
    }
    load();
  }, [data.survey_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Group questions by section
  const grouped: { section: SurveySectionConfig | null; questions: typeof questions }[] = [];
  const sectionOrder: string[] = [];
  const sectionMap: Record<string, typeof questions> = {};

  for (const q of questions) {
    const key = q.category || '_none';
    if (!sectionMap[key]) {
      sectionMap[key] = [];
      sectionOrder.push(key);
    }
    sectionMap[key].push(q);
  }

  for (const key of sectionOrder) {
    const sectionConfig = key === '_none'
      ? null
      : sections.find((s) => s.key === key) || null;
    grouped.push({ section: sectionConfig, questions: sectionMap[key] });
  }

  return (
    <div className="space-y-8">
          {grouped.map(({ section, questions: sectionQuestions }, gi) => (
            <div key={gi}>
              {section && (
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <h4 className="text-sm font-semibold text-white">{section.label}</h4>
                </div>
              )}

              <div className="space-y-8">
                {sectionQuestions.map((question) => {
                  const dist = results[question.id];
                  if (!dist || dist.totalAnswers === 0) return null;

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * question.question_order }}
                    >
                      {/* Question header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-1.5 rounded-lg bg-white/5 text-sky-400 shrink-0 mt-0.5">
                          <QuestionTypeIcon type={question.question_type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium leading-snug">
                            Q{question.question_order}: {question.question_text}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1">
                            {dist.totalAnswers} response{dist.totalAnswers !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {(dist.questionType === 'multiple_choice' ||
                        dist.questionType === 'likert_single') &&
                        Object.keys(dist.choiceCounts).length > 0 && (
                          <ChoiceDistribution distribution={dist} />
                        )}

                      {dist.questionType === 'ranking' &&
                        Object.keys(dist.rankingAverages).length > 0 && (
                          <RankingResults distribution={dist} />
                        )}

                      {dist.questionType === 'matrix_likert' &&
                        Object.keys(dist.matrixCounts).length > 0 && (
                          <MatrixResults distribution={dist} />
                        )}

                      {dist.questionType === 'open_ended' &&
                        dist.openEndedAnswers.length > 0 && (
                          <OpenEndedResults distribution={dist} />
                        )}

                      {/* Divider */}
                      <div className="mt-6 border-b border-white/5" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
    </div>
  );
}
