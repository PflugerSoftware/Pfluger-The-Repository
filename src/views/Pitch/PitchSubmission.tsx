import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Send,
  Clock,
  Edit3,
  Zap,
  Lightbulb,
  Sparkles,
  Check,
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Target
} from 'lucide-react';
import { PitchCard, type PitchData } from '../../components/Pitch/PitchCard';
import { PitchChatPanel } from '../../components/Pitch/PitchChatPanel';
import { ScheduleCard } from '../../components/Pitch/ScheduleCard';
import type { ExtractedPitch } from '../../services/pitchAgent';

// Types
type PitchStatus = 'pending' | 'revise' | 'greenlit';
type PitchPath = 'choice' | 'greenlit' | 'builder';

interface ReviewComment {
  author: string;
  date: string;
  message: string;
  isReviewer: boolean;
}

interface SubmittedPitch {
  id: string;
  title: string;
  category: string;
  submittedDate: string;
  status: PitchStatus;
  comments: ReviewComment[];
  // Full pitch details
  researchIdea: string;
  scope: 'simple' | 'medium' | 'complex' | '';
  methodology: string;
  alignment: 'current-project' | 'thought-leadership' | '';
  timeline: string;
  impact: string;
  submittedBy: string;
}

// Combined scope + methodology options (4 hours/week = timeline calculation)
const RESEARCH_METHODS = [
  // Simple (20-60 hours) → 5-15 weeks
  { value: 'simple|Infographic Creation', scope: 'simple', methodology: 'Infographic Creation', hours: [20, 60], weeks: [5, 15] },
  { value: 'simple|Expert Interview', scope: 'simple', methodology: 'Expert Interview', hours: [20, 60], weeks: [5, 15] },
  { value: 'simple|Literature Review', scope: 'simple', methodology: 'Literature Review', hours: [20, 60], weeks: [5, 15] },
  // Medium (60-120 hours) → 15-30 weeks
  { value: 'medium|Survey/Post-Occupancy Design', scope: 'medium', methodology: 'Survey/Post-Occupancy Design', hours: [60, 120], weeks: [15, 30] },
  { value: 'medium|Annotated Bibliography', scope: 'medium', methodology: 'Annotated Bibliography', hours: [60, 120], weeks: [15, 30] },
  // Complex (120+ hours) → 30+ weeks
  { value: 'complex|Case Study Analysis', scope: 'complex', methodology: 'Case Study Analysis', hours: [120, 200], weeks: [30, 50] },
  { value: 'complex|Experimental Design', scope: 'complex', methodology: 'Experimental Design', hours: [120, 200], weeks: [30, 50] },
  { value: 'complex|Long-form Whitepaper', scope: 'complex', methodology: 'Long-form Whitepaper', hours: [120, 200], weeks: [30, 50] },
];

// Helper to get method info from combined value
const getMethodInfo = (value: string) => RESEARCH_METHODS.find(m => m.value === value);

// Helper to format timeline from weeks
const formatTimeline = (weeks: [number, number]) => `${weeks[0]}-${weeks[1]} weeks`;

// Scope labels for display
const SCOPE_LABELS: Record<string, { label: string; color: string }> = {
  simple: { label: 'Simple', color: 'text-green-400' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  complex: { label: 'Complex', color: 'text-red-400' },
};

interface GreenLitTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  suggestedScope: 'simple' | 'medium' | 'complex';
  suggestedMethods: string[];
}

