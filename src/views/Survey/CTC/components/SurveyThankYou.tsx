import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SurveyThankYouProps {
  surveyTitle: string;
}

export function SurveyThankYou({ surveyTitle }: SurveyThankYouProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
      >
        <CheckCircle className="w-16 h-16 text-success mb-6" />
      </motion.div>

      <h2 className="text-h3 mb-3">Thank You!</h2>
      <p className="text-body-muted leading-relaxed max-w-xs">
        Your response to the {surveyTitle} has been submitted. Your feedback helps us make better
        decisions about this space.
      </p>
    </motion.div>
  );
}
