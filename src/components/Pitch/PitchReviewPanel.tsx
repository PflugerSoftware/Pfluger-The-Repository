import { motion } from 'framer-motion';
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
} from 'lucide-react';
import {
  RESEARCH_METHODS,
  SCOPE_LABELS,
  calculateHoursPerWeek,
} from '../../views/Pitch/usePitchData';
import type { Pitch, PitchComment, PitchStatus, User as DbUser } from '../../services/pitchService';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800', icon: Clock },
  revise: { label: 'Revise & Resubmit', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800', icon: Edit3 },
  greenlit: { label: 'Green Lit!', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800', icon: Zap },
};

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
  onMethodChange: (pitchId: string, value: string) => void;
  onStatusChange: (pitchId: string, status: PitchStatus) => void;
  onAddComment: (pitchId: string) => void;
  onAddCollaborator: (pitchId: string, userId: string) => void;
  onRemoveCollaborator: (pitchId: string, userId: string) => void;
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
  onMethodChange,
  onStatusChange,
  onAddComment,
  onAddCollaborator,
  onRemoveCollaborator,
}: PitchReviewPanelProps) {
  const status = STATUS_CONFIG[pitch.status];
  const StatusIcon = status.icon;
  const methodInfo = pitch.scopeTier && pitch.methodology
    ? RESEARCH_METHODS.find(m => m.scope === pitch.scopeTier && m.methodology === pitch.methodology)
    : null;
  const scopeLabel = pitch.scopeTier ? SCOPE_LABELS[pitch.scopeTier] : null;
  const isMyComment = (comment: PitchComment) => comment.userId === currentUser?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-card rounded-2xl"
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Hero Card */}
          <div className="flex flex-col min-w-0">
            {methodInfo && scopeLabel ? (
              <div className={`flex flex-col rounded-2xl border ${
                pitch.status === 'pending' ? 'bg-yellow-900/20 border-yellow-800' :
                pitch.status === 'revise' ? 'bg-blue-900/20 border-blue-800' :
                pitch.status === 'greenlit' ? 'bg-green-900/20 border-green-800' :
                'bg-gray-900/20 border-gray-800'
              }`}>
                {/* Hero Header */}
                <div className="p-6 border-b border-gray-800/50">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-2xl font-bold text-white">{pitch.title}</h2>
                    <button
                      onClick={() => setIsEditingPitch(!isEditingPitch)}
                      className={`p-2.5 rounded-lg transition-colors shrink-0 ${
                        isEditingPitch
                          ? 'bg-white text-black'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {isEditingPitch ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span className="font-mono text-gray-400">{pitch.id}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {pitch.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditingPitch ? (
                      <select
                        value={pitch.status}
                        onChange={(e) => onStatusChange(pitch.id, e.target.value as PitchStatus)}
                        className="bg-transparent text-white text-xs px-2 py-1 rounded-full border-2 border-sky-500/50 focus:outline-none focus:border-sky-500"
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
                      <select
                        value={pitch.scopeTier && pitch.methodology ? `${pitch.scopeTier}|${pitch.methodology}` : ''}
                        onChange={(e) => onMethodChange(pitch.id, e.target.value)}
                        className="bg-transparent text-white text-xs px-2 py-1 rounded-lg border-2 border-sky-500/50 focus:outline-none focus:border-sky-500"
                      >
                        <option value="">Select research method</option>
                        <optgroup label="Simple (20-60 hours)">
                          {RESEARCH_METHODS.filter(m => m.scope === 'simple').map(m => (
                            <option key={m.value} value={m.value}>{m.methodology}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Medium (60-120 hours)">
                          {RESEARCH_METHODS.filter(m => m.scope === 'medium').map(m => (
                            <option key={m.value} value={m.value}>{m.methodology}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Complex (120-200 hours)">
                          {RESEARCH_METHODS.filter(m => m.scope === 'complex').map(m => (
                            <option key={m.value} value={m.value}>{m.methodology}</option>
                          ))}
                        </optgroup>
                      </select>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-gray-800 border border-gray-700">
                          <Target className={`w-3 h-3 ${scopeLabel.color}`} />
                          <span className={scopeLabel.color}>{scopeLabel.label}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-xs bg-gray-800 border border-gray-700 text-white">
                          {methodInfo.methodology}
                        </div>
                        <div className="px-2.5 py-1 rounded-full text-xs bg-gray-800 border border-gray-700 text-gray-400">
                          {methodInfo.hours[0]}-{methodInfo.hours[1]} hrs
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Collaborators */}
                <div className="px-5 pt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Collaborators</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pitch.userName && (
                      <div className="flex items-center gap-1.5" title={`${pitch.userName} (owner)`}>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-gray-900">
                          {getInitials(pitch.userName)}
                        </div>
                        <span className="text-sm text-white">{pitch.userName}</span>
                      </div>
                    )}
                    {pitchCollaborators.map(collab => (
                      <div key={collab.id} className="flex items-center gap-1.5" title={collab.name}>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white text-xs font-semibold">
                          {getInitials(collab.name)}
                        </div>
                        <span className="text-sm text-white">{collab.name}</span>
                        {isEditingPitch && (
                          <button
                            onClick={() => onRemoveCollaborator(pitch.id, collab.id)}
                            className="w-4 h-4 rounded-full bg-red-900/50 flex items-center justify-center text-red-400 hover:bg-red-800 transition-colors"
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
                          className="appearance-none bg-gray-800 text-gray-400 text-xs pl-2 pr-6 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option value="">+ Add</option>
                          {allUsers
                            .filter(u => u.id !== pitch.userId && !pitchCollaborators.some(c => c.id === u.id))
                            .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                          }
                        </select>
                        <UserPlus className="w-3 h-3 text-gray-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                    {!isEditingPitch && pitchCollaborators.length === 0 && !pitch.userName && (
                      <span className="text-xs text-gray-600">No collaborators</span>
                    )}
                  </div>
                </div>

                {/* Pitch Details */}
                <div className={`p-5 space-y-4 text-sm ${isEditingPitch ? 'bg-sky-900/5' : ''}`}>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Research Question</span>
                    {isEditingPitch ? (
                      <textarea
                        value={pitch.researchIdea}
                        onChange={(e) => onUpdateField(pitch.id, 'researchIdea', e.target.value)}
                        rows={3}
                        className="w-full bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1 resize-none leading-relaxed"
                      />
                    ) : (
                      <p className="text-white leading-relaxed">{pitch.researchIdea || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Expected Impact</span>
                    {isEditingPitch ? (
                      <textarea
                        value={pitch.impact || ''}
                        onChange={(e) => onUpdateField(pitch.id, 'impact', e.target.value)}
                        rows={2}
                        placeholder="What will this research produce?"
                        className="w-full bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1 resize-none leading-relaxed"
                      />
                    ) : (
                      <p className="text-white leading-relaxed">{pitch.impact || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Alignment</span>
                    {isEditingPitch ? (
                      <select
                        value={pitch.alignment || ''}
                        onChange={(e) => onUpdateField(pitch.id, 'alignment', e.target.value)}
                        className="w-full bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1"
                      >
                        <option value="">Select</option>
                        <option value="current-project">Current Project</option>
                        <option value="prospected-project">Prospected Project</option>
                        <option value="thought-leadership">Thought Leadership</option>
                      </select>
                    ) : (
                      <p className="text-white">
                        {pitch.alignment === 'current-project' ? 'Current Project' :
                         pitch.alignment === 'prospected-project' ? 'Prospected Project' :
                         pitch.alignment === 'thought-leadership' ? 'Thought Leadership' :
                         'Not specified'}
                      </p>
                    )}
                  </div>
                  {((isEditingPitch && (pitch.alignment === 'current-project' || pitch.alignment === 'prospected-project')) || pitch.projectName) && (
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Project</span>
                      {isEditingPitch ? (
                        <input
                          type="text"
                          value={pitch.projectName || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'projectName', e.target.value)}
                          placeholder="e.g., 25-05"
                          className="w-full bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1"
                        />
                      ) : (
                        <p className="text-white">{pitch.projectName}</p>
                      )}
                    </div>
                  )}
                  {(isEditingPitch || pitch.partner) && (
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Partner</span>
                      {isEditingPitch ? (
                        <input
                          type="text"
                          value={pitch.partner || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'partner', e.target.value)}
                          placeholder="Organization"
                          className="w-full bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1"
                        />
                      ) : (
                        <p className="text-white">{pitch.partner}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Timeline</span>
                    {isEditingPitch ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={pitch.timeline || ''}
                          onChange={(e) => onUpdateField(pitch.id, 'timeline', e.target.value)}
                          placeholder="8-12 weeks"
                          className="flex-1 bg-transparent text-white text-sm border-b border-gray-600 focus:outline-none focus:border-white pb-1"
                        />
                        <span className="text-gray-400 text-sm shrink-0">
                          ({pitch.scopeTier && pitch.timeline ? calculateHoursPerWeek(pitch.scopeTier, pitch.timeline) : '0'} hrs/wk)
                        </span>
                      </div>
                    ) : (
                      <p className="text-white">
                        {pitch.timeline || 'Not specified'}
                        {pitch.timeline && pitch.scopeTier && (
                          <span className="text-gray-400 ml-2">
                            ({calculateHoursPerWeek(pitch.scopeTier, pitch.timeline)} hrs/week)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Select a research method to see pitch details</p>
              </div>
            )}
          </div>

          {/* Right: Comments */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Thread</span>
            </div>
            <div className="space-y-3 mb-4">
              {pitchComments.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4 text-center">No comments yet. Add feedback below.</p>
              ) : (
                pitchComments.map((comment) => {
                  const isMine = isMyComment(comment);
                  return (
                    <div key={comment.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMine ? 'bg-gray-700' : 'bg-green-900/50'}`}>
                        {isMine ? <User className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className={`flex-1 ${isMine ? 'text-right' : ''}`}>
                        <div className={`inline-block rounded-xl p-3 max-w-[90%] ${isMine ? 'bg-white' : 'bg-gray-800'}`}>
                          <p className={`text-sm ${isMine ? 'text-black' : 'text-gray-300'}`}>{comment.message}</p>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {comment.user?.name || 'Unknown'} - {comment.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
                  onClick={() => onAddComment(pitch.id)}
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
}
