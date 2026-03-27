import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { Survey } from '../../../services/surveyService';

interface SurveyIntroProps {
  survey: Survey;
  onStart: (firstName: string, role: string) => void;
}

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'parent', label: 'Parent' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'staff', label: 'Staff' },
  { value: 'other', label: 'Other' },
];

export function SurveyIntro({ survey, onStart }: SurveyIntroProps) {
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');

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
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
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
      <div className="flex-1 px-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={100}
            placeholder="Enter your first name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-sky-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  role === r.value
                    ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {r.label}
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
