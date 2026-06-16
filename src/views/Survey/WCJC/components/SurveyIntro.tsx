import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { Survey } from '../../../../services/surveyService';

interface SurveyIntroProps {
  survey: Survey;
  onStart: (firstName: string) => void;
}

export function SurveyIntro({ survey, onStart }: SurveyIntroProps) {
  const [firstName, setFirstName] = useState('');

  const canStart = firstName.trim().length > 0;

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
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-label">Survey</p>
            <h1 className="text-h4">{survey.title}</h1>
          </div>
        </div>

        {survey.description && (
          <p className="text-body-muted leading-relaxed">{survey.description}</p>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-5 overflow-y-auto">
        <div>
          <label className="block text-body-muted mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={100}
            placeholder="Enter your first name"
            className="w-full px-4 py-3 rounded-xl text-white placeholder:text-foreground-subtle focus:border-accent/50 focus:outline-none transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </div>

      </div>

      {/* Start button */}
      <div className="px-6 py-6">
        <button
          onClick={() => canStart && onStart(firstName.trim())}
          disabled={!canStart}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
            canStart
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'bg-white/5 text-foreground-subtle cursor-not-allowed'
          }`}
        >
          Start Survey
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