// GreenLit pre-approved topics
const GREENLIT_TOPICS: GreenLitTopic[] = [
  {
    id: 'GL-001',
    title: 'Post-Occupancy Evaluation Framework',
    description: 'Develop a standardized POE survey template for K-12 educational facilities that measures student comfort, teacher satisfaction, and learning environment effectiveness.',
    category: 'Campus Life',
    suggestedScope: 'medium',
    suggestedMethods: ['Survey/Post-Occupancy Design', 'Literature Review']
  },
  {
    id: 'GL-002',
    title: 'Biophilic Design Impact Study',
    description: 'Research the measurable effects of biophilic design elements (natural light, plants, natural materials) on student focus and well-being in classroom settings.',
    category: 'Psychology',
    suggestedScope: 'complex',
    suggestedMethods: ['Case Study Analysis', 'Survey/Post-Occupancy Design']
  },
  {
    id: 'GL-003',
    title: 'Flexible Learning Space Configurations',
    description: 'Document and analyze different furniture configurations and their impact on collaborative learning in elementary school classrooms.',
    category: 'Immersive Learning',
    suggestedScope: 'simple',
    suggestedMethods: ['Infographic Creation', 'Literature Review']
  },
  {
    id: 'GL-004',
    title: 'Mass Timber in Educational Buildings',
    description: 'Create a comprehensive resource on mass timber applications, benefits, and case studies specific to Texas educational facilities.',
    category: 'Sustainability',
    suggestedScope: 'medium',
    suggestedMethods: ['Annotated Bibliography/Resources', 'Case Study Analysis']
  },
  {
    id: 'GL-005',
    title: 'Acoustic Performance Standards',
    description: 'Research and document best practices for acoustic design in music education spaces and fine arts facilities.',
    category: 'Fine Arts',
    suggestedScope: 'medium',
    suggestedMethods: ['Literature Review', 'Expert Interview']
  }
];

