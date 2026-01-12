import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, X, Sparkles } from 'lucide-react';
import type { PitchData } from './PitchCard';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestion?: {
    field: keyof PitchData;
    value: string;
    label: string;
  };
  suggestionApplied?: boolean;
}

interface PitchChatPanelProps {
  pitchData: PitchData;
  onUpdateField: (field: keyof PitchData, value: string) => void;
  isGreenLit?: boolean;
}

// Simulated AI responses based on conversation state
const getAIResponse = (
  userMessage: string,
  pitchData: PitchData,
  _messageHistory: ChatMessage[]
): { content: string; suggestion?: ChatMessage['suggestion'] } => {
  const lowerMessage = userMessage.toLowerCase();

  // Check what's missing
  const missingResearchIdea = !pitchData.researchIdea;
  const missingAlignment = !pitchData.alignment;
  const missingMethodology = !pitchData.methodology;
  const missingImpact = !pitchData.impact;
  const missingTimeline = !pitchData.timeline;
  const missingPartners = !pitchData.partners;

  // If user provides research idea content
  if (missingResearchIdea && userMessage.length > 20) {
    // Extract a cleaned version as the research idea
    const idea = userMessage.charAt(0).toUpperCase() + userMessage.slice(1);
    return {
      content: "That's a compelling research direction. Let me capture that for your pitch.",
      suggestion: {
        field: 'researchIdea',
        value: idea,
        label: 'Research Idea'
      }
    };
  }

  // If discussing alignment
  if (missingAlignment && (lowerMessage.includes('project') || lowerMessage.includes('current') || lowerMessage.includes('thought') || lowerMessage.includes('leadership') || lowerMessage.includes('future'))) {
    const isCurrentProject = lowerMessage.includes('current') || lowerMessage.includes('ongoing') || lowerMessage.includes('active project');
    return {
      content: isCurrentProject
        ? "Great, tying research to an active project often accelerates practical application."
        : "Thought leadership research builds our expertise for future opportunities.",
      suggestion: {
        field: 'alignment',
        value: isCurrentProject ? 'current-project' : 'thought-leadership',
        label: 'Alignment'
      }
    };
  }

  // If discussing methodology
  if (missingMethodology && (
    lowerMessage.includes('survey') ||
    lowerMessage.includes('interview') ||
    lowerMessage.includes('case study') ||
    lowerMessage.includes('literature') ||
    lowerMessage.includes('infographic') ||
    lowerMessage.includes('whitepaper') ||
    lowerMessage.includes('experimental')
  )) {
    let method = 'Literature Review';
    let scope: 'simple' | 'medium' | 'complex' = 'simple';

    if (lowerMessage.includes('survey') || lowerMessage.includes('post-occupancy')) {
      method = 'Survey/Post-Occupancy Design';
      scope = 'medium';
    } else if (lowerMessage.includes('interview')) {
      method = 'Expert Interview';
      scope = 'simple';
    } else if (lowerMessage.includes('case study')) {
      method = 'Case Study Analysis';
      scope = 'complex';
    } else if (lowerMessage.includes('infographic')) {
      method = 'Infographic Creation';
      scope = 'simple';
    } else if (lowerMessage.includes('whitepaper') || lowerMessage.includes('white paper')) {
      method = 'Long-form Essay/Whitepaper';
      scope = 'complex';
    } else if (lowerMessage.includes('experimental')) {
      method = 'Experimental Design';
      scope = 'complex';
    }

    return {
      content: `${method} is a solid approach. I'll note that as your methodology.`,
      suggestion: {
        field: 'methodology',
        value: `${method}|${scope}`,
        label: 'Methodology'
      }
    };
  }

  // If discussing impact
  if (missingImpact && (lowerMessage.includes('impact') || lowerMessage.includes('benefit') || lowerMessage.includes('help') || lowerMessage.includes('improve') || lowerMessage.includes('hope'))) {
    return {
      content: "I'll add that to your impact statement.",
      suggestion: {
        field: 'impact',
        value: userMessage,
        label: 'Impact'
      }
    };
  }

  // If discussing timeline
  if (missingTimeline && (lowerMessage.includes('month') || lowerMessage.includes('week') || lowerMessage.includes('quarter') || lowerMessage.includes('year') || lowerMessage.includes('deadline') || lowerMessage.includes('complete'))) {
    return {
      content: "Got it. I'll record that timeline.",
      suggestion: {
        field: 'timeline',
        value: userMessage,
        label: 'Timeline'
      }
    };
  }

  // If discussing partners
  if (missingPartners && (lowerMessage.includes('partner') || lowerMessage.includes('collaborat') || lowerMessage.includes('university') || lowerMessage.includes('institution') || lowerMessage.includes('work with'))) {
    return {
      content: "Partnerships can strengthen research credibility. I'll note these potential collaborators.",
      suggestion: {
        field: 'partners',
        value: userMessage,
        label: 'Partners'
      }
    };
  }

  // Guide to next missing field
  if (missingResearchIdea) {
    return {
      content: "What research gap or question are you interested in exploring? Tell me about the problem you want to investigate."
    };
  }
  if (missingAlignment) {
    return {
      content: "Is this research for a current Pfluger project, or is it thought leadership for future opportunities?"
    };
  }
  if (missingMethodology) {
    return {
      content: "How do you plan to approach this research? For example: surveys, interviews, case studies, literature review, or creating an infographic?"
    };
  }
  if (missingImpact) {
    return {
      content: "What impact do you hope this research will have? How will it benefit Pfluger's work or the broader industry?"
    };
  }
  if (missingTimeline) {
    return {
      content: "Do you have a timeline in mind? When would you like to complete this research?"
    };
  }
  if (missingPartners) {
    return {
      content: "Are there any internal or external partners you'd like to collaborate with? Universities, research institutions, or colleagues?"
    };
  }

  // All fields filled
  return {
    content: "Your pitch is looking complete! Review the card above and click Submit when you're ready. Feel free to click on any field to make edits, or ask me if you want to refine anything."
  };
};

