import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f9',
          100: '#cce5f3',
          200: '#99cbe7',
          300: '#66b0db',
          400: '#3396cf',
          500: '#0069b4', // PEKCON Blue
          600: '#005490',
          700: '#003f6c',
          800: '#002a48',
          900: '#001524',
        },
        secondary: {
          50: '#fde8e7',
          100: '#fbd1cf',
          200: '#f7a39f',
          300: '#f3756f',
          400: '#ef473f',
          500: '#aa1917', // PEKCON Red
          600: '#881412',
          700: '#660f0e',
          800: '#440a09',
          900: '#220505',
        },
        accent: {
          50: '#fef0f1',
          100: '#fde1e3',
          200: '#fbc3c7',
          300: '#f9a5ab',
          400: '#f7878f',
          500: '#e55f65', // PEKCON Coral
          600: '#b74c51',
          700: '#89393d',
          800: '#5c2628',
          900: '#2e1314',
        },
        dark: {
          900: '#0A1628',
          800: '#1E293B',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-inter)', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
