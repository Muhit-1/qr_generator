/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#66cc99',
          'green-light': '#8adcb4',
          'green-dark': '#0b7a52',
          'green-ink': '#075c3d',
          'green-muted': '#e7f7ef',
          'green-subtle': '#f3fbf7',
        },
        surface: {
          white: '#ffffff',
          gray: '#f5f9f7',
          border: '#dee9e4',
          'border-dark': '#c7d8d1',
        },
        text: {
          primary: '#0a1712',
          secondary: '#3f5952',
          muted: '#61776f',
          inverse: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro: ['0.8125rem', { lineHeight: '1.15rem', letterSpacing: '0.02em' }],
        label: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.04em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 23, 18, 0.04), 0 8px 24px rgba(10, 23, 18, 0.05)',
        'card-hover': '0 2px 6px rgba(10, 23, 18, 0.06), 0 16px 40px rgba(10, 23, 18, 0.08)',
        green: '0 4px 16px rgba(11, 122, 82, 0.22)',
        'green-lg': '0 8px 28px rgba(11, 122, 82, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      maxWidth: {
        app: '84rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