// Default pitches data
const DEFAULT_PITCHES: SubmittedPitch[] = [
  {
    id: 'P-2026-001',
    title: 'Biophilic Design Impact on Student Focus',
    category: 'Psychology',
    submittedDate: '2026-01-05',
    status: 'greenlit',
    comments: [
      { author: 'GreenLight Team', date: '2026-01-08', message: 'Great research question! We love the focus on measurable outcomes. Green Lit!', isReviewer: true }
    ],
    researchIdea: 'How do biophilic design elements (natural light, plants, natural materials) measurably impact student focus and attention span in K-12 classroom settings?',
    scope: 'complex',
    methodology: 'Case Study Analysis',
    alignment: 'thought-leadership',
    timeline: 'Q1-Q2 2026',
    impact: 'Design guidelines for incorporating biophilic elements in future school projects',
    submittedBy: 'Katherine Wiley'
  },
  {
    id: 'P-2026-002',
    title: 'Mass Timber Acoustic Performance',
    category: 'Sustainability',
    submittedDate: '2026-01-10',
    status: 'revise',
    comments: [
      { author: 'GreenLight Team', date: '2026-01-13', message: 'Interesting topic! Can you clarify the measurement methodology? How will you collect acoustic data?', isReviewer: true },
      { author: 'You', date: '2026-01-15', message: 'Updated methodology to include SPL measurements at 5 locations per space, pre and post occupancy.', isReviewer: false }
    ],
    researchIdea: 'What is the acoustic performance of mass timber construction compared to traditional steel/concrete in educational settings?',
    scope: 'medium',
    methodology: 'Survey/Post-Occupancy Design',
    alignment: 'current-project',
    timeline: 'Q1 2026',
    impact: 'Acoustic design recommendations for mass timber school projects',
    submittedBy: 'Nilen Varade'
  },
  {
    id: 'P-2026-003',
    title: 'Wayfinding in K-12 Campuses',
    category: 'Campus Life',
    submittedDate: '2026-01-17',
    status: 'pending',
    comments: [],
    researchIdea: 'How can wayfinding design in K-12 campuses be improved to reduce student confusion and increase independence, especially for younger students?',
    scope: 'simple',
    methodology: 'Literature Review',
    alignment: 'thought-leadership',
    timeline: 'Q1 2026',
    impact: 'Wayfinding design checklist for elementary schools',
    submittedBy: 'Jonathan Bryer'
  }
];

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800', icon: Clock },
  revise: { label: 'Revise & Resubmit', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800', icon: Edit3 },
  greenlit: { label: 'Green Lit!', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800', icon: Zap }
};

interface PitchSubmissionProps {
  initialViewMode?: 'my-pitches' | 'new';
}

const PitchSubmission: React.FC<PitchSubmissionProps> = ({ initialViewMode = 'new' }) => {
  // View state
  const [viewMode, setViewMode] = useState<'my-pitches' | 'new'>(initialViewMode);
  const [pitchPath, setPitchPath] = useState<PitchPath>('choice');
  const [expandedPitch, setExpandedPitch] = useState<string | null>(null);

  // GreenLit state
  const [selectedGreenLitTopic, setSelectedGreenLitTopic] = useState<GreenLitTopic | null>(null);

  // Submitted pitches state
  const [submittedPitches, setSubmittedPitches] = useState<SubmittedPitch[]>(DEFAULT_PITCHES);

  // Track if pitch is ready for final review
  const [isPitchComplete, setIsPitchComplete] = useState(false);

  // Comment input for review
  const [commentInput, setCommentInput] = useState('');

  // Pitch data (shared between GreenLit and Custom flows)
  const [pitchData, setPitchData] = useState<PitchData>({
    researchIdea: '',
    alignment: '',
    methodology: '',
    scopeTier: '',
    impact: '',
    resources: '',
    timeline: '',
    partners: ''
  });

  // Handlers
  const handleUpdateField = (field: keyof PitchData, value: string) => {
    setPitchData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartCustom = () => {
    setPitchPath('builder');
    setSelectedGreenLitTopic(null);
    setIsPitchComplete(false);
    setPitchData({
      researchIdea: '',
      alignment: '',
      methodology: '',
      scopeTier: '',
      impact: '',
      resources: '',
      timeline: '',
      partners: ''
    });
  };

  const handleStartGreenLit = () => {
    setPitchPath('greenlit');
    setSelectedGreenLitTopic(null);
    setIsPitchComplete(false);
    setPitchData({
      researchIdea: '',
      alignment: '',
      methodology: '',
      scopeTier: '',
      impact: '',
      resources: '',
      timeline: '',
      partners: ''
    });
  };

  const handleSelectGreenLitTopic = (topic: GreenLitTopic) => {
    setSelectedGreenLitTopic(topic);
    // Pre-populate pitch data from the GreenLit topic
    setPitchData({
      researchIdea: topic.description,
      alignment: 'thought-leadership',
      methodology: topic.suggestedMethods[0] || '',
      scopeTier: topic.suggestedScope,
      impact: '',
      resources: '',
      timeline: '',
      partners: ''
    });
  };

  const handleBack = () => {
    if (pitchPath === 'builder' || pitchPath === 'greenlit') {
      setPitchPath('choice');
      setSelectedGreenLitTopic(null);
    } else if (pitchPath === 'choice') {
      setViewMode('my-pitches');
    }
  };

  const handleSubmit = () => {
    // Generate a new pitch ID
    const pitchCount = submittedPitches.length + 1;
    const newId = `P-2026-${String(pitchCount).padStart(3, '0')}`;

    // Extract a title from the research idea (first sentence or first 50 chars)
    const titleMatch = pitchData.researchIdea.match(/^[^.!?]+/);
    const title = titleMatch
      ? titleMatch[0].slice(0, 60) + (titleMatch[0].length > 60 ? '...' : '')
      : pitchData.researchIdea.slice(0, 60) + '...';

    // Create the new pitch with full data
    const newPitch: SubmittedPitch = {
      id: newId,
      title: title,
      category: pitchData.alignment === 'current-project' ? 'Project Research' : 'Thought Leadership',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      comments: [],
      researchIdea: pitchData.researchIdea,
      scope: pitchData.scopeTier as 'simple' | 'medium' | 'complex' | '',
      methodology: pitchData.methodology,
      alignment: pitchData.alignment,
      timeline: pitchData.timeline,
      impact: pitchData.impact,
      submittedBy: 'You' // TODO: Get from auth context
    };

    // Add to submitted pitches
    setSubmittedPitches(prev => [newPitch, ...prev]);

    // Reset and navigate to My Pitches
    setViewMode('my-pitches');
    setPitchPath('choice');
    setSelectedGreenLitTopic(null);
    setIsPitchComplete(false);
    setPitchData({
      researchIdea: '',
      alignment: '',
      methodology: '',
      scopeTier: '',
      impact: '',
      resources: '',
      timeline: '',
      partners: ''
    });
  };

  // Handler for pitch updates from the AI agent
  const handlePitchUpdate = (extracted: ExtractedPitch) => {
    setPitchData(prev => {
      const updates: Partial<PitchData> = {};

      if (extracted.researchIdea) {
        updates.researchIdea = extracted.researchIdea;
      }
      if (extracted.scope) {
        updates.scopeTier = extracted.scope;
      }
      if (extracted.methodology) {
        updates.methodology = extracted.methodology;
      }
      if (extracted.projectConnection) {
        // Map agent values to PitchData alignment type
        const alignment = extracted.projectConnection.toLowerCase();
        if (alignment === 'current-project' || alignment === 'thought-leadership') {
          updates.alignment = alignment;
        }
      }
      if (extracted.successMetrics) {
        updates.impact = extracted.successMetrics;
      }
      if (extracted.timeline) {
        updates.timeline = extracted.timeline;
      }

      return { ...prev, ...updates };
    });

    // Check if pitch is marked complete by the agent
    if (extracted.isComplete) {
      setIsPitchComplete(true);
    }
  };

  // Check if pitch is ready to submit (at least research idea and methodology)
  const canSubmit = pitchData.researchIdea && pitchData.methodology;

  // Handler to update a submitted pitch field (for reviewers)
  const handleUpdatePitchField = (pitchId: string, field: keyof SubmittedPitch, value: string) => {
    setSubmittedPitches(prev => prev.map(p =>
      p.id === pitchId ? { ...p, [field]: value } : p
    ));
  };

  // Handler to change research method (combined scope + methodology + auto timeline)
  const handleMethodChange = (pitchId: string, combinedValue: string) => {
    const methodInfo = getMethodInfo(combinedValue);

    setSubmittedPitches(prev => prev.map(p => {
      if (p.id !== pitchId) return p;

      if (!methodInfo) {
        return { ...p, scope: '', methodology: '', timeline: '' };
      }

      return {
        ...p,
        scope: methodInfo.scope as 'simple' | 'medium' | 'complex',
        methodology: methodInfo.methodology,
        timeline: formatTimeline(methodInfo.weeks as [number, number])
      };
    }));
  };

  // Handler to change pitch status
  const handleStatusChange = (pitchId: string, newStatus: PitchStatus) => {
    setSubmittedPitches(prev => prev.map(p =>
      p.id === pitchId ? { ...p, status: newStatus } : p
    ));
  };

  // Handler to add a comment to a pitch
  const handleAddComment = (pitchId: string, isReviewer: boolean) => {
    if (!commentInput.trim()) return;

    const newComment: ReviewComment = {
      author: isReviewer ? 'GreenLight Team' : 'You',
      date: new Date().toISOString().split('T')[0],
      message: commentInput,
      isReviewer
    };

    setSubmittedPitches(prev => prev.map(p =>
      p.id === pitchId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
    setCommentInput('');
  };

  // Render initial choice screen
  const renderChoiceScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">How would you like to pitch?</h2>
        <p className="text-gray-400">Choose a path that fits your research idea</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* GreenLit Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartGreenLit}
          className="bg-card border border-card rounded-xl p-8 text-left hover:border-green-800 transition-all group"
        >
          <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-900/70 transition-colors">
            <Zap className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Choose a GreenLit Topic</h3>
          <p className="text-gray-400 text-sm mb-4">
            Select from pre-approved research topics already worked out by the R&B team.
          </p>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Fast-track approval</span>
          </div>
        </motion.button>

        {/* Custom Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartCustom}
          className="bg-card border border-card rounded-xl p-8 text-left hover:border-gray-600 transition-all group"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition-colors">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pitch Your Own Idea</h3>
          <p className="text-gray-400 text-sm mb-4">
            Have a unique research idea? Build your pitch through conversation with AI.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>AI-assisted development</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  // Render GreenLit topic list (left panel)
  const renderGreenLitList = () => (
    <div className="bg-card border border-card rounded-2xl h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800 shrink-0">
        <h2 className="text-lg font-bold text-white">GreenLit Topics</h2>
        <p className="text-sm text-gray-500">Select a pre-approved research topic</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {GREENLIT_TOPICS.map((topic) => {
          const isSelected = selectedGreenLitTopic?.id === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => handleSelectGreenLitTopic(topic)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-green-900/30 border border-green-700'
                  : 'bg-gray-800/50 border border-transparent hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium ${isSelected ? 'text-green-400' : 'text-white'}`}>
                  {topic.title}
                </h3>
                <span className="text-xs text-gray-500">-</span>
                <span className="text-xs text-gray-400 capitalize">{topic.suggestedScope}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-green-400 ml-auto" />
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{topic.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Progress steps for pitch development
  const PITCH_STEPS = [
    { id: 'idea', label: 'Research Idea', description: 'What do you want to explore?' },
    { id: 'goal', label: 'Goal & Outcome', description: 'What will you create?' },
    { id: 'scope', label: 'Scope & Method', description: 'How will you approach it?' },
    { id: 'details', label: 'Timeline & Partners', description: 'When and with whom?' },
    { id: 'submit', label: 'Submit', description: 'Ready for review' },
  ];

  // Determine current step based on pitchData (simplified logic)
  const getCurrentStep = () => {
    if (!pitchData.researchIdea) return 0;
    if (!pitchData.alignment) return 1;
    if (!pitchData.methodology) return 2;
    if (!pitchData.timeline) return 3;
    return 4;
  };

  // Render progress sidebar
  const renderProgressSidebar = () => {
    const currentStep = getCurrentStep();

    return (
      <div className="bg-card border border-card rounded-2xl p-4 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-white mb-4">Pitch Progress</h3>

        <div className="space-y-3 flex-1">
          {PITCH_STEPS.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                  isComplete ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-sky-500 text-white' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isComplete || isCurrent ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <ScheduleCard proposedScope={pitchData.scopeTier as 'simple' | 'medium' | 'complex' | ''} />
        </div>
      </div>
    );
  };

  // Render final review panel when pitch is complete
  const renderFinalReview = () => {
    const scopeHours = {
      simple: '20-60',
      medium: '60-120',
      complex: '120+'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-card rounded-2xl h-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-green-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pitch Ready for Review</h2>
              <p className="text-sm text-gray-400">Review your pitch before submitting</p>
            </div>
          </div>
        </div>

        {/* Pitch Summary */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Research Question */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Research Question</h3>
            <p className="text-white">{pitchData.researchIdea || 'Not specified'}</p>
          </div>

          {/* Scope & Methodology */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Scope</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  pitchData.scopeTier === 'simple' ? 'bg-green-900/50 text-green-400' :
                  pitchData.scopeTier === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                  pitchData.scopeTier === 'complex' ? 'bg-red-900/50 text-red-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {pitchData.scopeTier || 'Not set'}
                </span>
                {pitchData.scopeTier && (
                  <span className="text-xs text-gray-500">
                    ({scopeHours[pitchData.scopeTier as keyof typeof scopeHours]} hours)
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Methodology</h3>
              <p className="text-white text-sm">{pitchData.methodology || 'Not specified'}</p>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Connection</h3>
            <p className="text-white text-sm capitalize">
              {pitchData.alignment === 'current-project' ? 'Connected to Current Project' :
               pitchData.alignment === 'thought-leadership' ? 'Thought Leadership / General Research' :
               'Not specified'}
            </p>
          </div>

          {/* Timeline */}
          {pitchData.timeline && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</h3>
              <p className="text-white text-sm">{pitchData.timeline}</p>
            </div>
          )}

          {/* Impact */}
          {pitchData.impact && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Expected Impact</h3>
              <p className="text-white text-sm">{pitchData.impact}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-500 transition-all"
          >
            <Send className="w-4 h-4" />
            Submit Pitch
          </motion.button>
          <button
            onClick={() => setIsPitchComplete(false)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Continue editing
          </button>
        </div>
      </motion.div>
    );
  };

  // Render the pitch builder (unified layout for both GreenLit and Custom)
  const renderPitchBuilder = () => {
    const isGreenLitFlow = pitchPath === 'greenlit';

    // Custom flow: chat + progress sidebar OR final review
    if (!isGreenLitFlow) {
      // Show final review when pitch is complete
      if (isPitchComplete) {
        return (
          <div className="flex gap-6 h-full overflow-hidden max-w-3xl mx-auto">
            <div className="flex-1 min-w-0 h-full">
              {renderFinalReview()}
            </div>
          </div>
        );
      }

      // Show chat + progress sidebar during development
      return (
        <div className="flex gap-6 h-full overflow-hidden">
          {/* Left: Chat Panel */}
          <div className="flex-1 min-w-0 h-full">
            <PitchChatPanel onPitchUpdate={handlePitchUpdate} />
          </div>

          {/* Right: Progress Sidebar */}
          <div className="w-72 shrink-0 h-full">
            {renderProgressSidebar()}
          </div>
        </div>
      );
    }

    // GreenLit flow: topic list + cards
    return (
      <div className="flex gap-6 h-full overflow-hidden">
        {/* Left: GreenLit List */}
        <div className="flex-1 min-w-0 h-full">
          {renderGreenLitList()}
        </div>

        {/* Right: Schedule + Pitch Card (vstack) */}
        <div className="w-96 shrink-0 flex flex-col gap-4 h-full overflow-hidden">
          <ScheduleCard proposedScope={pitchData.scopeTier as 'simple' | 'medium' | 'complex' | ''} />

          <div className="flex-1 min-h-0 overflow-hidden">
            <PitchCard
              data={pitchData}
              onUpdate={handleUpdateField}
              isGreenLit={isGreenLitFlow && !!selectedGreenLitTopic}
              greenLitTitle={selectedGreenLitTopic?.title}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shrink-0 ${
              canSubmit
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            Submit Pitch
          </motion.button>

        </div>
      </div>
    );
  };

  // Render My Pitches view with full review panel
  const renderMyPitches = () => (
    <div className="flex gap-6 h-full">
      {/* Left: Pitch List */}
      <div className="w-80 shrink-0 space-y-2 overflow-y-auto">
        {submittedPitches.map((pitch, index) => {
          const isSelected = expandedPitch === pitch.id;
          const status = STATUS_CONFIG[pitch.status];
          const StatusIcon = status.icon;

          return (
            <motion.button
              key={pitch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setExpandedPitch(isSelected ? null : pitch.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-card border-2 border-sky-500'
                  : 'bg-card border border-card hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-gray-500">{pitch.id}</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg}`}>
                  <StatusIcon className={`w-3 h-3 ${status.color}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{pitch.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{pitch.submittedBy}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Right: Review Panel */}
      <div className="flex-1 min-w-0">
        {expandedPitch ? (
          (() => {
            const pitch = submittedPitches.find(p => p.id === expandedPitch);
            if (!pitch) return null;
            const status = STATUS_CONFIG[pitch.status];
            const StatusIcon = status.icon;
            const methodInfo = pitch.scope && pitch.methodology
              ? RESEARCH_METHODS.find(m => m.scope === pitch.scope && m.methodology === pitch.methodology)
              : null;
            const scopeLabel = pitch.scope ? SCOPE_LABELS[pitch.scope] : null;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-card rounded-2xl h-full flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500">{pitch.id}</span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bg} ${status.border} border`}>
                          <StatusIcon className={`w-3 h-3 ${status.color}`} />
                          <span className={status.color}>{status.label}</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">{pitch.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {pitch.submittedBy}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {pitch.submittedDate}
                        </span>
                      </div>
                    </div>

                    {/* Status Change Dropdown */}
                    <select
                      value={pitch.status}
                      onChange={(e) => handleStatusChange(pitch.id, e.target.value as PitchStatus)}
                      className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="revise">Revise & Resubmit</option>
                      <option value="greenlit">Green Lit!</option>
                    </select>
                  </div>
                </div>

                {/* Content - Two columns */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column: Pitch Details */}
                    <div className="space-y-5">
                      {/* Research Question */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                          Research Question
                        </label>
                        <textarea
                          value={pitch.researchIdea}
                          onChange={(e) => handleUpdatePitchField(pitch.id, 'researchIdea', e.target.value)}
                          rows={3}
                          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                        />
                      </div>

                      {/* Research Method (Combined Scope + Methodology) */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                          Research Method
                        </label>
                        <select
                          value={pitch.scope && pitch.methodology ? `${pitch.scope}|${pitch.methodology}` : ''}
                          onChange={(e) => handleMethodChange(pitch.id, e.target.value)}
                          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">Select research method</option>
                          <optgroup label="Simple (5-15 weeks)">
                            {RESEARCH_METHODS.filter(m => m.scope === 'simple').map(m => (
                              <option key={m.value} value={m.value}>{m.methodology}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Medium (15-30 weeks)">
                            {RESEARCH_METHODS.filter(m => m.scope === 'medium').map(m => (
                              <option key={m.value} value={m.value}>{m.methodology}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Complex (30-50 weeks)">
                            {RESEARCH_METHODS.filter(m => m.scope === 'complex').map(m => (
                              <option key={m.value} value={m.value}>{m.methodology}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {/* Alignment */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                          Project Alignment
                        </label>
                        <select
                          value={pitch.alignment}
                          onChange={(e) => handleUpdatePitchField(pitch.id, 'alignment', e.target.value)}
                          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">Select type</option>
                          <option value="current-project">Current Project</option>
                          <option value="thought-leadership">Thought Leadership</option>
                        </select>
                      </div>

                      {/* Impact */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                          Expected Impact / Deliverable
                        </label>
                        <textarea
                          value={pitch.impact}
                          onChange={(e) => handleUpdatePitchField(pitch.id, 'impact', e.target.value)}
                          rows={2}
                          placeholder="What will this research produce?"
                          className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                        />
                      </div>

                      {/* Method Summary Card */}
                      {methodInfo && scopeLabel && (
                        <div className={`p-4 rounded-xl border ${
                          pitch.scope === 'simple' ? 'bg-green-900/20 border-green-800' :
                          pitch.scope === 'medium' ? 'bg-yellow-900/20 border-yellow-800' :
                          'bg-red-900/20 border-red-800'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${scopeLabel.color}`} />
                            <span className={`text-sm font-medium ${scopeLabel.color}`}>
                              {scopeLabel.label}
                            </span>
                          </div>
                          <p className="text-sm text-white mb-1">{methodInfo.methodology}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{methodInfo.hours[0]}-{methodInfo.hours[1]} hours</span>
                            <span>·</span>
                            <span>{pitch.timeline}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Comments */}
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Review Thread
                        </span>
                      </div>

                      {/* Comments List */}
                      <div className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-64">
                        {pitch.comments.length === 0 ? (
                          <p className="text-sm text-gray-500 italic py-4 text-center">
                            No comments yet. Add feedback below.
                          </p>
                        ) : (
                          pitch.comments.map((comment, i) => (
                            <div key={i} className={`flex gap-3 ${!comment.isReviewer ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                comment.isReviewer ? 'bg-green-900/50' : 'bg-gray-700'
                              }`}>
                                {comment.isReviewer ? (
                                  <Zap className="w-4 h-4 text-green-400" />
                                ) : (
                                  <User className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div className={`flex-1 ${!comment.isReviewer ? 'text-right' : ''}`}>
                                <div className={`inline-block rounded-xl p-3 max-w-[90%] ${
                                  comment.isReviewer ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                  <p className={`text-sm ${comment.isReviewer ? 'text-gray-300' : 'text-black'}`}>
                                    {comment.message}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {comment.author} · {comment.date}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="border-t border-gray-800 pt-4">
                        <div className="flex gap-2">
                          <textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add feedback or notes..."
                            rows={1}
                            className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                          />
                          <button
                            onClick={() => handleAddComment(pitch.id, false)}
                            disabled={!commentInput.trim()}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a pitch to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Determine what content to render
  const renderContent = () => {
    if (viewMode === 'my-pitches') {
      return renderMyPitches();
    }

    switch (pitchPath) {
      case 'choice':
        return renderChoiceScreen();
      case 'greenlit':
      case 'builder':
        return renderPitchBuilder();
      default:
        return null;
    }
  };

  const isFullHeightView = pitchPath === 'builder' || pitchPath === 'greenlit' || viewMode === 'my-pitches';

  return (
    <div className={`px-12 py-8 ${isFullHeightView ? 'h-screen overflow-hidden flex flex-col' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          {/* Back button */}
          {(viewMode === 'new' && pitchPath !== 'choice') && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}

          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Pitch</h1>
            <p className="text-gray-400">
              {viewMode === 'my-pitches'
                ? 'Review and manage submitted pitches'
                : 'Submit a new research idea'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setViewMode('my-pitches'); setExpandedPitch(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'my-pitches'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Review Pitches
          </button>
          <button
            onClick={() => { setViewMode('new'); setPitchPath('choice'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'new'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            New Pitch
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={isFullHeightView ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : ''}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${pitchPath}`}
            className={isFullHeightView ? 'h-full' : ''}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PitchSubmission;
