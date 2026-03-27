import { motion } from 'framer-motion';
import { Bot, Search, Building2, MessageSquare, FileText, Sparkles } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: Search,
    title: 'Research Search',
    description: 'Ask Ezra about any past R&B project and get answers grounded in real research data, block content, and project conclusions.',
  },
  {
    icon: Building2,
    title: 'Revit Integration',
    description: 'Ezra lives inside Revit as an add-in. Get research insights while you design - without leaving your model.',
  },
  {
    icon: MessageSquare,
    title: 'Conversational Context',
    description: 'Ezra maintains conversation history within a session, so follow-up questions build on previous answers naturally.',
  },
  {
    icon: FileText,
    title: 'Citation-Backed Answers',
    description: 'Every response references specific project blocks and research findings. Ezra cites its sources so you can verify and dig deeper.',
  },
];

const AboutAI: React.FC = () => {
  return (
    <div className="px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        {/* Hero */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-sm text-sky-400 font-medium tracking-wide uppercase">AI at Pfluger</p>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Meet Ezra</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Ezra is Pfluger's AI research assistant, built to make R&B's body of work
            accessible to every designer in the firm - right when they need it.
          </p>
        </div>

        {/* What is Ezra */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold text-white">What Ezra Does</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Ezra is a RAG-powered assistant that searches across all R&B project data -
            survey results, performance analyses, case studies, key findings, and conclusions.
            When you ask a question, Ezra retrieves the most relevant research blocks and
            synthesizes an answer grounded in real project data.
          </p>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Ezra is available in two places: here in The Repository web app, and as a
            Revit add-in that brings research context directly into the design environment.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-card border border-card rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
                  <cap.icon className="w-4.5 h-4.5 text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'You ask a question', detail: '"What did students say about outdoor spaces in the Lee College survey?"' },
              { step: '2', title: 'Ezra searches R&B data', detail: 'RAG pipeline queries project blocks using summaries, tags, and searchable text fields across all research projects.' },
              { step: '3', title: 'Relevant blocks are retrieved', detail: 'The most relevant blocks are ranked and pulled, including their conclusions and source data.' },
              { step: '4', title: 'Ezra synthesizes an answer', detail: 'A response is generated from the retrieved context, with citations back to specific projects and blocks.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-sky-400">{item.step}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our approach */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Our Approach to AI</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed max-w-2xl">
            <p>
              We use AI to amplify human expertise, not replace it. Ezra surfaces research
              that already exists - it doesn't generate new findings or make design decisions.
              Every answer is traceable back to real R&B project data.
            </p>
            <p>
              When AI tools contribute to our research process, we document their role.
              We follow strict guidelines for privacy, bias awareness, and responsible
              data handling across all AI-assisted work.
            </p>
          </div>
        </div>

        {/* Tech note */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500 uppercase tracking-wide">Technical Note</p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Ezra is powered by Anthropic's Claude via Supabase Edge Functions. The web app
            uses the <code className="text-sky-400/70">claude</code> edge function, while the
            Revit add-in uses the <code className="text-sky-400/70">ezra-revit</code> edge
            function with additional Revit model context. Both query the
            same <code className="text-sky-400/70">project_blocks</code> table for RAG retrieval.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutAI;
