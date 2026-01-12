import { motion } from 'framer-motion';
import { ImageCarousel } from '../components/Hero/ImageCarousel';

interface HomeProps {
  onNavigate: (sectionId: string) => void;
  onOpenProject?: (projectId: string) => void;
}

export default function Home({ onOpenProject }: HomeProps) {

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Image Stack - Full Width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full flex-1"
      >
        <ImageCarousel onOpenProject={onOpenProject} />
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full px-12 py-6"
      >
        <p className="text-sm font-light text-white tracking-widest">
          pfluger research
        </p>
      </motion.footer>
    </div>
  );
}
