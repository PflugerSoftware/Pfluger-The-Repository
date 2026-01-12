import { motion } from 'framer-motion';

const AboutProcess: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      description: 'We begin by understanding the challenge, reviewing existing literature, and identifying key research questions.'
    },
    {
      number: '02',
      title: 'Design',
      description: 'Our team develops a research methodology tailored to the specific context and goals of the project.'
    },
    {
      number: '03',
      title: 'Data Collection',
      description: 'We gather quantitative and qualitative data through surveys, observations, environmental measurements, and stakeholder interviews.'
    },
    {
      number: '04',
      title: 'Analysis',
      description: 'Rigorous analysis transforms raw data into actionable insights that inform design decisions.'
    },
    {
      number: '05',
      title: 'Implementation',
      description: 'Research findings are translated into design recommendations and integrated into the architectural process.'
    },
    {
      number: '06',
      title: 'Evaluation',
      description: 'Post-occupancy studies measure the impact of design decisions and feed back into future research.'
    }
  ];

  return (
    <div className="px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Our Process</h1>
        <p className="text-xl text-gray-400 mb-16">
          A rigorous approach to evidence-based design.
        </p>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-8"
            >
              <span className="text-4xl font-bold text-gray-700 shrink-0">
                {step.number}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutProcess;
