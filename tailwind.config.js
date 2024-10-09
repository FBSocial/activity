import safeArea from 'tailwindcss-safe-area'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '!**/node_modules/**'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animated'), safeArea],
}
