import safeArea from 'tailwindcss-safe-area'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '!**/node_modules/**'],
  theme: {
    extend: {
      fontSize: {
        xxs: [
          '0.63rem',
          {
            lineHeight: '1rem',
            fontWeight: '500',
          },
        ],
        base1420: [
          '0.88rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '400',
          },
        ],
        base1826: [
          '1.13rem',
          {
            lineHeight: '1.63rem',
            fontWeight: '400',
          },
        ],
        base22: [
          '1rem',
          {
            lineHeight: '1.38rem',
            fontWeight: '400',
          },
        ],
      },
      colors: {
        orange: {
          DEFAULT: '#FF6A00',
        },
        yellow: {
          DEFAULT: '#FFB726',
          light: 'rgba(255, 183, 38, 0.1)',
        },
        navy: {
          DEFAULT: '#1A2033',
          light: 'rgba(26, 32, 51, 0.1)',
          95: 'rgba(26, 32, 51, 0.95)',
        },
        slate: {
          DEFAULT: '#767985',
          10: 'rgba(118, 121, 133, 0.1)',
          5: 'rgba(118, 121, 133, 0.05)',
          2: 'rgba(118, 121, 133, 0.02)',
        },
        zinc: {
          DEFAULT: '#A5A5A5',
          10: 'rgba(165, 165, 165, 0.1)',
          5: 'rgba(165, 165, 165, 0.05)',
          2: 'rgba(165, 165, 165, 0.02)',
        },
        stone: {
          DEFAULT: '#A3A6AD',
          10: 'rgba(163, 166, 173, 0.1)',
          5: 'rgba(163, 166, 173, 0.05)',
          2: 'rgba(163, 166, 173, 0.02)',
        },
        neutral: {
          DEFAULT: '#BBBDC2',
          10: 'rgba(187, 189, 194, 0.1)',
          5: 'rgba(187, 189, 194, 0.05)',
          2: 'rgba(187, 189, 194, 0.02)',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animated'), safeArea],
}
