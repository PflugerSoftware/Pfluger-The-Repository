import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Edit3,
  Zap,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  User,
  Calendar,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { usePitchData } from './usePitchData';
import { PitchReviewPanel } from '../../components/Pitch/PitchReviewPanel';
import { PitchBuilder } from '../../components/Pitch/PitchBuilder';
import { GreenLitFlow } from '../../components/Pitch/GreenLitFlow';
import type { Pitch } from '../../services/pitchService';

type PitchPath = 'choice' | 'greenlit' | 'builder';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800', icon: Clock },
  revise: { label: 'Revise & Resubmit', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800', icon: Edit3 },
  greenlit: { label: 'Green Lit!', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800', icon: Zap },
};

interface PitchSubmissionProps {
  initialViewMode?: 'my-pitches' | 'new';
}

const PitchSubmission: React.FC<PitchSubmissionProps> = ({ initialViewMode = 'new' }) => {
  const data = usePitchData();

  // View state
  const [viewMode, setViewMode] = useState<'my-pitches' | 'new'>(initialViewMode);
  const [pitchPath, setPitchPath] = useState<PitchPath>('choice');
  const [expandedPitch, setExpandedPitch] = useState<string | null>(null);
  const [selectedGreenlitPitch, setSelectedGreenlitPitch] = useState<Pitch | null>(null);
  const [isEditingPitch, setIsEditingPitch] = useState(false);

  useEffect(() => { setViewMode(initialViewMode); }, [initialViewMode]);

  // Load pitch details when expanded pitch changes
  useEffect(() => { data.loadPitchDetails(expandedPitch); }, [expandedPitch]);

  const handleStartCustom = () => {
    setPitchPath('builder');
    setSelectedGreenlitPitch(null);
    data.resetPitch();
  };

  const handleStartGreenLit = () => {
    setPitchPath('greenlit');
    setSelectedGreenlitPitch(null);
    data.setIsPitchComplete(false);
  };

  const handleClaimGreenlit = async () => {
    if (!selectedGreenlitPitch) return;
    const success = await data.handleClaimGreenlit(selectedGreenlitPitch);
    if (success) {
      setViewMode('my-pitches');
      setPitchPath('choice');
      setExpandedPitch(selectedGreenlitPitch.id);
      setSelectedGreenlitPitch(null);
    }
  };

  const handleBack = () => {
    if (pitchPath === 'builder' || pitchPath === 'greenlit') {
      setPitchPath('choice');
      setSelectedGreenlitPitch(null);
    } else if (pitchPath === 'choice') {
      setViewMode('my-pitches');
    }
  };

  const handleSubmit = async () => {
    const newPitch = await data.handleSubmit();
    if (newPitch) {
      setViewMode('my-pitches');
      setPitchPath('choice');
      setSelectedGreenlitPitch(null);
      setExpandedPitch(newPitch.id);
    }
  };

  // Render choice screen
  const renderChoiceScreen = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">How would you like to pitch?</h2>
        <p className="text-gray-400">Choose a path that fits your research idea</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartGreenLit}
          className="bg-card border border-card rounded-xl p-8 text-left hover:border-green-800 transition-all group">
          <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-900/70 transition-colors">
            <Zap className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Choose a GreenLit Topic</h3>
          <p className="text-gray-400 text-sm mb-4">Select from pre-approved research topics already worked out by the R&B team.</p>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Sparkles className="w-4 h-4" /><span>Fast-track approval</span>
          </div>
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartCustom}
          className="bg-card border border-card rounded-xl p-8 text-left hover:border-gray-600 transition-all group">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition-colors">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pitch Your Own Idea</h3>
          <p className="text-gray-400 text-sm mb-4">Have a unique research idea? Build your pitch through conversation with AI.</p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <CheckCircle className="w-4 h-4" /><span>AI-assisted development</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  // Render My Pitches view
  const renderMyPitches = () => (
    <div className="flex gap-6">
      {/* Left: Pitch List */}
      <div className="w-80 shrink-0 space-y-2">
        {data.myPitches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No pitches yet.</p>
            <p className="text-sm mt-1">Create a new pitch to get started.</p>
          </div>
        ) : (
          data.myPitches.map((pitch, index) => {
            const isSelected = expandedPitch === pitch.id;
            const status = STATUS_CONFIG[pitch.status];
            const StatusIcon = status.icon;
            return (
              <motion.button key={pitch.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                onClick={() => setExpandedPitch(isSelected ? null : pitch.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${isSelected ? 'bg-card border-2 border-sky-500' : 'bg-card border border-card hover:border-gray-600'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">{pitch.id}</span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg}`}>
                    <StatusIcon className={`w-3 h-3 ${status.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{pitch.title}</h3>
                <div className="space-y-1">
                  {pitch.userName && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <User className="w-3 h-3" /><span>{pitch.userName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" /><span>{pitch.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Right: Review Panel */}
      <div className="flex-1 min-w-0">
        {expandedPitch ? (
          (() => {
            const pitch = data.myPitches.find(p => p.id === expandedPitch);
            if (!pitch) return null;
            return (
              <PitchReviewPanel
                pitch={pitch}
                currentUser={data.currentUser}
                isEditingPitch={isEditingPitch}
                setIsEditingPitch={setIsEditingPitch}
                pitchComments={data.pitchComments}
                commentInput={data.commentInput}
                setCommentInput={data.setCommentInput}
                pitchCollaborators={data.pitchCollaborators}
                allUsers={data.allUsers}
                onUpdateField={data.handleUpdatePitchField}
                onMethodChange={data.handleMethodChange}
                onStatusChange={data.handleStatusChange}
                onAddComment={data.handleAddComment}
                onAddCollaborator={data.handleAddCollaborator}
                onRemoveCollaborator={data.handleRemoveCollaborator}
              />
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

  // Render main content
  const renderContent = () => {
    if (data.isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      );
    }

    if (viewMode === 'my-pitches') return renderMyPitches();

    switch (pitchPath) {
      case 'choice':
        return renderChoiceScreen();
      case 'greenlit':
        return (
          <GreenLitFlow
            availableGreenlit={data.availableGreenlit}
            selectedPitch={selectedGreenlitPitch}
            isSubmitting={data.isSubmitting}
            onSelectPitch={setSelectedGreenlitPitch}
            onClaim={handleClaimGreenlit}
          />
        );
      case 'builder':
        return (
          <PitchBuilder
            pitchData={data.pitchData}
            isPitchComplete={data.isPitchComplete}
            isSubmitting={data.isSubmitting}
            submitError={data.submitError}
            chatMessages={data.chatMessages}
            onPitchUpdate={data.handlePitchUpdate}
            onMessagesChange={data.setChatMessages}
            onSubmit={handleSubmit}
            onContinueEditing={() => data.setIsPitchComplete(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {viewMode === 'new' && pitchPath !== 'choice' && (
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-bold text-white">Pitch</h1>
              {data.authUser?.role === 'admin' && viewMode === 'my-pitches' && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-900/50 text-purple-300 border border-purple-700">
                  Admin View: All Pitches
                </span>
              )}
            </div>
            <p className="text-gray-400">
              {viewMode === 'my-pitches'
                ? data.authUser?.role === 'admin' ? 'Review and manage all submitted pitches' : 'Review and manage your submitted pitches'
                : 'Submit a new research idea'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setViewMode('my-pitches'); setExpandedPitch(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'my-pitches' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            Review Pitches
          </button>
          <button onClick={() => { setViewMode('new'); setPitchPath('choice'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'new' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            New Pitch
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={`${viewMode}-${pitchPath}`}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PitchSubmission;