export function PitchChatPanel({ pitchData, onUpdateField, isGreenLit }: PitchChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: isGreenLit
        ? "Great choice on the GreenLit topic! The basics are filled in. Would you like to add any additional context, discuss timeline, or identify potential partners?"
        : "Let's build your research pitch together. What topic or research gap are you interested in exploring?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(inputValue, pitchData, messages);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        suggestion: response.suggestion
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 600);
  };

  const handleApplySuggestion = (messageId: string, suggestion: ChatMessage['suggestion']) => {
    if (!suggestion) return;

    // Handle methodology which includes scope
    if (suggestion.field === 'methodology' && suggestion.value.includes('|')) {
      const [method, scope] = suggestion.value.split('|');
      onUpdateField('methodology', method);
      onUpdateField('scopeTier', scope);
    } else {
      onUpdateField(suggestion.field, suggestion.value);
    }

    // Mark suggestion as applied
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, suggestionApplied: true } : msg
    ));

    // Add confirmation and next prompt
    setTimeout(() => {
      const nextResponse = getAIResponse('', {
        ...pitchData,
        [suggestion.field]: suggestion.value
      }, messages);

      const confirmMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: nextResponse.content
      };
      setMessages(prev => [...prev, confirmMessage]);
    }, 400);
  };

  const handleRejectSuggestion = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, suggestionApplied: false, suggestion: undefined } : msg
    ));

    setTimeout(() => {
      const retryMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        role: 'assistant',
        content: "No problem. Could you rephrase that, or would you like to move on to a different aspect of your pitch?"
      };
      setMessages(prev => [...prev, retryMessage]);
    }, 300);
  };

  return (
    <div className="bg-card border border-card rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">Build with Ezra</h2>
        <p className="text-sm text-gray-500">Chat to develop your research idea</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <span className="text-xs text-white">AI</span>
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-white text-black rounded-tr-none'
                      : 'bg-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className={`text-sm ${msg.role === 'user' ? 'text-black' : 'text-gray-300'}`}>
                    {msg.content}
                  </p>
                </div>

                {/* Suggestion Card */}
                <AnimatePresence>
                  {msg.suggestion && msg.suggestionApplied === undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2"
                    >
                      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-gray-400">Add to {msg.suggestion.label}?</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                          {msg.suggestion.value.includes('|')
                            ? msg.suggestion.value.split('|')[0]
                            : msg.suggestion.value}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApplySuggestion(msg.id, msg.suggestion)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Apply
                          </button>
                          <button
                            onClick={() => handleRejectSuggestion(msg.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Skip
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Applied indicator */}
                {msg.suggestionApplied === true && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                    <Check className="w-3 h-3" />
                    Added to pitch
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your research idea..."
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
