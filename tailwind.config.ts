import type { Config } from 'tailwindcss';

/** Semantic token → CSS variable (see src/index.css). Alpha-modifier safe. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Semantic theme tokens: these flip with light/dark automatically.
        canvas: token('canvas'),
        surface: {
          DEFAULT: token('surface'),
          2: token('surface-2'),
        },
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
        },
        ink: {
          DEFAULT: token('ink'),
          muted: token('ink-muted'),
          dim: token('ink-dim'),
        },
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          soft: token('accent-soft'),
        },
        'on-accent': token('on-accent'),
        ok: { DEFAULT: token('ok'), soft: token('ok-soft') },
        warn: { DEFAULT: token('warn'), soft: token('warn-soft') },
        bad: { DEFAULT: token('bad'), soft: token('bad-soft') },

        // ── Legacy aliases. `duo-*` is still referenced by ~83 call sites
        // (primary CTAs, progress fills). Retinted to the graphite system so
        // those sites are on-theme without touching every file; new code
        // should prefer the semantic tokens above.
        duo: {
          green: '#35618E',
          'green-dark': '#2A4F74',
          blue: '#4A7BA7',
          orange: '#A8762C',
          red: '#A8443C',
          yellow: '#C08A2E',
          gray: '#8A8F97',
        },
      },
      fontFamily: {
        // A modern grotesk system: Space Grotesk for headings/numerals,
        // Inter for running text, JetBrains Mono for telemetry readouts.
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        bounce: 'bounce 1s infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
