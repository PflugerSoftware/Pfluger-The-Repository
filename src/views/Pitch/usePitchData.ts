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
  getUsers,
  getPitchCollaborators,
  addPitchCollaborator,
  removePitchCollaborator,
  type Pitch,
  type PitchComment,
  type PitchStatus,
  type User as DbUser,
} from '../../services/pitchService';

// Combined scope + methodology options (4 hours/week = timeline calculation)
export const RESEARCH_METHODS = [
  { value: 'simple|Infographic Creation', scope: 'simple', methodology: 'Infographic Creation', hours: [20, 60], weeks: [5, 15] },
  { value: 'simple|Expert Interview', scope: 'simple', methodology: 'Expert Interview', hours: [20, 60], weeks: [5, 15] },
  { value: 'simple|Literature Review', scope: 'simple', methodology: 'Literature Review', hours: [20, 60], weeks: [5, 15] },
  { value: 'medium|Survey/Post-Occupancy Design', scope: 'medium', methodology: 'Survey/Post-Occupancy Design', hours: [60, 120], weeks: [15, 30] },
  { value: 'medium|Annotated Bibliography', scope: 'medium', methodology: 'Annotated Bibliography', hours: [60, 120], weeks: [15, 30] },
  { value: 'complex|Case Study Analysis', scope: 'complex', methodology: 'Case Study Analysis', hours: [120, 200], weeks: [30, 50] },
  { value: 'complex|Experimental Design', scope: 'complex', methodology: 'Experimental Design', hours: [120, 200], weeks: [30, 50] },
  { value: 'complex|Long-form Whitepaper', scope: 'complex', methodology: 'Long-form Whitepaper', hours: [120, 200], weeks: [30, 50] },
];

export const getMethodInfo = (value: string) => RESEARCH_METHODS.find(m => m.value === value);

const formatTimeline = (weeks: [number, number]) => `${weeks[0]}-${weeks[1]} weeks`;

export const calculateHoursPerWeek = (scope: string, timeline: string): number => {
  const weeksMatch = timeline.match(/(\d+)(?:-(\d+))?\s*weeks?/i);
  if (!weeksMatch) return 4;
  const minWeeks = parseInt(weeksMatch[1]);
  const maxWeeks = weeksMatch[2] ? parseInt(weeksMatch[2]) : minWeeks;
  const avgWeeks = (minWeeks + maxWeeks) / 2;
  const methodInfo = RESEARCH_METHODS.find(m => m.scope === scope);
  if (!methodInfo) return 4;
  const avgHours = (methodInfo.hours[0] + methodInfo.hours[1]) / 2;
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

  // Load comments and collaborators for a pitch
  const loadPitchDetails = async (pitchId: string | null) => {
    if (pitchId) {
      const [comments, collaborators] = await Promise.all([
        getPitchComments(pitchId),
        getPitchCollaborators(pitchId),
      ]);
      setPitchComments(comments);
      setPitchCollaborators(collaborators);
    } else {
      setPitchComments([]);
      setPitchCollaborators([]);
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
      const newId = await generatePitchId();
      const titleMatch = pitchData.researchIdea.match(/^[^.!?]+/);
      const title = titleMatch
        ? titleMatch[0].slice(0, 60) + (titleMatch[0].length > 60 ? '...' : '')
        : pitchData.researchIdea.slice(0, 60) + '...';

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
    setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, [field]: value } : p));
    const dbField = field === 'researchIdea' ? 'researchIdea' : field === 'scopeTier' ? 'scopeTier' : field;
    await updatePitch(pitchId, { [dbField]: value });
  };

  const handleMethodChange = async (pitchId: string, combinedValue: string) => {
    const methodInfo = getMethodInfo(combinedValue);
    const updates = methodInfo
      ? { scopeTier: methodInfo.scope, methodology: methodInfo.methodology, timeline: formatTimeline(methodInfo.weeks as [number, number]) }
      : { scopeTier: '', methodology: '', timeline: '' };
    setMyPitches(prev => prev.map(p => p.id === pitchId ? { ...p, ...updates } : p));
    await updatePitch(pitchId, updates);
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
    loadPitchDetails,
    handlePitchUpdate,
    handleSubmit,
    handleClaimGreenlit,
    handleUpdatePitchField,
    handleMethodChange,
    handleStatusChange,
    handleAddComment,
    handleAddCollaborator,
    handleRemoveCollaborator,
    resetPitch,
  };
}
