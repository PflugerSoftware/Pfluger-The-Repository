import { motion } from 'framer-motion';

const AboutSources: React.FC = () => {
  return (
    <div className="px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Sources & Citations</h1>
        <p className="text-xl text-gray-400 mb-12">
          Our approach to academic rigor and proper attribution.
        </p>

        <div className="space-y-12 text-gray-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Citation Standard</h2>
            <p className="text-gray-400">
              All research publications from the R&B department follow APA 7th Edition
              formatting guidelines. This ensures consistency, credibility, and ease of
              reference across all our work.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Why APA?</h2>
            <ul className="space-y-2 text-gray-400">
              <li>Industry standard for social sciences and education research</li>
              <li>Clear guidelines for diverse source types</li>
              <li>Widely recognized by academic and professional audiences</li>
              <li>Supports reproducibility and verification</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Approach</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                Every claim in our research is supported by evidence. We maintain detailed
                reference lists and provide in-text citations for all borrowed ideas,
                data, and methodologies.
              </p>
              <p>
                Primary sources are prioritized whenever possible. When using secondary
                sources, we verify information against the original when feasible.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Source Categories</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Peer-Reviewed Research</h3>
                <p className="text-sm text-gray-500">
                  Academic journals, conference proceedings, and published studies form
                  the foundation of our literature reviews.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Industry Publications</h3>
                <p className="text-sm text-gray-500">
                  AIA, ASHRAE, and other professional organizations provide standards
                  and best practices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Government Data</h3>
                <p className="text-sm text-gray-500">
                  Census data, TEA reports, and federal guidelines inform demographic
                  and regulatory context.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Primary Research</h3>
                <p className="text-sm text-gray-500">
                  Our own surveys, interviews, and observational studies generate
                  original data with documented methodologies.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Reference Management</h2>
            <p className="text-gray-400">
              We use Zotero for reference management, ensuring consistent formatting
              and easy collaboration across projects. All sources are archived and
              accessible for future reference.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSources;
