import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Edit3,
  Zap,
  Check,
  MessageSquare,
  User,
  Calendar,
  Target,
  Send,
  X,
  UserPlus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { stripPitchTags, stripMarkdown } from '../../services/pitchAgent';
import {
  SCOPE_TIERS,
  METHODOLOGIES,
  SCOPE_LABELS,
  calculateHoursPerWeek,
} from '../../views/Pitch/usePitchData';
import { getInitials } from '../../lib/utils';
import type { Pitch, PitchComment, PitchStatus, User as DbUser } from '../../services/pitchService';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'text-muted-foreground', bg: 'bg-muted/30', border: 'border-border', icon: Edit3 },
  pending: { label: 'Pending Review', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/40', icon: Clock },
  revise: { label: 'Revise & Resubmit', color: 'text-info', bg: 'bg-info/10', border: 'border-info/40', icon: Edit3 },
  greenlit: { label: 'Green Lit!', color: 'text-success', bg: 'bg-success/10', border: 'border-success/40', icon: Zap },
};

interface PitchReviewPanelProps {
  pitch: Pitch;
  currentUser: DbUser | null;
  isEditingPitch: boolean;
  setIsEditingPitch: (v: boolean) => void;
  pitchComments: PitchComment[];
  commentInput: string;
  setCommentInput: (v: string) => void;
  pitchCollaborators: DbUser[];
  allUsers: DbUser[];
  onUpdateField: (pitchId: string, field: string, value: string) => void;
  onStatusChange: (pitchId: string, status: PitchStatus) => void;
  onAddComment: (pitchId: string) => void;
  onAddCollaborator: (pitchId: string, userId: string) => void;
  onRemoveCollaborator: (pitchId: string, userId: string) => void;
  onDeletePitch?: (pitchId: string) => void;
  chatMessages?: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
}

