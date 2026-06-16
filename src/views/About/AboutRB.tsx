import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

const AboutRB: React.FC = () => {
  return (
    <div className="px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-hero mb-4">Research & Benchmarking</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Advancing educational architecture through evidence-based design.
        </p>

        <div className="space-y-8 text-foreground">
          <p>
            The Research & Benchmarking department at Pfluger Architects is dedicated to
            improving educational environments through rigorous research and data-driven insights.
          </p>

          <p>
            We study how physical spaces impact student well-being, learning outcomes, and
            community engagement. Our work spans multiple disciplines including environmental
            psychology, sustainability science, and educational technology.
          </p>

          <div className="space-y-4">
            <h2 className="text-h3">Our Focus Areas</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>Student well-being and mental health</li>
              <li>Sustainable building practices</li>
              <li>Immersive learning environments</li>
              <li>Post-occupancy evaluation</li>
              <li>Campus life and community spaces</li>
              <li>Fine arts facilities</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-h3">Our Team</h2>
            <p className="text-muted-foreground">
              Our interdisciplinary team brings together architects, researchers, and educators
              to tackle complex questions about how design shapes learning and development.
            </p>
            <div className="space-y-4">
              <a
                href="https://www.linkedin.com/in/alexander-wickes/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <Linkedin className="w-5 h-5 text-foreground-subtle fill-foreground-subtle shrink-0" />
                <div>
                  <p className="text-white">Alexander Wickes, RA, LEED BD+C</p>
                  <p className="text-body-subtle">Design Performance Leader, Research</p>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/christian-owens-aia-a9b4543/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <Linkedin className="w-5 h-5 text-foreground-subtle fill-foreground-subtle shrink-0" />
                <div>
                  <p className="text-white">Christian Owens, AIA</p>
                  <p className="text-body-subtle">Director of Design</p>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/brenda-swirczynski/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <Linkedin className="w-5 h-5 text-foreground-subtle fill-foreground-subtle shrink-0" />
                <div>
                  <p className="text-white">Brenda Swirczynski, MSc, ALEP</p>
                  <p className="text-body-subtle">Education Facilities Planner</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutRB;
