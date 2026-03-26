import { useState, useEffect } from 'react';
import { useAuth } from '../../components/System/AuthContext';
import type { PitchData } from '../../components/Pitch/PitchCard';
import type { ExtractedPitch } from '../../services/pitchAgent';
import {
  getPitches,
  createPitch,
  updatePitch,
  claimPitch,
  generatePitchId,
  getPitchComments,
  addPitchComment,
  getUser,
  savePitchAiSession,
  getPitchAiSession,
  getUsers,
  getPitchCollaborators,
  addPitchCollaborator,
  removePitchCollaborator,
  createDraftPitch,
  deletePitch,
  deletePitchAiSession,
  type Pitch,
  type PitchComment,
  type PitchStatus,
  type User as DbUser,
} from '../../services/pitchService';

// Scope tiers define hour/week ranges
export const SCOPE_TIERS: Record<string, { hours: [number, number]; weeks: [number, number] }> = {
  simple:  { hours: [20, 60],   weeks: [5, 15] },
  medium:  { hours: [60, 120],  weeks: [15, 30] },
  complex: { hours: [120, 200], weeks: [30, 50] },
};

// Methodologies are independent of scope - any can pair with any scope
export const METHODOLOGIES = [
  'Infographic Creation',
  'Expert Interview',
  'Literature Review',
  'Survey/Post-Occupancy Design',
  'Annotated Bibliography',
  'Case Study Analysis',
  'Experimental Design',
  'Long-form Whitepaper',
];

// All combinations of scope + methodology (used by PitchBuilder progress sidebar)
export const RESEARCH_METHODS = Object.entries(SCOPE_TIERS).flatMap(([scope, info]) =>
  METHODOLOGIES.map(m => ({
    value: `${scope}|${m}`,
    scope,
    methodology: m,
    hours: info.hours,
    weeks: info.weeks,
  }))
);

export const calculateHoursPerWeek = (scope: string, timeline: string): number => {
  const weeksMatch = timeline.match(/(\d+)(?:-(\d+))?\s*weeks?/i);
  if (!weeksMatch) return 4;
  const minWeeks = parseInt(weeksMatch[1]);
  const maxWeeks = weeksMatch[2] ? parseInt(weeksMatch[2]) : minWeeks;
  const avgWeeks = (minWeeks + maxWeeks) / 2;
  const scopeInfo = SCOPE_TIERS[scope];
  if (!scopeInfo) return 4;
  const avgHours = (scopeInfo.hours[0] + scopeInfo.hours[1]) / 2;
  return Math.round(avgHours / avgWeeks);
};

