import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mapbox': ['mapbox-gl'],
          'charts': ['recharts', 'd3-shape', 'd3-scale', 'd3-selection', 'd3-axis', 'd3-ease', 'd3-transition'],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-scroll-area',
          ],
          'motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
