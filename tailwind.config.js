/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // optional if using pages dir
],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#66cc99',
          'green-light': '#85d9af',
          'green-dark': '#4db882',
          'green-muted': '#e8f8f1',
          'green-subtle': '#f2fbf7',
        },
        surface: {
          white: '#ffffff',
          gray: '#f8fafb',
          border: '#e8edf0',
          'border-dark': '#d1dde4',
        },
        text: {
          primary: '#0f1923',
          secondary: '#4a5568',
          muted: '#8a9ab0',
          inverse: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.06)',
        green: '0 4px 20px rgba(102, 204, 153, 0.3)',
        'green-lg': '0 8px 32px rgba(102, 204, 153, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};