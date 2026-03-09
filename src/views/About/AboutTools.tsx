import { motion } from 'framer-motion';
import {
  Sailboat,
  Triangle,
  Asterisk,
  Scissors,
  Figma,
  Sparkles,
  Video,
  Box,
  Pen,
  Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================
// SOFTWARE DATA
// ============================================

interface Tool {
  name: string;
  category: string;
  description: string;
  capabilities: string[];
}

const SOFTWARE: Tool[] = [
  {
    name: 'Custom Development',
    category: 'Intelligence Tools',
    description: 'In-house development of sector and topic intelligence tools, dashboards, and data modeling using modern web technologies.',
    capabilities: ['React', 'Agentic AI', 'D3.js', 'RAG Architecture', 'REST APIs', 'Interactive dashboards', 'Data modeling']
  },
  {
    name: 'Revit + Forma',
    category: 'BIM',
    description: 'Building Information Modeling for architectural design, documentation, and early-stage conceptual analysis.',
    capabilities: ['3D modeling', 'Construction documentation', 'Conceptual massing', 'Environmental analysis']
  },
  {
    name: 'Rhino + Grasshopper',
    category: 'Computational Design',
    description: 'Parametric modeling and algorithmic design workflows.',
    capabilities: ['Parametric geometry', 'Data-driven design', 'Environmental analysis', 'Optimization']
  },
  {
    name: 'Apple Vision Pro',
    category: 'Immersive Visualization',
    description: 'Spatial computing platform paired with custom applications to deliver augmented reality architectural experiences.',
    capabilities: ['Augmented reality walkthroughs', 'Spatial design review', 'Mixed reality presentations', 'Immersive client experiences']
  },
  {
    name: 'Mapbox + Geodata',
    category: 'GIS',
    description: 'Custom mapping applications combining Mapbox with government and private geodata sources.',
    capabilities: ['Interactive mapping', 'Demographic analysis', 'Site intelligence', 'Custom data overlays']
  },
  {
    name: 'In-House Data Lake',
    category: 'Research',
    description: 'Centralized repository for aggregating and analyzing research data across projects.',
    capabilities: ['Data aggregation', 'Cross-project analysis', 'Historical benchmarking', 'Custom reporting']
  }
];

// ============================================
// AI TOOLS DATA
// ============================================

interface AITool {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  url: string;
  login: string;
  bullets: string[];
}

const AI_TOOLS: AITool[] = [
  {
    name: 'Midjourney',
    subtitle: 'Image Generation',
    icon: Sailboat,
    color: '#00A9E0',
    url: 'https://www.midjourney.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'AI image generation from text prompts',
      'Photorealistic and stylized imagery',
    ],
  },
  {
    name: 'Nano Banana',
    subtitle: 'AI Image Editing',
    icon: Pen,
    color: '#F2A900',
    url: 'https://gemini.google.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'AI-powered image editing',
      'Targeted edits and enhancements',
    ],
  },
  {
    name: 'Magnific',
    subtitle: 'Image Upscaling',
    icon: Triangle,
    color: '#67823A',
    url: 'https://magnific.ai',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'AI image upscaling and enhancement',
      'Low-res to presentation quality',
    ],
  },
  {
    name: 'Genie 3',
    subtitle: 'AI 3D',
    icon: Box,
    color: '#F2A900',
    url: 'https://gemini.google.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'AI 3D model generation',
      'Create models from text or images',
    ],
  },
  {
    name: 'Gemini',
    subtitle: 'AI Assistant',
    icon: Sparkles,
    color: '#F2A900',
    url: 'https://gemini.google.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'Multimodal AI assistant',
      'Research, writing, and analysis',
    ],
  },
  {
    name: 'Veo 3',
    subtitle: 'AI Video',
    icon: Video,
    color: '#F2A900',
    url: 'https://gemini.google.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'AI video generation from text prompts',
      'Concept clips and walkthroughs',
    ],
  },
  {
    name: 'Claude AI',
    subtitle: 'AI Assistant',
    icon: Asterisk,
    color: '#9A3324',
    url: 'https://claude.ai',
    login: 'Office-specific (see below)',
    bullets: [
      'Writing, coding, and analysis',
      'Upload files and documents for review',
    ],
  },
  {
    name: 'CapCut',
    subtitle: 'Video Editing',
    icon: Scissors,
    color: '#003C71',
    url: 'https://www.capcut.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'Video editing with AI features',
      'Auto-captions and templates',
    ],
  },
  {
    name: 'Figma',
    subtitle: 'Design',
    icon: Figma,
    color: '#00A9E0',
    url: 'https://www.figma.com',
    login: 'apps@pflugerarchitects.com',
    bullets: [
      'UI/UX and graphic design',
      'Real-time team collaboration',
    ],
  },
];

const CLAUDE_LOGINS = [
  { office: 'Austin', email: 'PAAustin@pflugerarchitects.com' },
  { office: 'Dallas', email: 'PADallas@pflugerarchitects.com' },
  { office: 'San Antonio', email: 'PASanAntonio@pflugerarchitects.com' },
  { office: 'Houston', email: 'PAHouston@pflugerarchitects.com' },
  { office: 'Corpus Christi', email: 'PACorpus@pflugerarchitects.com' },
];

// ============================================
// MAIN PAGE
// ============================================

const AboutTools: React.FC = () => {
  return (
    <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Our Tools</h1>
        <p className="text-xl text-gray-400 mb-16">
          The software, AI tools, and custom platforms we use to conduct research.
        </p>

        {/* Software Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Software</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOFTWARE.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-3"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide">{tool.category}</p>
                <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                <p className="text-sm text-gray-400">{tool.description}</p>
                <ul className="space-y-1">
                  {tool.capabilities.map((cap) => (
                    <li key={cap} className="text-sm text-gray-500">{cap}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Tools Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">AI Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Design Team</h3>
              <p className="text-sm text-gray-400">
                Access to all AI and creative tools for concept development, visualization, research, and production.
              </p>
            </div>
            <div className="bg-card border border-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Production Team</h3>
              <p className="text-sm text-gray-400">
                Access to Claude AI for writing assistance, research, code review, and analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {AI_TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-card rounded-2xl p-6 hover:border-gray-600 transition-all block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <Icon className={tool.name === 'Claude AI' ? 'w-8 h-8' : 'w-5 h-5'} style={{ color: tool.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-white">{tool.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {tool.bullets.map((b) => (
                      <li key={b} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-gray-600 mt-1">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span className="font-mono">{tool.login}</span>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Claude Office Logins */}
          <div className="bg-card border border-card rounded-2xl p-8 mt-4">
            <h3 className="text-lg font-bold text-white mb-1">Claude AI — Office Logins</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              {CLAUDE_LOGINS.map((login) => (
                <div key={login.office}>
                  <p className="text-sm font-semibold text-white">{login.office}</p>
                  <p className="text-xs font-mono text-gray-500">{login.email}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutTools;
