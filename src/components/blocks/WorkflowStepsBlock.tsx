import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import type { WorkflowStepsData } from './types';

interface WorkflowStepsBlockProps {
  data: WorkflowStepsData;
}

export function WorkflowStepsBlock({ data }: WorkflowStepsBlockProps) {
  const { steps } = data;
  const [activeStep, setActiveStep] = useState(
    steps.findIndex((s) => s.status === 'active') !== -1
      ? steps.findIndex((s) => s.status === 'active')
      : 0
  );

  const currentStep = steps[activeStep];

  return (
    <div className="space-y-6">
      {/* Step navigation */}
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full" />

        {/* Progress bar fill */}
        <motion.div
          className="absolute top-5 left-0 h-1 bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((activeStep + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Step buttons */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = step.status === 'complete' || index < activeStep;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : isComplete
                      ? 'bg-success text-white'
                      : 'bg-white/10 text-foreground-subtle'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isComplete && !isActive ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </motion.div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-white' : 'text-foreground-subtle'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-sm font-bold text-accent">{currentStep.number}</span>
            </div>
            <h3 className="text-title">{currentStep.title}</h3>
          </div>

          {/* Findings */}
          {currentStep.findings && currentStep.findings.length > 0 && (
            <div>
              <p className="text-label mb-2">
                Key Findings
              </p>
              <div className="space-y-2">
                {currentStep.findings.map((finding, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-sm text-warning">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {currentStep.deliverables && currentStep.deliverables.length > 0 && (
            <div>
              <p className="text-label mb-2">
                Deliverables
              </p>
              <div className="flex flex-wrap gap-2">
                {currentStep.deliverables.map((deliverable, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent"
                  >
                    <FileText className="w-3 h-3" />
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interventions */}
          {currentStep.interventions && currentStep.interventions.length > 0 && (
            <div>
              <p className="text-label mb-2">
                Design Interventions
              </p>
              <div className="space-y-2">
                {currentStep.interventions.map((intervention, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <span className="text-body">{intervention.action}</span>
                    <div className="flex items-center gap-1 text-success">
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-xs">{intervention.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes */}
          {currentStep.outcomes && currentStep.outcomes.length > 0 && (
            <div>
              <p className="text-label mb-2">
                Outcomes
              </p>
              <div className="space-y-2">
                {currentStep.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-success/10 border border-success/20 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-success">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
