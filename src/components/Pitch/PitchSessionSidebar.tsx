import { Plus, Edit3, Zap, Clock, Trash2, FileText } from 'lucide-react';
import type { Pitch } from '../../services/pitchService';

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  borderColor: string;
  icon: React.ElementType;
  borderStyle?: string;
}> = {
  draft: { label: 'Draft', color: 'text-gray-400', borderColor: 'border-gray-600', icon: Edit3, borderStyle: 'border-dashed' },
  pending: { label: 'Submitted', color: 'text-yellow-400', borderColor: 'border-yellow-700', icon: Clock },
  revise: { label: 'Revise', color: 'text-blue-400', borderColor: 'border-blue-700', icon: Edit3 },
  greenlit: { label: 'Green Lit', color: 'text-green-400', borderColor: 'border-green-700', icon: Zap },
};

interface PitchSessionSidebarProps {
  pitches: Pitch[];
  activePitchId: string | null;
  onSelectPitch: (pitch: Pitch) => void;
  onNewPitch: () => void;
  onDeleteDraft: (pitchId: string) => void;
}

export function PitchSessionSidebar({
  pitches,
  activePitchId,
  onSelectPitch,
  onNewPitch,
  onDeleteDraft,
}: PitchSessionSidebarProps) {
  return (
    <div className="w-72 shrink-0 bg-card border-r border-card flex flex-col">
      {/* New Pitch Button */}
      <div className="p-4">
        <button
          onClick={onNewPitch}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Pitch
        </button>
      </div>

      {/* Pitch List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {pitches.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No pitches yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {pitches.map((pitch) => {
              const isActive = activePitchId === pitch.id;
              const config = STATUS_CONFIG[pitch.status] || STATUS_CONFIG.draft;
              const StatusIcon = config.icon;

              return (
                <button
                  key={pitch.id}
                  onClick={() => onSelectPitch(pitch)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${config.borderColor} ${config.borderStyle || ''} border-l-2`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pitch.title === 'Untitled Draft' ? 'New Draft' : pitch.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusIcon className={`w-3 h-3 ${config.color}`} />
                      <span className={`text-xs ${config.color}`}>{config.label}</span>
                      <span className="text-xs text-gray-600">
                        {pitch.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {pitch.status === 'draft' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDraft(pitch.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
