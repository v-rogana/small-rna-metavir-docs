import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fbf8f1',
          100: '#f5efe1',
          200: '#ece2c8',
          300: '#dccfa8',
        },
        ink: {
          900: '#1b2422',
          700: '#2f3a37',
          500: '#56635f',
          300: '#8a958f',
        },
        viridis: {
          primary: '#21918c',
          deep: '#3b528b',
          dark: '#440154',
          lime: '#5ec962',
          sun: '#fde725',
        },
        accent: {
          DEFAULT: '#21918c',
          hover: '#1a7370',
          bright: '#5ec962',
        },
        terracotta: '#c8674a',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(33,145,140,0.2), 0 20px 50px -22px rgba(33,145,140,0.35)',
        'glow-lg': '0 0 0 1px rgba(33,145,140,0.25), 0 32px 64px -24px rgba(33,145,140,0.45)',
        soft: '0 1px 0 rgba(27,36,34,0.04), 0 12px 32px -16px rgba(27,36,34,0.18)',
      },
      backgroundImage: {
        'viridis-gradient':
          'linear-gradient(90deg, #440154 0%, #3b528b 25%, #21918c 50%, #5ec962 75%, #fde725 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
