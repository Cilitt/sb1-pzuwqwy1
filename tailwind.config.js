/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand color with variations
        'primary': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',  // Main primary color
          600: '#7c3aed',  // Darker shade for hover
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Neutral colors for text and backgrounds
        'gray': {
          850: '#1a1b23',  // Darker background
          900: '#111217',  // Darkest background
          950: '#0a0a0c',  // Base background
        },
        // Semantic colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        // Contrast colors for text
        'medium-contrast': '#a8a29e',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#F3F4F6',
            lineHeight: '1.75',
            h1: {
              fontFamily: 'Manrope, Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'Manrope, Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '700',
            },
            h3: {
              fontFamily: 'Manrope, Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '600',
            },
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};