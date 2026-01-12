import { motion } from 'framer-motion';

const AboutAI: React.FC = () => {
  return (
    <div className="px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Use of AI</h1>
        <p className="text-xl text-gray-400 mb-12">
          How we leverage artificial intelligence in our research.
        </p>

        <div className="space-y-8 text-gray-300">
          <p>
            Artificial intelligence is transforming how we conduct research and analyze data.
            At Pfluger Research & Benchmarking, we embrace these tools thoughtfully and transparently.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Approach</h2>
            <p className="text-gray-400">
              We use AI as a tool to augment human expertise, not replace it. Every AI-assisted
              analysis is reviewed and validated by our research team.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <ul className="space-y-2 text-gray-400">
              <li>Pattern recognition in large datasets</li>
              <li>Natural language processing for survey analysis</li>
              <li>Predictive modeling for building performance</li>
              <li>Image analysis for space utilization studies</li>
              <li>Literature review and synthesis</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Transparency</h2>
            <p className="text-gray-400">
              We believe in full transparency about AI use. When AI tools contribute to our
              research, we document and disclose their role in our methodology.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Ethics</h2>
            <p className="text-gray-400">
              We follow strict ethical guidelines for AI use, ensuring privacy protection,
              bias mitigation, and responsible data handling in all our AI-assisted research.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutAI;
