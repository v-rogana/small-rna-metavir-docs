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
          50: '#e6f4f3',
          100: '#bfe1df',
          200: '#8ec8c5',
          300: '#5fb0ac',
          400: '#3aa29d',
          primary: '#21918c',
          500: '#21918c',
          600: '#1a7370',
          700: '#155553',
          800: '#0e3b38',
          900: '#0a1a18',
          deep: '#3b528b',
          dark: '#440154',
          lime: '#5ec962',
          sun: '#fde725',
        },
        phase: {
          '1-bg': '#440154',
          '1-border': '#6b1a7a',
          '1-fg': '#f3e8ff',
          '2-bg': '#3b528b',
          '2-border': '#5a7ab8',
          '2-fg': '#dbe4ff',
          '3-bg': '#21918c',
          '3-border': '#3fb5af',
          '3-fg': '#ccfbf1',
          '4-bg': '#5ec962',
          '4-border': '#86efac',
          '4-fg': '#0a1a18',
        },
        accent: {
          DEFAULT: '#21918c',
          hover: '#1a7370',
          bright: '#5ec962',
        },
        terracotta: '#e88a6a',
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
        glow: '0 0 0 1px rgba(33,145,140,0.35), 0 20px 50px -22px rgba(33,145,140,0.45)',
        'glow-lg': '0 0 0 1px rgba(33,145,140,0.4), 0 32px 64px -24px rgba(33,145,140,0.55)',
        soft: '0 1px 0 rgba(10,26,24,0.6), 0 12px 32px -16px rgba(0,0,0,0.5)',
        neon: '0 0 0 1px rgba(94,201,98,0.35), 0 0 24px -4px rgba(33,145,140,0.55)',
        'neon-lime': '0 0 0 1px rgba(94,201,98,0.55), 0 0 32px -6px rgba(94,201,98,0.6)',
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
