import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  CheckCircle,
  Send,
  Clock,
  Edit3,
  Zap,
  Lightbulb,
  Sparkles,
  Check,
  ArrowLeft
} from 'lucide-react';
import { PitchCard, type PitchData } from '../../components/Pitch/PitchCard';
import { PitchChatPanel } from '../../components/Pitch/PitchChatPanel';
import { ScheduleCard } from '../../components/Pitch/ScheduleCard';

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
}

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

// Existing pitches data
const MY_PITCHES: SubmittedPitch[] = [
  {
    id: 'P-2025-001',
    title: 'Biophilic Design Impact on Student Focus',
    category: 'Psychology',
    submittedDate: '2025-01-15',
    status: 'greenlit',
    comments: [
      { author: 'GreenLight Team', date: '2025-01-18', message: 'Great research question! We love the focus on measurable outcomes. Green Lit!', isReviewer: true }
    ]
  },
  {
    id: 'P-2025-002',
    title: 'Mass Timber Acoustic Performance',
    category: 'Sustainability',
    submittedDate: '2025-02-01',
    status: 'revise',
    comments: [
      { author: 'GreenLight Team', date: '2025-02-05', message: 'Interesting topic! Can you clarify the measurement methodology? How will you collect acoustic data?', isReviewer: true },
      { author: 'You', date: '2025-02-07', message: 'Updated methodology to include SPL measurements at 5 locations per space, pre and post occupancy.', isReviewer: false }
    ]
  },
  {
    id: 'P-2025-003',
    title: 'Wayfinding in K-12 Campuses',
    category: 'Campus Life',
    submittedDate: '2025-02-10',
    status: 'pending',
    comments: []
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
    console.log('Submitting pitch:', {
      isGreenLit: !!selectedGreenLitTopic,
      greenLitTopic: selectedGreenLitTopic?.id,
      pitchData
    });
    alert('Pitch submitted successfully! The GreenLight team will review within 2 weeks.');
    setViewMode('my-pitches');
    setPitchPath('choice');
    setSelectedGreenLitTopic(null);
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

  // Check if pitch is ready to submit (at least research idea and methodology)
  const canSubmit = pitchData.researchIdea && pitchData.methodology;

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

  // Render the pitch builder (unified layout for both GreenLit and Custom)
  const renderPitchBuilder = () => {
    const isGreenLitFlow = pitchPath === 'greenlit';

    return (
      <div className="flex gap-6 h-full overflow-hidden">
        {/* Left: GreenLit List OR Chat Panel */}
        <div className="flex-1 min-w-0 h-full">
          {isGreenLitFlow ? renderGreenLitList() : (
            <PitchChatPanel
              pitchData={pitchData}
              onUpdateField={handleUpdateField}
              isGreenLit={false}
            />
          )}
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

  // Render My Pitches view
  const renderMyPitches = () => (
    <div className="space-y-4 max-w-3xl">
      {MY_PITCHES.map((pitch, index) => {
        const isExpanded = expandedPitch === pitch.id;
        const status = STATUS_CONFIG[pitch.status];
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={pitch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-card rounded-xl overflow-hidden"
          >
            {/* Pitch Header */}
            <button
              onClick={() => setExpandedPitch(isExpanded ? null : pitch.id)}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-800/30 transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </motion.div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500">{pitch.id}</span>
                  <span className="text-white font-medium">{pitch.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{pitch.category}</span>
                  <span className="text-xs text-gray-600">Submitted {pitch.submittedDate}</span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${status.bg} ${status.border} border`}>
                <StatusIcon className={`w-3 h-3 ${status.color}`} />
                <span className={status.color}>{status.label}</span>
              </div>
            </button>

            {/* Expanded Content - Review Thread */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-gray-800 ml-8">
                    {pitch.comments.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Awaiting review from GreenLight team...</p>
                    ) : (
                      <div className="space-y-3">
                        {pitch.comments.map((comment, i) => (
                          <div key={i} className={`flex gap-3 ${!comment.isReviewer ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              comment.isReviewer ? 'bg-green-900/50' : 'bg-gray-700'
                            }`}>
                              {comment.isReviewer ? (
                                <Zap className="w-4 h-4 text-green-400" />
                              ) : (
                                <span className="text-xs text-white">You</span>
                              )}
                            </div>
                            <div className={`flex-1 max-w-[80%] ${!comment.isReviewer ? 'text-right' : ''}`}>
                              <div className={`inline-block rounded-xl p-3 ${
                                comment.isReviewer ? 'bg-gray-800' : 'bg-white text-black'
                              }`}>
                                <p className={`text-sm ${comment.isReviewer ? 'text-gray-300' : 'text-black'}`}>
                                  {comment.message}
                                </p>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{comment.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input for revise status */}
                    {pitch.status === 'revise' && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a response..."
                            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                          />
                          <button className="p-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
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

  const isBuilderView = pitchPath === 'builder' || pitchPath === 'greenlit';

  return (
    <div className={`px-12 py-8 ${isBuilderView ? 'h-screen overflow-hidden flex flex-col' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 shrink-0">
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
              ? 'Track your submitted research ideas'
              : 'Submit a new research idea'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={isBuilderView ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : ''}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pitchPath}
            className={isBuilderView ? 'h-full' : ''}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PitchSubmission;
