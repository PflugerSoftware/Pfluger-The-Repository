import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { Survey } from '../../../../services/surveyService';

interface SurveyIntroProps {
  survey: Survey;
  onStart: (firstName: string, role: string) => void;
}

const DEFAULT_ROLES = [
  'Student',
  'Parent',
  'Teacher',
  'Staff',
  'Other',
];

export function SurveyIntro({ survey, onStart }: SurveyIntroProps) {
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');

  const roles = survey.roles && survey.roles.length > 0 ? survey.roles : DEFAULT_ROLES;
  const canStart = firstName.trim().length > 0 && role.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0, 169, 224, 0.15)', backdropFilter: 'blur(8px)' }}>
            <MapPin className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Survey</p>
            <h1 className="text-lg font-bold text-white">{survey.title}</h1>
          </div>
        </div>

        {survey.description && (
          <p className="text-sm text-gray-400 leading-relaxed">{survey.description}</p>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-5 overflow-y-auto">
        <div>
          <label className="block text-sm text-gray-400 mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={100}
            placeholder="Enter your first name"
            className="w-full px-4 py-3 rounded-xl text-white placeholder:text-gray-600 focus:border-sky-500/50 focus:outline-none transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">I am a...</label>
          <div className="grid grid-cols-1 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  role === r
                    ? 'text-sky-300'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{
                  background: role === r ? 'rgba(0, 169, 224, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  border: role === r ? '1px solid rgba(0, 169, 224, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="px-6 py-6">
        <button
          onClick={() => canStart && onStart(firstName.trim(), role)}
          disabled={!canStart}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
            canStart
              ? 'bg-sky-500 text-white hover:bg-sky-400'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
        >
          Start Survey
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
