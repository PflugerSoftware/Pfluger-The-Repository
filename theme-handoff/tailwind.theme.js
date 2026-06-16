/* ============================================================================
   PFLUGER DESIGN SYSTEM — Tailwind theme (config half)
   ----------------------------------------------------------------------------
   Merge this `extend` object into your tailwind.config.js under theme.extend.
   These map the CSS variables (from pfluger-theme.css) to Tailwind color/font
   utilities, so classes like bg-card, text-success, border-border,
   from-pfluger-skyBlue, font-mono all generate.

   Example tailwind.config.js:

     export default {
       darkMode: ['class'],
       content: ['./index.html', './src/**\/*.{ts,tsx,js,jsx}'],
       theme: { extend: pflugerTheme },   // <-- merge / spread this in
       plugins: [],
     }
   ============================================================================ */

export const pflugerTheme = {
  colors: {
    // Pfluger brand palette (for data, charts, branding)
    pfluger: {
      brick: '#9A3324',
      black: '#000000',
      mediumGray: '#707372',
      lightGray: '#C7C9C7',
      darkBlue: '#003C71',
      skyBlue: '#00A9E0',     // primary brand accent
      oliveGreen: '#67823A',
      chartreuse: '#B5BD00',
      orange: '#F2A900',
      salmon: '#f16555',
    },

    // Semantic UI tokens (driven by the CSS vars in pfluger-theme.css)
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    'foreground-secondary': 'hsl(var(--foreground-secondary))',
    'foreground-subtle': 'hsl(var(--foreground-subtle))',
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
    },
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
    },
    // Brand-rooted semantic state colors
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    info: 'hsl(var(--info))',
    neutral: 'hsl(var(--neutral))',
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))',
    },
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))',
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))',
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))',
    },
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
    display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    text: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Monaco', '"Cascadia Code"', '"Courier New"', 'monospace'],
  },
}

export default pflugerTheme
