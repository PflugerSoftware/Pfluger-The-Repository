import { motion } from 'framer-motion';

// Images with labels - linked to project dashboards
const STORAGE_BASE = 'https://bydkzxqmgsvsnjtafphj.supabase.co/storage/v1/object/public/Repository%20Bucket/projects';

const IMAGES = [
  {
    url: `${STORAGE_BASE}/X26RB01/x26rb01-Render-Main.png`,
    alt: 'Midland Furniture Pilot Research',
    label: 'midland ffe pilot',
    projectId: 'X26-RB01'
  },
  {
    url: `${STORAGE_BASE}/X24RB01/x24rb01-tmclark-ocean.jpeg`,
    alt: 'Immersive Learning Research',
    label: 'immersive learning',
    projectId: 'X24-RB01'
  },
  {
    url: `${STORAGE_BASE}/X25RB01/x25rb01-shape-hidden_lake.jpg`,
    alt: 'Sanctuary Spaces Research',
    label: 'sanctuary spaces',
    projectId: 'X25-RB01'
  },
  {
    url: `${STORAGE_BASE}/X25RB06/x25rb06_render-main.jpg`,
    alt: 'Timberlyne Study Research',
    label: 'mass timber',
    projectId: 'X25-RB06'
  }
];

interface ImageCarouselProps {
  onOpenProject?: (projectId: string) => void;
}

export function ImageCarousel({ onOpenProject }: ImageCarouselProps) {
  return (
    <div className="w-full flex flex-col gap-5 pb-12">
      {IMAGES.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="group relative w-full h-[60vh] overflow-hidden cursor-pointer"
          onClick={() => onOpenProject?.(image.projectId)}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Bold label in bottom left */}
          <div className="absolute bottom-4 left-4">
            <h3 className="text-8xl font-bold text-white drop-shadow-lg">
              {image.label}
            </h3>
          </div>

        </motion.div>
      ))}
    </div>
  );
}
