/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        obsidian: '#090D16',
        surface: '#131B2E',
        'surface-2': '#0D1424',
        emerald: { neon: '#00F5D4' },
        violet: { neon: '#7000FF' },
        gold: '#FFD166',
        slate: { 100: '#F8FAFC', 400: '#94A3B8' },
      },
      fontFamily: {
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'float-slow': 'floatY 7s ease-in-out infinite',
        'float-slower': 'floatY 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    logs: false,
    darkTheme: 'obsidian',
    themes: [
      {
        obsidian: {
          primary: '#00F5D4',
          'primary-content': '#05231D',
          secondary: '#7000FF',
          'secondary-content': '#F1E9FF',
          accent: '#FFD166',
          'accent-content': '#33270A',
          neutral: '#131B2E',
          'neutral-content': '#94A3B8',
          'base-100': '#090D16',
          'base-200': '#0D1424',
          'base-300': '#131B2E',
          'base-content': '#F8FAFC',
          info: '#38BDF8',
          success: '#00F5D4',
          warning: '#FFD166',
          error: '#FB7185',
          '--rounded-box': '1.1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.2rem',
        },
      },
    ],
  },
};
