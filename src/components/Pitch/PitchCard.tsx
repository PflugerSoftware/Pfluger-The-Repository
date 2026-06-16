import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Target,
  FlaskConical,
  Sparkles,
  Calendar,
  Users,
  Check,
  Edit3,
  X,
  Zap
} from 'lucide-react';

export interface PitchData {
  researchIdea: string;
  alignment: 'current-project' | 'prospected-project' | 'thought-leadership' | '';
  projectName: string;
  methodology: string;
  scopeTier: 'simple' | 'medium' | 'complex' | '';
  impact: string;
  resources: string;
  timeline: string;
  partners: string;
}

interface PitchCardProps {
  data: PitchData;
  onUpdate: (field: keyof PitchData, value: string) => void;
  isGreenLit?: boolean;
  greenLitTitle?: string;
}

interface FieldConfig {
  key: keyof PitchData;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'researchIdea',
    label: 'Research Idea',
    icon: Lightbulb,
    placeholder: 'What gap in research do you want to explore?',
    multiline: true
  },
  {
    key: 'alignment',
    label: 'Alignment',
    icon: Target,
    placeholder: 'Current project or thought leadership?'
  },
  {
    key: 'methodology',
    label: 'Methodology',
    icon: FlaskConical,
    placeholder: 'How will you approach this research?'
  },
  {
    key: 'impact',
    label: 'Impact',
    icon: Sparkles,
    placeholder: 'What impact do you hope to achieve?',
    multiline: true
  },
  {
    key: 'timeline',
    label: 'Timeline',
    icon: Calendar,
    placeholder: 'When do you plan to complete this?'
  },
  {
    key: 'partners',
    label: 'Partners',
    icon: Users,
    placeholder: 'Any collaborators or institutions?'
  }
];

const SCOPE_LABELS: Record<string, string> = {
  simple: 'Simple & Quick (8-20 hrs)',
  medium: 'Medium Intensity (20-40 hrs)',
  complex: 'Complex & Long-Term (40-80 hrs)'
};

const ALIGNMENT_LABELS: Record<string, string> = {
  'current-project': 'Current Pfluger Project',
  'thought-leadership': 'Thought Leadership'
};

export function PitchCard({ data, onUpdate, isGreenLit, greenLitTitle }: PitchCardProps) {
  const [editingField, setEditingField] = useState<keyof PitchData | null>(null);
  const [editValue, setEditValue] = useState('');

  // Calculate completeness
  const filledFields = FIELDS.filter(f => {
    const value = data[f.key];
    return value && value.trim() !== '';
  }).length;
  const completeness = Math.round((filledFields / FIELDS.length) * 100);

  const startEditing = (field: keyof PitchData) => {
    setEditingField(field);
    setEditValue(data[field] || '');
  };

  const saveEdit = () => {
    if (editingField) {
      onUpdate(editingField, editValue);
      setEditingField(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const getDisplayValue = (field: FieldConfig): string => {
    const value = data[field.key];
    if (!value) return '';

    if (field.key === 'alignment') {
      return ALIGNMENT_LABELS[value] || value;
    }
    if (field.key === 'methodology' && data.scopeTier) {
      return `${value} (${SCOPE_LABELS[data.scopeTier] || data.scopeTier})`;
    }
    return value;
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        {/* Title */}
        <h3 className="text-h4 mb-2">
          {greenLitTitle || (data.researchIdea ? data.researchIdea.slice(0, 60) + (data.researchIdea.length > 60 ? '...' : '') : 'Building your pitch...')}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-body-subtle">X26-RB__</span>
            {isGreenLit && (
              <span className="flex items-center gap-1 text-xs text-success bg-success/30 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />
                GreenLit
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-meta">{completeness}%</div>
            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          const value = getDisplayValue(field);
          const isEmpty = !value;
          const isEditing = editingField === field.key;

          return (
            <div key={field.key} className="group">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-secondary rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-caption font-medium">{field.label}</span>
                    </div>
                    {field.multiline ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-background text-body rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-white"
                        rows={3}
                        autoFocus
                      />
                    ) : (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-background text-body rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-white"
                        autoFocus
                      />
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={saveEdit}
                        className="p-1.5 btn-cta rounded-md transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => startEditing(field.key)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                      isEmpty
                        ? 'bg-secondary/30 hover:bg-secondary/50 border border-dashed border-border'
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isEmpty ? 'text-foreground-subtle' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${isEmpty ? 'text-foreground-subtle' : 'text-foreground-subtle'}`}>
                          {field.label}
                        </span>
                        {!isEmpty && (
                          <Check className="w-3 h-3 text-success" />
                        )}
                      </div>
                      <p className={`text-sm mt-0.5 ${isEmpty ? 'text-foreground-subtle italic' : 'text-foreground'}`}>
                        {isEmpty ? field.placeholder : value}
                      </p>
                    </div>
                    <Edit3 className="w-3 h-3 text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
