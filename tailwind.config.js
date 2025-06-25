/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0F9',
          100: '#CCE0F4',
          200: '#99C2E9',
          300: '#66A3DE',
          400: '#3385D3',
          500: '#0A66C2',
          600: '#08529B',
          700: '#063D75',
          800: '#04294E',
          900: '#021427'
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#0E9F6E',
          600: '#057A55',
          700: '#046C4E',
          800: '#03543F',
          900: '#014737'
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
        success: {
          500: '#10B981'
        },
        warning: {
          500: '#F59E0B'
        },
        error: {
          500: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Glacial Indifference', 'Helvetica', 'Arial', 'sans-serif']
      },
      spacing: {
        4.5: '1.125rem'
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        hover:
          '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      transitionProperty: {
        height: 'height'
      }
    }
  },
  plugins: []
};
