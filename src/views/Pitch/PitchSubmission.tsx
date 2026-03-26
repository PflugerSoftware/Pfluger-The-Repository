import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Zap,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { usePitchData } from './usePitchData';
import { PitchReviewPanel } from '../../components/Pitch/PitchReviewPanel';
import { PitchBuilder } from '../../components/Pitch/PitchBuilder';
import { GreenLitFlow } from '../../components/Pitch/GreenLitFlow';
import { PitchSessionSidebar } from '../../components/Pitch/PitchSessionSidebar';
import type { Pitch } from '../../services/pitchService';

type ContentView = 'choice' | 'greenlit' | 'builder' | 'review' | 'empty';

const PitchSubmission: React.FC = () => {
  const data = usePitchData();

  const [contentView, setContentView] = useState<ContentView>('empty');
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [selectedGreenlitPitch, setSelectedGreenlitPitch] = useState<Pitch | null>(null);
  const [isEditingPitch, setIsEditingPitch] = useState(false);

  const handleSelectPitch = async (pitch: Pitch) => {
    setIsEditingPitch(false);
    setSelectedPitch(pitch);
    if (pitch.status === 'draft') {
      await data.resumeDraft(pitch.id);
      setContentView('builder');
    } else {
      data.loadPitchDetails(pitch.id);
      setContentView('review');
    }
  };

  const handleNewPitch = () => {
    setSelectedPitch(null);
    setContentView('choice');
  };

  const handleStartCustom = async () => {
    const draftId = await data.startDraft();
    if (draftId) {
      const draft = data.myPitches.find(p => p.id === draftId);
      if (draft) setSelectedPitch(draft);
      setContentView('builder');
    }
  };

  const handleStartGreenLit = () => {
    setSelectedGreenlitPitch(null);
    setContentView('greenlit');
  };

  const handleClaimGreenlit = async () => {
    if (!selectedGreenlitPitch) return;
    const success = await data.handleClaimGreenlit(selectedGreenlitPitch);
    if (success) {
      setSelectedPitch(null);
      setContentView('empty');
      setSelectedGreenlitPitch(null);
    }
  };

  const handleBack = () => {
    if (contentView === 'builder' || contentView === 'greenlit') {
      setContentView('choice');
      setSelectedGreenlitPitch(null);
    } else if (contentView === 'choice') {
      setSelectedPitch(null);
      setContentView('empty');
    }
  };

  const handleSubmit = async () => {
    const newPitch = await data.handleSubmit();
    if (newPitch) {
      setSelectedPitch(newPitch);
      data.loadPitchDetails(newPitch.id);
      setContentView('review');
    }
  };

  const handleDeleteDraft = async (pitchId: string) => {
    await data.deleteDraft(pitchId);
    if (selectedPitch?.id === pitchId) {
      setSelectedPitch(null);
      setContentView('empty');
    }
  };

  const handleDeletePitch = async (pitchId: string) => {
    await data.deletePitch(pitchId);
    setSelectedPitch(null);
    setIsEditingPitch(false);
    setContentView('empty');
  };

  const renderChoiceScreen = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto pt-12">
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

  const renderContent = () => {
    if (data.isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      );
    }

    switch (contentView) {
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
            draftPitchId={data.activeDraftId || undefined}
            userId={data.currentUser?.id}
            onPitchUpdate={data.handlePitchUpdate}
            onMessagesChange={data.setChatMessages}
            onSubmit={handleSubmit}
            onContinueEditing={() => data.setIsPitchComplete(false)}
          />
        );
      case 'review':
        if (!selectedPitch) return null;
        return (
          <PitchReviewPanel
            pitch={selectedPitch}
            currentUser={data.currentUser}
            isEditingPitch={isEditingPitch}
            setIsEditingPitch={setIsEditingPitch}
            pitchComments={data.pitchComments}
            commentInput={data.commentInput}
            setCommentInput={data.setCommentInput}
            pitchCollaborators={data.pitchCollaborators}
            allUsers={data.allUsers}
            chatMessages={data.reviewChatMessages}
            onUpdateField={data.handleUpdatePitchField}
            onStatusChange={data.handleStatusChange}
            onAddComment={data.handleAddComment}
            onAddCollaborator={data.handleAddCollaborator}
            onRemoveCollaborator={data.handleRemoveCollaborator}
            onDeletePitch={handleDeletePitch}
          />
        );
      case 'empty':
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a pitch or create a new one</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex overflow-hidden">
      {/* Left Sidebar */}
      <PitchSessionSidebar
        pitches={data.myPitches}
        activePitchId={selectedPitch?.id || data.activeDraftId}
        onSelectPitch={handleSelectPitch}
        onNewPitch={handleNewPitch}
        onDeleteDraft={handleDeleteDraft}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            {(contentView === 'builder' || contentView === 'greenlit') && (
              <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">Pitch</h1>
                {data.authUser?.role === 'admin' && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-900/50 text-purple-300 border border-purple-700">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={contentView} className="h-full">
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PitchSubmission;