export const SCOPE_LABELS: Record<string, { label: string; color: string }> = {
  simple: { label: 'Simple', color: 'text-green-400' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  complex: { label: 'Complex', color: 'text-red-400' },
};

const EMPTY_PITCH_DATA: PitchData = {
  researchIdea: '',
  alignment: '',
  projectName: '',
  methodology: '',
  scopeTier: '',
  impact: '',
  resources: '',
  timeline: '',
  partners: '',
};

export function usePitchData() {
  const { user: authUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<DbUser | null>(null);
  const [myPitches, setMyPitches] = useState<Pitch[]>([]);
  const [availableGreenlit, setAvailableGreenlit] = useState<Pitch[]>([]);
  const [allUsers, setAllUsers] = useState<DbUser[]>([]);
  const [pitchComments, setPitchComments] = useState<PitchComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [pitchCollaborators, setPitchCollaborators] = useState<DbUser[]>([]);
  const [pitchData, setPitchData] = useState<PitchData>(EMPTY_PITCH_DATA);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([]);
  const [isPitchComplete, setIsPitchComplete] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [reviewChatMessages, setReviewChatMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([]);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      if (!authUser) return;
      setIsLoading(true);
      try {
        const user = await getUser(authUser.id);
        setCurrentUser(user);
        if (user) {
          if (authUser.role === 'admin') {
            const allPitches = await getPitches();
            setMyPitches(allPitches);
          } else {
            const mine = await getPitches({ userId: user.id });
            setMyPitches(mine);
          }
        }
        const available = await getPitches({ status: 'greenlit', availableOnly: true });
        setAvailableGreenlit(available);
        const users = await getUsers();
        setAllUsers(users);
      } catch (err) {
        console.error('Error loading pitch data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [authUser]);

  // Load comments, collaborators, and chat history for a pitch
  const loadPitchDetails = async (pitchId: string | null) => {
    if (pitchId) {
      const [comments, collaborators, session] = await Promise.all([
        getPitchComments(pitchId),
        getPitchCollaborators(pitchId),
        getPitchAiSession(pitchId),
      ]);
      setPitchComments(comments);
      setPitchCollaborators(collaborators);
      setReviewChatMessages(
        session?.messages.map(m => ({ id: m.id, role: m.role, content: m.content })) || []
      );
    } else {
      setPitchComments([]);
      setPitchCollaborators([]);
      setReviewChatMessages([]);
    }
  };

  const handlePitchUpdate = (extracted: ExtractedPitch) => {
    setPitchData(prev => {
      const updates: Partial<PitchData> = {};
      if (extracted.researchIdea) updates.researchIdea = extracted.researchIdea;
      if (extracted.scope) updates.scopeTier = extracted.scope;
      if (extracted.methodology) updates.methodology = extracted.methodology;
      if (extracted.projectConnection) {
        const alignment = extracted.projectConnection.toLowerCase();
        if (alignment === 'current-project' || alignment === 'prospected-project' || alignment === 'thought-leadership') {
          updates.alignment = alignment;
        }
      }
      if (extracted.projectName) updates.projectName = extracted.projectName;
      if (extracted.partner) updates.partners = extracted.partner;
      if (extracted.successMetrics) updates.impact = extracted.successMetrics;
      if (extracted.timeline) updates.timeline = extracted.timeline;

      // Persist partial progress to the draft pitch in DB
      if (activeDraftId) {
        const dbUpdates: Partial<{
          title: string;
          researchIdea: string;
          scopeTier: string;
          methodology: string;
          alignment: string;
          projectName: string;
          partner: string;
          impact: string;
          timeline: string;
        }> = {};
        if (updates.researchIdea) {
          dbUpdates.researchIdea = updates.researchIdea;
          // Auto-generate title from research idea
          const titleMatch = updates.researchIdea.match(/^[^.!?]+/);
          dbUpdates.title = titleMatch
            ? titleMatch[0].slice(0, 60) + (titleMatch[0].length > 60 ? '...' : '')
            : updates.researchIdea.slice(0, 60) + '...';
        }
        if (updates.scopeTier) dbUpdates.scopeTier = updates.scopeTier;
        if (updates.methodology) dbUpdates.methodology = updates.methodology;
        if (updates.alignment) dbUpdates.alignment = updates.alignment;
        if (updates.projectName) dbUpdates.projectName = updates.projectName;
        if (updates.partners) dbUpdates.partner = updates.partners;
        if (updates.impact) dbUpdates.impact = updates.impact;
        if (updates.timeline) dbUpdates.timeline = updates.timeline;
        if (Object.keys(dbUpdates).length > 0) {
          updatePitch(activeDraftId, dbUpdates).then(success => {
            if (success && dbUpdates.title) {
              // Update the local pitch list with the new title
              setMyPitches(prev => prev.map(p =>
                p.id === activeDraftId ? { ...p, ...dbUpdates } as Pitch : p
              ));
            }
          });
        }
      }

      return { ...prev, ...updates };
    });
    if (extracted.isComplete) setIsPitchComplete(true);
  };

  const handleSubmit = async (): Promise<Pitch | null> => {
    setSubmitError(null);
    if (!currentUser) {
      setSubmitError('Unable to submit: User not found in database. Please contact an administrator.');
      return null;
    }
    setIsSubmitting(true);
    try {
      const titleMatch = pitchData.researchIdea.match(/^[^.!?]+/);
      const title = titleMatch
        ? titleMatch[0].slice(0, 60) + (titleMatch[0].length > 60 ? '...' : '')
        : pitchData.researchIdea.slice(0, 60) + '...';

      // If we have an active draft, promote it to pending
      if (activeDraftId) {
        const success = await updatePitch(activeDraftId, {
          title,
          researchIdea: pitchData.researchIdea,
          status: 'pending',
          alignment: pitchData.alignment || undefined,
          projectName: pitchData.projectName || undefined,
          partner: pitchData.partners || undefined,
          methodology: pitchData.methodology || undefined,
          scopeTier: pitchData.scopeTier || undefined,
          impact: pitchData.impact || undefined,
          timeline: pitchData.timeline || undefined,
        });

        if (success) {
          // Chat messages are already auto-saved by PitchChatPanel
          const promotedPitch: Pitch = {
            id: activeDraftId,
            userId: currentUser.id,
            userName: currentUser.name,
            title,
            status: 'pending',
            researchIdea: pitchData.researchIdea,
            alignment: pitchData.alignment || null,
            projectName: pitchData.projectName || null,
            partner: pitchData.partners || null,
            methodology: pitchData.methodology || null,
            scopeTier: pitchData.scopeTier || null,
            impact: pitchData.impact || null,
            timeline: pitchData.timeline || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setMyPitches(prev => prev.map(p =>
            p.id === activeDraftId ? promotedPitch : p
          ));
          resetPitch();
          return promotedPitch;
        } else {
          setSubmitError('Failed to submit pitch. Please try again.');
          return null;
        }
      }

      // Fallback: no active draft, create a new pitch (legacy path)
      const newId = await generatePitchId();
      const newPitch = await createPitch({
        id: newId,
        userId: currentUser.id,
        title,
        researchIdea: pitchData.researchIdea,
        status: 'pending',
        alignment: pitchData.alignment || undefined,
        projectName: pitchData.projectName || undefined,
        partner: pitchData.partners || undefined,
        methodology: pitchData.methodology || undefined,
        scopeTier: pitchData.scopeTier || undefined,
        impact: pitchData.impact || undefined,
        timeline: pitchData.timeline || undefined,
      });

      if (newPitch) {
        if (chatMessages.length > 0) {
          const dbMessages = chatMessages.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(),
          }));
          await savePitchAiSession(newPitch.id, currentUser.id, dbMessages);
        }
        setMyPitches(prev => [newPitch, ...prev]);
        resetPitch();
        return newPitch;
      } else {
        setSubmitError('Failed to create pitch. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error submitting pitch:', err);
      setSubmitError('An error occurred while submitting. Please try again.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimGreenlit = async (pitch: Pitch): Promise<boolean> => {
    if (!currentUser) return false;
    setIsSubmitting(true);
    try {
      const success = await claimPitch(pitch.id, currentUser.id);
      if (success) {
        setAvailableGreenlit(prev => prev.filter(p => p.id !== pitch.id));
        setMyPitches(prev => [{ ...pitch, userId: currentUser.id }, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error claiming pitch:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePitchField = async (pitchId: string, field: string, value: string) => {
    // When scope changes, auto-update timeline to match
    if (field === 'scopeTier' && value && SCOPE_TIERS[value]) {
      const weeks = SCOPE_TIERS[value].weeks;
      const timeline = `${weeks[0]}-${weeks[1]} weeks`;
      setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, scopeTier: value, timeline } : p));
      await updatePitch(pitchId, { scopeTier: value, timeline });
      return;
    }
    setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, [field]: value } : p));
    const dbField = field === 'researchIdea' ? 'researchIdea' : field === 'scopeTier' ? 'scopeTier' : field;
    await updatePitch(pitchId, { [dbField]: value });
  };

  const handleStatusChange = async (pitchId: string, newStatus: PitchStatus) => {
    setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, status: newStatus } : p));
    await updatePitch(pitchId, { status: newStatus });
  };

  const handleAddComment = async (pitchId: string) => {
    if (!commentInput.trim() || !currentUser) return;
    const newComment = await addPitchComment(pitchId, currentUser.id, commentInput);
    if (newComment) setPitchComments(prev => [...prev, newComment]);
    setCommentInput('');
  };

  const handleAddCollaborator = async (pitchId: string, userId: string) => {
    const success = await addPitchCollaborator(pitchId, userId);
    if (success) {
      const user = allUsers.find(u => u.id === userId);
      if (user) setPitchCollaborators(prev => [...prev, user]);
    }
  };

  const handleRemoveCollaborator = async (pitchId: string, userId: string) => {
    const success = await removePitchCollaborator(pitchId, userId);
    if (success) setPitchCollaborators(prev => prev.filter(c => c.id !== userId));
  };

  const resetPitch = () => {
    setIsPitchComplete(false);
    setChatMessages([]);
    setPitchData(EMPTY_PITCH_DATA);
    setActiveDraftId(null);
  };

  const startDraft = async (): Promise<string | null> => {
    if (!currentUser) return null;
    const draft = await createDraftPitch(currentUser.id);
    if (draft) {
      setMyPitches(prev => [draft, ...prev]);
      setActiveDraftId(draft.id);
      resetPitch();
      setActiveDraftId(draft.id); // re-set after resetPitch clears it
      return draft.id;
    }
    return null;
  };

  const resumeDraft = async (pitchId: string) => {
    const pitch = myPitches.find(p => p.id === pitchId);
    if (!pitch) return;

    setActiveDraftId(pitchId);

    // Restore pitch data from the pitch record
    setPitchData({
      researchIdea: pitch.researchIdea || '',
      alignment: (pitch.alignment || '') as PitchData['alignment'],
      projectName: pitch.projectName || '',
      methodology: pitch.methodology || '',
      scopeTier: (pitch.scopeTier || '') as PitchData['scopeTier'],
      impact: pitch.impact || '',
      resources: '',
      timeline: pitch.timeline || '',
      partners: pitch.partner || '',
    });

    // Restore chat messages from the AI session
    const session = await getPitchAiSession(pitchId);
    if (session && session.messages.length > 0) {
      setChatMessages(session.messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })));
    } else {
      setChatMessages([]);
    }

    setIsPitchComplete(false);
  };

  const handleDeleteDraft = async (pitchId: string): Promise<boolean> => {
    await deletePitchAiSession(pitchId);
    const success = await deletePitch(pitchId);
    if (success) {
      setMyPitches(prev => prev.filter(p => p.id !== pitchId));
      if (activeDraftId === pitchId) {
        resetPitch();
      }
    }
    return success;
  };

  const handleDeletePitch = async (pitchId: string): Promise<boolean> => {
    const success = await deletePitch(pitchId);
    if (success) {
      setMyPitches(prev => prev.filter(p => p.id !== pitchId));
      if (activeDraftId === pitchId) {
        resetPitch();
      }
    }
    return success;
  };

  return {
    authUser,
    currentUser,
    isLoading,
    isSubmitting,
    submitError,
    myPitches,
    availableGreenlit,
    allUsers,
    pitchComments,
    commentInput,
    setCommentInput,
    pitchCollaborators,
    pitchData,
    setPitchData,
    chatMessages,
    setChatMessages,
    isPitchComplete,
    setIsPitchComplete,
    activeDraftId,
    reviewChatMessages,
    loadPitchDetails,
    handlePitchUpdate,
    handleSubmit,
    handleClaimGreenlit,
    handleUpdatePitchField,
    handleStatusChange,
    handleAddComment,
    handleAddCollaborator,
    handleRemoveCollaborator,
    resetPitch,
    startDraft,
    resumeDraft,
    deleteDraft: handleDeleteDraft,
    deletePitch: handleDeletePitch,
  };
}