export function PitchReviewPanel({
  pitch,
  currentUser,
  isEditingPitch,
  setIsEditingPitch,
  pitchComments,
  commentInput,
  setCommentInput,
  pitchCollaborators,
  allUsers,
  onUpdateField,
  onStatusChange,
  onAddComment,
  onAddCollaborator,
  onRemoveCollaborator,
  onDeletePitch,
  chatMessages,
}: PitchReviewPanelProps) {
  const [showChat, setShowChat] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const status = STATUS_CONFIG[pitch.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;
  const scopeInfo = pitch.scopeTier ? SCOPE_TIERS[pitch.scopeTier] : null;
  const scopeLabel = pitch.scopeTier ? SCOPE_LABELS[pitch.scopeTier] : null;
  const isMyComment = (comment: PitchComment) => comment.userId === currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';
  // Non-admin users cannot edit pending pitches
  const canEdit = isAdmin || pitch.status !== 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl"
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Hero Card */}
          <div className="flex flex-col min-w-0">
            <div className={`flex flex-col rounded-2xl border ${
                pitch.status === 'pending' ? 'bg-warning/20 border-warning/40' :
                pitch.status === 'revise' ? 'bg-accent/20 border-accent/40' :
                pitch.status === 'greenlit' ? 'bg-success/20 border-success/40' :
                'bg-card border-border'
              }`}>
                {/* Hero Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-h3">{pitch.title}</h2>
                    {canEdit ? (
                      <button
                        onClick={() => setIsEditingPitch(!isEditingPitch)}
                        className={`p-2.5 rounded-lg transition-colors shrink-0 ${
                          isEditingPitch
                            ? 'bg-white text-black'
                            : 'bg-secondary text-muted-foreground hover:text-white hover:bg-muted'
                        }`}
                      >
                        {isEditingPitch ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-warning/20 text-warning text-xs font-medium shrink-0">
                        <Clock className="w-3 h-3" />
                        Submitted
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span className="font-mono text-muted-foreground">{pitch.id}</span>
                    <span className="text-foreground-subtle">-</span>
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {pitch.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditingPitch ? (
                      <select
                        value={pitch.status}
                        onChange={(e) => onStatusChange(pitch.id, e.target.value as PitchStatus)}
                        className="bg-transparent text-white text-xs px-2 py-1 rounded-full border-2 border-accent/50 focus:outline-none focus:border-accent"
                      >
                        <option value="pending">Pending</option>
                        <option value="revise">Revise</option>
                        <option value="greenlit">Green Lit</option>
                      </select>
                    ) : (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bg} ${status.border} border`}>
                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                        <span className={status.color}>{status.label}</span>
                      </div>
                    )}

                    {isEditingPitch ? (
                      <>
                        <select
                          value={pitch.scopeTier || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'scopeTier', e.target.value)}
                          className="bg-transparent text-white text-xs px-2 py-1 rounded-lg border-2 border-accent/50 focus:outline-none focus:border-accent"
                        >
                          <option value="">Scope</option>
                          <option value="simple">Simple (8-20 hrs)</option>
                          <option value="medium">Medium (20-40 hrs)</option>
                          <option value="complex">Complex (40-80 hrs)</option>
                        </select>
                        <select
                          value={pitch.methodology || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'methodology', e.target.value)}
                          className="bg-transparent text-white text-xs px-2 py-1 rounded-lg border-2 border-accent/50 focus:outline-none focus:border-accent"
                        >
                          <option value="">Methodology</option>
                          {METHODOLOGIES.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        {scopeLabel && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-secondary border border-border">
                            <Target className={`w-3 h-3 ${scopeLabel.color}`} />
                            <span className={scopeLabel.color}>{scopeLabel.label}</span>
                          </div>
                        )}
                        {pitch.methodology && (
                          <div className="px-2.5 py-1 rounded-full text-xs bg-secondary border border-border text-white">
                            {pitch.methodology}
                          </div>
                        )}
                        {scopeInfo && (
                          <div className="px-2.5 py-1 rounded-full text-xs bg-secondary border border-border text-muted-foreground">
                            {scopeInfo.hours[0]}-{scopeInfo.hours[1]} hrs
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Collaborators */}
                <div className="px-5 pt-4">
                  <label className="text-label font-semibold block mb-2">Collaborators</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pitch.userName && (
                      <div className="flex items-center gap-1.5" title={`${pitch.userName} (owner)`}>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pfluger-skyBlue to-pfluger-darkBlue flex items-center justify-center text-white text-xs font-semibold ring-2 ring-background">
                          {getInitials(pitch.userName)}
                        </div>
                        <span className="text-body">{pitch.userName}</span>
                      </div>
                    )}
                    {pitchCollaborators.map(collab => (
                      <div key={collab.id} className="flex items-center gap-1.5" title={collab.name}>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pfluger-skyBlue to-pfluger-darkBlue flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(collab.name)}
                        </div>
                        <span className="text-body">{collab.name}</span>
                        {isEditingPitch && (
                          <button
                            onClick={() => onRemoveCollaborator(pitch.id, collab.id)}
                            className="w-4 h-4 rounded-full bg-destructive/50 flex items-center justify-center text-destructive hover:bg-destructive/80 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditingPitch && (
                      <div className="relative">
                        <select
                          value=""
                          onChange={(e) => { if (e.target.value) onAddCollaborator(pitch.id, e.target.value); }}
                          className="appearance-none bg-secondary text-muted-foreground text-xs pl-2 pr-6 py-1.5 rounded-lg border border-border hover:border-border focus:outline-none focus:border-accent cursor-pointer"
                        >
                          <option value="">+ Add</option>
                          {allUsers
                            .filter(u => u.id !== pitch.userId && !pitchCollaborators.some(c => c.id === u.id))
                            .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                          }
                        </select>
                        <UserPlus className="w-3 h-3 text-foreground-subtle absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                    {!isEditingPitch && pitchCollaborators.length === 0 && !pitch.userName && (
                      <span className="text-meta">No collaborators</span>
                    )}
                  </div>
                </div>

                {/* Pitch Details */}
                <div className={`p-5 space-y-4 text-sm ${isEditingPitch ? 'bg-accent/5' : ''}`}>
                  <div>
                    <span className="text-label block mb-1">Research Question</span>
                    {isEditingPitch ? (
                      <textarea
                        value={pitch.researchIdea}
                        onChange={(e) => onUpdateField(pitch.id, 'researchIdea', e.target.value)}
                        rows={3}
                        className="w-full bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1 resize-none leading-relaxed"
                      />
                    ) : (
                      <p className="text-body leading-relaxed">{pitch.researchIdea || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-label block mb-1">Expected Impact</span>
                    {isEditingPitch ? (
                      <textarea
                        value={pitch.impact || ''}
                        onChange={(e) => onUpdateField(pitch.id, 'impact', e.target.value)}
                        rows={2}
                        placeholder="What will this research produce?"
                        className="w-full bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1 resize-none leading-relaxed"
                      />
                    ) : (
                      <p className="text-body leading-relaxed">{pitch.impact || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-label block mb-1">Alignment</span>
                    {isEditingPitch ? (
                      <select
                        value={pitch.alignment || ''}
                        onChange={(e) => onUpdateField(pitch.id, 'alignment', e.target.value)}
                        className="w-full bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1"
                      >
                        <option value="">Select</option>
                        <option value="current-project">Current Project</option>
                        <option value="prospected-project">Prospected Project</option>
                        <option value="thought-leadership">Thought Leadership</option>
                      </select>
                    ) : (
                      <p className="text-body">
                        {pitch.alignment === 'current-project' ? 'Current Project' :
                         pitch.alignment === 'prospected-project' ? 'Prospected Project' :
                         pitch.alignment === 'thought-leadership' ? 'Thought Leadership' :
                         'Not specified'}
                      </p>
                    )}
                  </div>
                  {((isEditingPitch && (pitch.alignment === 'current-project' || pitch.alignment === 'prospected-project')) || pitch.projectName) && (
                    <div>
                      <span className="text-label block mb-1">Project</span>
                      {isEditingPitch ? (
                        <input
                          type="text"
                          value={pitch.projectName || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'projectName', e.target.value)}
                          placeholder="e.g., 25-05"
                          className="w-full bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1"
                        />
                      ) : (
                        <p className="text-body">{pitch.projectName}</p>
                      )}
                    </div>
                  )}
                  {(isEditingPitch || pitch.partner) && (
                    <div>
                      <span className="text-label block mb-1">Partner</span>
                      {isEditingPitch ? (
                        <input
                          type="text"
                          value={pitch.partner || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'partner', e.target.value)}
                          placeholder="Organization"
                          className="w-full bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1"
                        />
                      ) : (
                        <p className="text-body">{pitch.partner}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <span className="text-label block mb-1">Timeline</span>
                    {isEditingPitch ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={pitch.timeline || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'timeline', e.target.value)}
                          placeholder="8-12 weeks"
                          className="flex-1 bg-transparent text-body border-b border-input focus:outline-none focus:border-white pb-1"
                        />
                        <span className="text-body-muted shrink-0">
                          ({pitch.scopeTier && pitch.timeline ? calculateHoursPerWeek(pitch.scopeTier, pitch.timeline) : '0'} hrs/wk)
                        </span>
                      </div>
                    ) : (
                      <p className="text-body">
                        {pitch.timeline || 'Not specified'}
                        {pitch.timeline && pitch.scopeTier && (
                          <span className="text-body-muted ml-2">
                            ({calculateHoursPerWeek(pitch.scopeTier, pitch.timeline)} hrs/week)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  {isEditingPitch && onDeletePitch && (
                    <div className="pt-4 border-t border-border">
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-destructive">Delete this pitch?</span>
                          <button
                            onClick={() => onDeletePitch(pitch.id)}
                            className="px-3 py-1.5 rounded-lg text-badge bg-destructive hover:bg-destructive/80 transition-colors"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-1.5 rounded-lg text-caption font-medium bg-secondary hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Pitch
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Right: Comments */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-foreground-subtle" />
              <span className="text-label font-semibold">Review Thread</span>
            </div>
            <div className="space-y-3 mb-4">
              {pitchComments.length === 0 ? (
                <p className="text-body-subtle italic py-4 text-center">No comments yet. Add feedback below.</p>
              ) : (
                pitchComments.map((comment) => {
                  const isMine = isMyComment(comment);
                  return (
                    <div key={comment.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMine ? 'bg-muted' : 'bg-success/50'}`}>
                        {isMine ? <User className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-success" />}
                      </div>
                      <div className={`flex-1 ${isMine ? 'text-right' : ''}`}>
                        <div className={`inline-block rounded-xl p-3 max-w-[90%] ${isMine ? 'bg-white' : 'bg-secondary'}`}>
                          <p className={`text-sm ${isMine ? 'text-black' : 'text-foreground'}`}>{comment.message}</p>
                        </div>
                        <p className="text-meta mt-1">
                          {comment.user?.name || 'Unknown'} - {comment.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex gap-2">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add feedback or notes..."
                  rows={1}
                  className="flex-1 bg-secondary text-body rounded-lg px-3 py-2 border border-input focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                <button
                  onClick={() => onAddComment(pitch.id)}
                  disabled={!commentInput.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium btn-cta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Chat History */}
        {chatMessages && chatMessages.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2 text-body-muted hover:text-white transition-colors w-full"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-semibold">Conversation with Ezra</span>
              <span className="text-meta">({chatMessages.length} messages)</span>
              <span className="ml-auto">
                {showChat ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3 max-h-96 overflow-y-auto rounded-xl bg-background p-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {msg.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pfluger-skyBlue to-pfluger-darkBlue flex items-center justify-center shrink-0">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block rounded-xl px-3 py-2 ${
                            msg.role === 'user'
                              ? 'bg-white text-black rounded-tr-sm'
                              : 'bg-secondary rounded-tl-sm'
                          }`}>
                            <p className={`text-xs whitespace-pre-wrap ${msg.role === 'user' ? 'text-black' : 'text-foreground'}`}>
                              {msg.role === 'assistant' ? stripMarkdown(stripPitchTags(msg.content)) : msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
